
export type SoundMood = 'friendly' | 'dramatic' | 'sincere';

let isSoundEnabled = true;
let cachedVoices: SpeechSynthesisVoice[] = [];
let audioContextUnlocked = false;

// Attempt to unlock audio context for mobile browsers
export const unlockAudio = () => {
  if (audioContextUnlocked) return;
  
  // Unlock Speech Synthesis
  if (window.speechSynthesis) {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance('');
    window.speechSynthesis.speak(utterance);
  }

  // Unlock Web Audio (for sound effects)
  const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
  if (AudioContextClass) {
    const ctx = new AudioContextClass();
    if (ctx.state === 'suspended') {
      ctx.resume();
    }
  }

  audioContextUnlocked = true;
};

const loadVoices = () => {
  if (typeof window !== 'undefined' && window.speechSynthesis) {
    cachedVoices = window.speechSynthesis.getVoices();
  }
};

if (typeof window !== 'undefined' && window.speechSynthesis) {
  loadVoices();
  if (window.speechSynthesis.onvoiceschanged !== undefined) {
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }
}

export const setGlobalSoundEnabled = (enabled: boolean) => {
  isSoundEnabled = enabled;
  if (!enabled && window.speechSynthesis) {
    window.speechSynthesis.cancel();
  }
};

export const playTextToSpeech = (text: string, onEnd?: () => void, mood: SoundMood = 'friendly') => {
  if (!isSoundEnabled) {
    if (onEnd) onEnd();
    return;
  }

  if (!window.speechSynthesis) {
    if (onEnd) onEnd();
    return;
  }

  // Crucial for mobile: resume if paused (often happens after interruptions)
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  
  if (cachedVoices.length === 0) {
    cachedVoices = window.speechSynthesis.getVoices();
  }

  const femaleVoice = cachedVoices.find(v => 
    v.name.includes('Google US English') || 
    v.name.includes('Samantha') || 
    v.name.includes('Microsoft Zira') ||
    v.name.includes('Female') ||
    v.name.includes('female')
  );

  if (femaleVoice && (mood === 'friendly' || mood === 'sincere')) {
    utterance.voice = femaleVoice;
  }

  switch (mood) {
    case 'dramatic':
      utterance.rate = 0.85; 
      utterance.pitch = 0.9; 
      break;
    case 'sincere':
      utterance.rate = 0.9; 
      utterance.pitch = 1.0; 
      break;
    case 'friendly':
    default:
      utterance.rate = 0.95; 
      utterance.pitch = 1.15; 
      break;
  }
  
  utterance.volume = 1;
  if (!utterance.voice) {
      utterance.lang = 'en-US'; 
  }

  if (onEnd) utterance.onend = onEnd;

  utterance.onerror = (event: SpeechSynthesisErrorEvent) => {
    // Ignore 'interrupted' errors as they usually happen when we call cancel() to start a new sound
    if (event.error !== 'interrupted' && event.error !== 'canceled') {
      console.error(`Speech synthesis error: ${event.error}`, event);
    }
    if (onEnd) onEnd(); 
  };

  window.speechSynthesis.speak(utterance);
};

export const playSoundEffect = (type: 'correct' | 'wrong' | 'complete' | 'click' | 'cheer') => {
  if (!isSoundEnabled) return;

  const audioFiles = {
    correct: 'https://assets.mixkit.co/active_storage/sfx/2000/2000-preview.mp3',
    wrong: 'https://assets.mixkit.co/active_storage/sfx/2003/2003-preview.mp3',
    complete: 'https://assets.mixkit.co/active_storage/sfx/1435/1435-preview.mp3',
    click: 'https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3',
    cheer: 'https://assets.mixkit.co/active_storage/sfx/2013/2013-preview.mp3'
  };

  try {
    const audio = new Audio(audioFiles[type]);
    audio.volume = type === 'cheer' ? 0.6 : 0.5;
    // Mobile browsers require direct click context to play new Audio objects
    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise.catch(error => {
        // Silent catch for autoplay blocking
      });
    }
  } catch (e) {
    console.error("Sound effect error", e);
  }
};
