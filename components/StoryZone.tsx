
import React, { useState } from 'react';
import { generateKidStory, explainTopic } from '../services/geminiService';
import { Story } from '../types';
import { BookOpen, Mic, Volume2, StopCircle, Loader2, ArrowLeft, Heart, Search, Sparkles } from 'lucide-react';
import { playTextToSpeech, playSoundEffect } from '../utils/sound';

interface StoryZoneProps {
  onComplete: () => void;
  onBack: () => void;
  favorites: Story[];
  onToggleFavorite: (story: Story) => void;
}

export const StoryZone: React.FC<StoryZoneProps> = ({ onComplete, onBack, favorites, onToggleFavorite }) => {
  const [mode, setMode] = useState<'story' | 'learn'>('story');
  const [topic, setTopic] = useState('');
  const [story, setStory] = useState<Story | null>(null);
  const [explanation, setExplanation] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const handleGenerate = async () => {
    playSoundEffect('click');
    if (!topic.trim()) return;
    setIsLoading(true);
    setStory(null);
    setExplanation(null);
    window.speechSynthesis.cancel();
    
    if (mode === 'story') {
      const result = await generateKidStory(topic);
      setStory(result);
      onComplete(); 
    } else {
      const result = await explainTopic(topic);
      setExplanation(result);
    }
    
    setIsLoading(false);
  };

  const handleSpeak = (text: string) => {
    playSoundEffect('click');
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }
    setIsSpeaking(true);
    playTextToSpeech(text, () => setIsSpeaking(false), mode === 'story' ? 'dramatic' : 'friendly');
  };

  const isFavorite = story && favorites.some(f => f.title === story.title); // Simple check by title for now

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <button 
          onClick={() => { playSoundEffect('click'); onBack(); }}
          className="flex items-center gap-2 text-gray-600 dark:text-gray-300 font-bold hover:text-kid-primary transition-colors bg-white/50 dark:bg-gray-800/50 px-4 py-2 rounded-full backdrop-blur-sm shadow-sm"
        >
          <ArrowLeft size={24} /> Back
        </button>

        {/* Mode Toggle */}
        <div className="bg-white dark:bg-gray-800 p-1 rounded-full flex shadow-sm border border-gray-100 dark:border-gray-700">
           <button 
             onClick={() => { playSoundEffect('click'); setMode('story'); setTopic(''); setStory(null); setExplanation(null); }}
             className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${mode === 'story' ? 'bg-kid-accent text-gray-900 shadow-md' : 'text-gray-500'}`}
           >
             Story Time 📖
           </button>
           <button 
             onClick={() => { playSoundEffect('click'); setMode('learn'); setTopic(''); setStory(null); setExplanation(null); }}
             className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${mode === 'learn' ? 'bg-kid-secondary text-white shadow-md' : 'text-gray-500'}`}
           >
             Ask Professor 🎓
           </button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-[2rem] p-8 shadow-xl border-b-8 border-kid-primary">
        <h2 className="text-3xl font-black text-center mb-2 text-kid-primary">
          {mode === 'story' ? "Magic Story Machine" : "Discovery Lab"}
        </h2>
        <p className="text-center text-gray-400 font-bold mb-6">
          {mode === 'story' ? "Type anything to create a story!" : "Want to learn something new? Ask away!"}
        </p>
        
        <div className="space-y-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder={mode === 'story' ? "e.g. A cat who loves pizza..." : "e.g. Why is the sky blue?"}
              className="flex-1 p-4 rounded-2xl border-2 border-gray-200 dark:border-gray-600 dark:bg-gray-700 font-bold outline-none focus:border-kid-secondary text-lg"
              onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
            />
            <button
              onClick={handleGenerate}
              disabled={isLoading || !topic}
              className="bg-kid-secondary text-white px-6 rounded-2xl font-bold shadow-lg disabled:opacity-50 hover:bg-teal-400 transition-colors flex items-center gap-2"
            >
              {isLoading ? <Loader2 className="animate-spin" /> : (mode === 'story' ? <Sparkles /> : <Search />)}
            </button>
          </div>
          
          {/* Quick Suggestions */}
          <div className="flex flex-wrap gap-2 justify-center">
            {(mode === 'story' ? ['A brave astronaut', 'A lost puppy', 'A magical tree'] : ['Why do birds fly?', 'What are stars?', 'How do fish sleep?']).map(t => (
              <button
                key={t}
                onClick={() => { playSoundEffect('click'); setTopic(t); }}
                className="bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full text-sm font-bold text-gray-500 hover:bg-kid-light hover:text-kid-primary transition-colors"
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Story Result */}
      {story && mode === 'story' && (
        <div className="bg-white dark:bg-gray-800 rounded-[2rem] overflow-hidden shadow-2xl animate-fade-in-up">
          <div className="bg-kid-accent p-6 flex justify-between items-center">
            <h3 className="text-2xl font-black text-gray-800 line-clamp-1">{story.title}</h3>
            <div className="flex gap-2">
              <button 
                onClick={() => { playSoundEffect('click'); onToggleFavorite(story); }}
                className={`p-3 rounded-full shadow-md hover:scale-110 transition-transform ${isFavorite ? 'bg-red-500 text-white' : 'bg-white text-gray-300'}`}
              >
                <Heart size={24} fill={isFavorite ? "currentColor" : "none"} />
              </button>
              <button 
                onClick={() => handleSpeak(`${story.title}. ${story.content}`)}
                className="bg-white text-kid-primary p-3 rounded-full shadow-md hover:scale-110 transition-transform"
              >
                {isSpeaking ? <StopCircle size={24} fill="currentColor" /> : <Volume2 size={24} />}
              </button>
            </div>
          </div>
          
          <div className="p-8 space-y-6">
            <p className="text-xl leading-relaxed font-medium text-gray-700 dark:text-gray-200 whitespace-pre-line">
              {story.content}
            </p>
            
            <div className="bg-blue-50 dark:bg-gray-700 p-4 rounded-xl border-l-4 border-blue-400">
              <p className="font-bold text-blue-500 dark:text-blue-300 uppercase text-xs mb-1">Moral</p>
              <p className="font-bold text-lg italic text-gray-800 dark:text-white">"{story.moral}"</p>
            </div>
          </div>
        </div>
      )}

      {/* Explanation Result */}
      {explanation && mode === 'learn' && (
        <div className="bg-white dark:bg-gray-800 rounded-[2rem] p-8 shadow-2xl animate-fade-in-up border-4 border-kid-secondary relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
             <Search size={100} />
          </div>
          <h3 className="text-2xl font-black text-kid-secondary mb-4">Did You Know?</h3>
          <p className="text-xl leading-relaxed font-medium text-gray-700 dark:text-gray-200 mb-6">
            {explanation}
          </p>
          <div className="flex justify-end">
            <button 
                onClick={() => handleSpeak(explanation)}
                className="bg-kid-light text-kid-primary px-6 py-2 rounded-full font-bold shadow-md hover:scale-105 transition-transform flex items-center gap-2"
              >
                {isSpeaking ? <StopCircle size={20} /> : <Volume2 size={20} />} Read Aloud
            </button>
          </div>
        </div>
      )}

      {/* Favorites List */}
      {mode === 'story' && !story && favorites.length > 0 && (
        <div className="mt-8">
           <h3 className="text-xl font-black text-gray-400 mb-4 px-4">Your Favorites</h3>
           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {favorites.map(fav => (
                <button 
                  key={fav.id || fav.title} 
                  onClick={() => { playSoundEffect('click'); setStory(fav); }}
                  className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-md text-left border-2 border-transparent hover:border-kid-accent transition-colors"
                >
                  <h4 className="font-bold text-gray-800 dark:text-white truncate">{fav.title}</h4>
                  <p className="text-xs text-gray-400 truncate">{fav.moral}</p>
                </button>
              ))}
           </div>
        </div>
      )}
    </div>
  );
};
