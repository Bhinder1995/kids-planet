
import React, { useState, useMemo } from 'react';
import { LearningItem } from '../types';
import { playTextToSpeech, playSoundEffect } from '../utils/sound';
import { ArrowLeft } from 'lucide-react';

interface LearnZoneProps {
  onComplete: () => void;
  onBack: () => void;
}

export const LearnZone: React.FC<LearnZoneProps> = ({ onComplete, onBack }) => {
  const [activeTab, setActiveTab] = useState<'alphabet' | 'number'>('alphabet');
  const [selectedItem, setSelectedItem] = useState<LearningItem | null>(null);

  const alphabets: LearningItem[] = useMemo(() => Array.from({ length: 26 }, (_, i) => ({
    char: String.fromCharCode(65 + i),
    word: ['Apple', 'Ball', 'Cat', 'Dog', 'Elephant', 'Fish', 'Grapes', 'House', 'Ice Cream', 'Joker', 'Kite', 'Lion', 'Monkey', 'Nest', 'Orange', 'Parrot', 'Queen', 'Rabbit', 'Sun', 'Tiger', 'Umbrella', 'Van', 'Watch', 'X-mas', 'Yak', 'Zebra'][i],
    icon: ['🍎', '⚽', '🐱', '🐶', '🐘', '🐟', '🍇', '🏠', '🍦', '🃏', '🪁', '🦁', '🐵', '🪺', '🍊', '🦜', '👑', '🐰', '☀️', '🐯', '☂️', '🚐', '⌚', '🎄', '🐂', '🦓'][i],
    type: 'alphabet'
  })), []);

  const numbers: LearningItem[] = useMemo(() => {
    const getNumberWord = (num: number): string => {
      const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
      const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
      
      if (num === 100) return "One Hundred";
      if (num < 20) return ones[num];
      
      const t = Math.floor(num / 10);
      const o = num % 10;
      return tens[t] + (o > 0 ? " " + ones[o] : "");
    };

    const getNumberIcon = (num: number): string => {
      const basics = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟'];
      if (num <= 10) return basics[num - 1];
      
      // Fun cyclical icons for higher numbers
      const extras = ['🎈', '⭐', '🍎', '🚗', '🐶', '🦋', '⚽', '🍕', '🚀', '🎸', '🎁', '💎', '🌈', '🍦', '🍪', '🐱', '🦕', '🦁', '🐼', '🐸'];
      return extras[(num - 1) % extras.length];
    };

    return Array.from({ length: 100 }, (_, i) => {
      const num = i + 1;
      return {
        char: num.toString(),
        word: getNumberWord(num),
        icon: getNumberIcon(num),
        type: 'number'
      };
    });
  }, []);

  const handleItemClick = (item: LearningItem) => {
    playSoundEffect('click');
    setSelectedItem(item);
    // Use the utility to ensure sound works on mobile
    playTextToSpeech(`${item.char} is for ${item.word}`, undefined, 'friendly');
    onComplete(); // Trigger star reward
  };

  const handleBack = () => {
    playSoundEffect('click');
    onBack();
  };

  const handleTabChange = (tab: 'alphabet' | 'number') => {
    playSoundEffect('click');
    setActiveTab(tab);
  };

  return (
    <div className="space-y-6">
      <button 
        onClick={handleBack}
        className="flex items-center gap-2 text-gray-600 dark:text-gray-300 font-bold hover:text-kid-primary transition-colors bg-white/50 dark:bg-gray-800/50 px-4 py-2 rounded-full backdrop-blur-sm shadow-sm"
      >
        <ArrowLeft size={24} /> Back
      </button>

      <div className="flex justify-center gap-4 mb-8">
        <button
          onClick={() => handleTabChange('alphabet')}
          className={`px-8 py-3 rounded-full font-black text-xl transition-all transform ${
            activeTab === 'alphabet' ? 'bg-kid-primary text-white scale-110 shadow-lg' : 'bg-white text-gray-400'
          }`}
        >
          ABC
        </button>
        <button
          onClick={() => handleTabChange('number')}
          className={`px-8 py-3 rounded-full font-black text-xl transition-all transform ${
            activeTab === 'number' ? 'bg-kid-secondary text-white scale-110 shadow-lg' : 'bg-white text-gray-400'
          }`}
        >
          1-100
        </button>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3 pb-20">
        {(activeTab === 'alphabet' ? alphabets : numbers).map((item) => (
          <button
            key={item.char}
            onClick={() => handleItemClick(item)}
            className="group aspect-square bg-white dark:bg-gray-800 rounded-3xl shadow-[0_4px_0_rgba(0,0,0,0.1)] active:shadow-none active:translate-y-1 transition-all flex flex-col items-center justify-center border-4 border-transparent hover:border-kid-accent"
          >
            <span className={`font-black text-kid-dark dark:text-white group-hover:scale-110 transition-transform duration-300 ${item.char.length > 2 ? 'text-2xl md:text-3xl' : 'text-3xl md:text-5xl'}`}>
              {item.char}
            </span>
            <span className="opacity-0 group-hover:opacity-100 transition-opacity mt-1 text-xl">
              {item.icon}
            </span>
          </button>
        ))}
      </div>

      {/* Modal for detail view */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedItem(null)}>
          <div className="bg-white dark:bg-gray-800 rounded-[3rem] p-8 max-w-sm w-full text-center animate-bounce-slow shadow-2xl border-8 border-kid-secondary" onClick={e => e.stopPropagation()}>
            <div className="text-8xl mb-4 animate-pulse">{selectedItem.icon}</div>
            <h2 className="text-8xl font-black text-kid-primary mb-2">{selectedItem.char}</h2>
            <p className="text-3xl font-bold text-gray-600 dark:text-gray-300">{selectedItem.word}</p>
            <button 
              className="mt-6 bg-kid-primary text-white font-bold py-3 px-8 rounded-full shadow-lg hover:scale-105 active:scale-95 transition-transform"
              onClick={() => { playSoundEffect('click'); setSelectedItem(null); }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
