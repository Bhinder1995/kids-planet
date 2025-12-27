
import React, { useState } from 'react';
import { generateRhyme } from '../services/geminiService';
import { Music, Play, StopCircle, RefreshCw, ArrowLeft } from 'lucide-react';
import { playTextToSpeech, playSoundEffect } from '../utils/sound';

interface RhymesZoneProps {
  onBack: () => void;
}

export const RhymesZone: React.FC<RhymesZoneProps> = ({ onBack }) => {
  const [rhyme, setRhyme] = useState<string>("Twinkle twinkle little star,\nHow I wonder what you are.\nUp above the world so high,\nLike a diamond in the sky.");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentTopic, setCurrentTopic] = useState('Star');

  const topics = ['Star', 'Cat', 'Robot', 'Moon', 'Bus', 'Dino'];

  const handleTopicClick = async (topic: string) => {
    playSoundEffect('click');
    setCurrentTopic(topic);
    setLoading(true);
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
    
    const newRhyme = await generateRhyme(topic);
    setRhyme(newRhyme);
    setLoading(false);
  };

  const handleSpeak = () => {
    playSoundEffect('click');
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    setIsSpeaking(true);
    playTextToSpeech(rhyme, () => setIsSpeaking(false), 'friendly');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <button 
        onClick={() => { playSoundEffect('click'); onBack(); }}
        className="flex items-center gap-2 text-gray-600 dark:text-gray-300 font-bold hover:text-kid-primary transition-colors bg-white/50 dark:bg-gray-800/50 px-4 py-2 rounded-full backdrop-blur-sm shadow-sm"
      >
        <ArrowLeft size={24} /> Back
      </button>

      <div className="text-center">
        <h2 className="text-4xl font-black text-kid-primary mb-2 flex justify-center items-center gap-3">
          <Music className="animate-bounce" /> Rhyme Time!
        </h2>
        <p className="text-gray-500 font-bold">Pick a topic to hear a fun song!</p>
      </div>

      <div className="flex flex-wrap justify-center gap-3">
        {topics.map(topic => (
          <button
            key={topic}
            onClick={() => handleTopicClick(topic)}
            className={`
              px-6 py-3 rounded-full font-black text-lg shadow-[0_4px_0_rgba(0,0,0,0.1)] transition-all
              ${currentTopic === topic ? 'bg-kid-purple text-white translate-y-1 shadow-none' : 'bg-white text-gray-500 hover:bg-gray-50 hover:-translate-y-1'}
            `}
          >
            {topic}
          </button>
        ))}
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-[3rem] p-8 shadow-2xl border-8 border-kid-accent relative overflow-hidden min-h-[300px] flex flex-col items-center justify-center">
        {/* Decorative Background Elements */}
        <div className="absolute top-4 left-4 text-6xl opacity-10 animate-wiggle">🎵</div>
        <div className="absolute bottom-4 right-4 text-6xl opacity-10 animate-wiggle" style={{ animationDelay: '1s' }}>🎶</div>
        
        {loading ? (
           <div className="flex flex-col items-center gap-4">
             <RefreshCw className="animate-spin text-kid-secondary" size={48} />
             <p className="font-bold text-gray-400">Writing a song in English...</p>
           </div>
        ) : (
          <>
            <div className="text-center space-y-4 mb-8 w-full">
              {rhyme.split('\n').map((line, i) => (
                <p 
                  key={i} 
                  className={`text-2xl md:text-3xl font-black text-gray-700 dark:text-gray-200 transition-all duration-500`}
                  style={{ 
                     animation: `float 3s ease-in-out infinite`,
                     animationDelay: `${i * 0.5}s` 
                  }}
                >
                  {line}
                </p>
              ))}
            </div>

            <button
              onClick={handleSpeak}
              className={`
                w-20 h-20 rounded-full flex items-center justify-center shadow-xl transition-all hover:scale-110
                ${isSpeaking ? 'bg-red-500 animate-pulse' : 'bg-kid-secondary'}
              `}
            >
              {isSpeaking ? <StopCircle size={40} className="text-white" /> : <Play size={40} className="text-white ml-1" />}
            </button>
          </>
        )}
      </div>
    </div>
  );
};
