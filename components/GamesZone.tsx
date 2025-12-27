
import React, { useState, useEffect } from 'react';
import { Gamepad2, Check, RefreshCcw, ArrowRight, RotateCcw, Lightbulb, Star, Trophy, ArrowLeft } from 'lucide-react';
import { playSoundEffect, playTextToSpeech } from '../utils/sound';

interface GamesZoneProps {
  onComplete: () => void;
  onBack: () => void;
}

interface GameItem {
  id: number;
  content: string;
  type: 'icon' | 'word';
  pairId: number;
  color?: string;
}

export const GamesZone: React.FC<GamesZoneProps> = ({ onComplete, onBack }) => {
  const [level, setLevel] = useState(1);
  const [selectedLeft, setSelectedLeft] = useState<number | null>(null);
  const [matchedPairs, setMatchedPairs] = useState<number[]>([]);
  const [shuffledLeft, setShuffledLeft] = useState<GameItem[]>([]);
  const [shuffledRight, setShuffledRight] = useState<GameItem[]>([]);
  const [wrongPair, setWrongPair] = useState<number | null>(null);
  const [hintIds, setHintIds] = useState<number[]>([]);
  const [isLevelComplete, setIsLevelComplete] = useState(false);

  const levels = [
    // Level 1: Basics
    [
      { id: 1, icon: '🍎', word: 'Apple' },
      { id: 2, icon: '🚗', word: 'Car' },
      { id: 3, icon: '🐶', word: 'Dog' }
    ],
    // Level 2: Farm Animals
    [
      { id: 4, icon: '🐮', word: 'Cow' },
      { id: 5, icon: '🐷', word: 'Pig' },
      { id: 6, icon: '🐑', word: 'Sheep' },
      { id: 7, icon: '🐔', word: 'Hen' },
      { id: 8, icon: '🐴', word: 'Horse' }
    ],
    // Level 3: Wild Animals
    [
      { id: 9, icon: '🦁', word: 'Lion' },
      { id: 10, icon: '🦓', word: 'Zebra' },
      { id: 11, icon: '🦒', word: 'Giraffe' },
      { id: 12, icon: '🐘', word: 'Elephant' },
      { id: 13, icon: '🐼', word: 'Panda' }
    ],
    // Level 4: Fruits
    [
      { id: 14, icon: '🍌', word: 'Banana' },
      { id: 15, icon: '🍇', word: 'Grapes' },
      { id: 16, icon: '🍊', word: 'Orange' },
      { id: 17, icon: '🍓', word: 'Strawberry' },
      { id: 18, icon: '🍉', word: 'Melon' }
    ],
    // Level 5: Flowers
    [
      { id: 19, icon: '🌹', word: 'Rose' },
      { id: 20, icon: '🌻', word: 'Sunflower' },
      { id: 21, icon: '🌷', word: 'Tulip' },
      { id: 22, icon: '🌺', word: 'Hibiscus' },
      { id: 23, icon: '🌸', word: 'Blossom' }
    ],
     // Level 6: Birds
    [
      { id: 24, icon: '🦜', word: 'Parrot' },
      { id: 25, icon: '🦉', word: 'Owl' },
      { id: 26, icon: '🦅', word: 'Eagle' },
      { id: 27, icon: '🦚', word: 'Peacock' },
      { id: 28, icon: '🐧', word: 'Penguin' }
    ],
    // Level 7: Sea Animals
    [
      { id: 29, icon: '🐙', word: 'Octopus' },
      { id: 30, icon: '🐬', word: 'Dolphin' },
      { id: 31, icon: '🦀', word: 'Crab' },
      { id: 32, icon: '🦈', word: 'Shark' },
      { id: 33, icon: '🐳', word: 'Whale' }
    ],
    // Level 8: Vehicles
    [
      { id: 34, icon: '🚌', word: 'Bus' },
      { id: 35, icon: '✈️', word: 'Plane' },
      { id: 36, icon: '🚂', word: 'Train' },
      { id: 37, icon: '🚢', word: 'Ship' },
      { id: 38, icon: '🚑', word: 'Ambulance' }
    ],
    // Level 9: Colors
    [
      { id: 39, icon: '🔴', word: 'Red' },
      { id: 40, icon: '🔵', word: 'Blue' },
      { id: 41, icon: '🟢', word: 'Green' },
      { id: 42, icon: '🟡', word: 'Yellow' },
      { id: 43, icon: '⚫', word: 'Black' }
    ],
    // Level 10: Shapes
    [
      { id: 44, icon: '⭕', word: 'Circle' },
      { id: 45, icon: '🟥', word: 'Square' },
      { id: 46, icon: '🔺', word: 'Triangle' },
      { id: 47, icon: '⭐', word: 'Star' },
      { id: 48, icon: '💙', word: 'Heart' }
    ],
    // Level 11: Insects
    [
      { id: 49, icon: '🦋', word: 'Butterfly' },
      { id: 50, icon: '🐝', word: 'Bee' },
      { id: 51, icon: '🐞', word: 'Ladybug' },
      { id: 52, icon: '🕷️', word: 'Spider' },
      { id: 53, icon: '🐜', word: 'Ant' }
    ],
    // Level 12: Body Parts
    [
      { id: 54, icon: '👁️', word: 'Eye' },
      { id: 55, icon: '👂', word: 'Ear' },
      { id: 56, icon: '👃', word: 'Nose' },
      { id: 57, icon: '👄', word: 'Mouth' },
      { id: 58, icon: '✋', word: 'Hand' }
    ],
    // Level 13: Clothing
    [
      { id: 59, icon: '👕', word: 'Shirt' },
      { id: 60, icon: '👖', word: 'Pants' },
      { id: 61, icon: '👗', word: 'Dress' },
      { id: 62, icon: '👟', word: 'Shoe' },
      { id: 63, icon: '🧢', word: 'Hat' }
    ],
    // Level 14: Family
    [
      { id: 64, icon: '👶', word: 'Baby' },
      { id: 65, icon: '👦', word: 'Boy' },
      { id: 66, icon: '👧', word: 'Girl' },
      { id: 67, icon: '👨', word: 'Man' },
      { id: 68, icon: '👩', word: 'Woman' }
    ],
    // Level 15: Weather
    [
      { id: 69, icon: '☀️', word: 'Sun' },
      { id: 70, icon: '☁️', word: 'Cloud' },
      { id: 71, icon: '🌧️', word: 'Rain' },
      { id: 72, icon: '❄️', word: 'Snow' },
      { id: 73, icon: '🌈', word: 'Rainbow' }
    ],
    // Level 16: School Items
    [
      { id: 74, icon: '📕', word: 'Book' },
      { id: 75, icon: '✏️', word: 'Pencil' },
      { id: 76, icon: '🎒', word: 'Bag' },
      { id: 77, icon: '✂️', word: 'Scissors' },
      { id: 78, icon: '📏', word: 'Ruler' }
    ],
    // Level 17: Sports
    [
      { id: 79, icon: '⚽', word: 'Soccer' },
      { id: 80, icon: '🏀', word: 'Basketball' },
      { id: 81, icon: '🎾', word: 'Tennis' },
      { id: 82, icon: '🥇', word: 'Medal' },
      { id: 83, icon: '🏆', word: 'Trophy' }
    ],
    // Level 18: Kitchen Items
    [
      { id: 84, icon: '🥄', word: 'Spoon' },
      { id: 85, icon: '🍴', word: 'Fork' },
      { id: 86, icon: '🥣', word: 'Bowl' },
      { id: 87, icon: '🥤', word: 'Cup' },
      { id: 88, icon: '🍳', word: 'Pan' }
    ],
    // Level 19: Emotions
    [
      { id: 89, icon: '😀', word: 'Happy' },
      { id: 90, icon: '😢', word: 'Sad' },
      { id: 91, icon: '😠', word: 'Angry' },
      { id: 92, icon: '😲', word: 'Surprised' },
      { id: 93, icon: '😎', word: 'Cool' }
    ],
    // Level 20: Jobs
    [
      { id: 94, icon: '👨‍⚕️', word: 'Doctor' },
      { id: 95, icon: '👮', word: 'Police' },
      { id: 96, icon: '👨‍🚒', word: 'Fireman' },
      { id: 97, icon: '👨‍🍳', word: 'Chef' },
      { id: 98, icon: '🎨', word: 'Artist' }
    ]
  ];

  const initializeLevel = () => {
    const currentData = levels[(level - 1) % levels.length];
    
    const leftItems: GameItem[] = currentData.map(item => ({
      id: item.id, content: item.icon, type: 'icon', pairId: item.id
    }));
    
    const rightItems: GameItem[] = currentData.map(item => ({
      id: item.id + 100, content: item.word, type: 'word', pairId: item.id
    }));

    // Shuffle
    setShuffledLeft([...leftItems].sort(() => Math.random() - 0.5));
    setShuffledRight([...rightItems].sort(() => Math.random() - 0.5));
    setMatchedPairs([]);
    setSelectedLeft(null);
    setWrongPair(null);
    setHintIds([]);
    setIsLevelComplete(false);
  };

  useEffect(() => {
    initializeLevel();
  }, [level]);

  const handleCardClick = (side: 'left' | 'right', id: number, pairId: number) => {
    if (matchedPairs.includes(pairId) || isLevelComplete) return;

    if (side === 'left') {
      setSelectedLeft(pairId);
      setWrongPair(null);
      playSoundEffect('click');
    } else {
      if (selectedLeft === pairId) {
        // Match found!
        playSoundEffect('correct');
        const newMatched = [...matchedPairs, pairId];
        setMatchedPairs(newMatched);
        setSelectedLeft(null);
        setHintIds([]); // Clear hint if they found a match
        
        // Check level completion
        const currentItemCount = levels[(level - 1) % levels.length].length;
        if (newMatched.length === currentItemCount) {
          setIsLevelComplete(true);
          playSoundEffect('complete');
          onComplete(); // Trigger fireworks
          // Auto advance after short delay
          setTimeout(() => {
             setLevel(l => l + 1);
          }, 3000);
        }
      } else {
        // Wrong match
        if (selectedLeft !== null) {
          playSoundEffect('wrong');
          setWrongPair(id); // Trigger shake on the clicked right card
          setTimeout(() => setWrongPair(null), 500);
        }
        setSelectedLeft(null);
      }
    }
  };

  const handleReset = () => {
    playSoundEffect('click');
    if (window.confirm("Do you want to start over from Level 1?")) {
      setLevel(1);
    }
  };

  const handleHint = () => {
    if (hintIds.length > 0 || isLevelComplete) return;

    // Find pairs that haven't been matched
    const unmatchedPairs = shuffledLeft.filter(item => !matchedPairs.includes(item.pairId));
    
    if (unmatchedPairs.length > 0) {
      // Pick a random unmatched pair
      const randomLeft = unmatchedPairs[Math.floor(Math.random() * unmatchedPairs.length)];
      const matchingRight = shuffledRight.find(item => item.pairId === randomLeft.pairId);
      
      if (randomLeft && matchingRight) {
        playSoundEffect('click');
        setHintIds([randomLeft.id, matchingRight.id]);
        
        // Remove hint after 2 seconds
        setTimeout(() => {
          setHintIds([]);
        }, 2000);
      }
    }
  };

  const handleSkip = () => {
    playSoundEffect('click');
    setLevel(l => l + 1);
  };

  const handleRetry = () => {
    playSoundEffect('click');
    initializeLevel();
  };

  const currentLevelIndex = (level - 1) % levels.length;
  const levelTitles = [
    "Mix & Match",
    "Farm Friends 🐷",
    "Wild Safari 🦁",
    "Yummy Fruits 🍇",
    "Pretty Flowers 🌸",
    "Flying Birds 🦜",
    "Sea World 🐳",
    "Beep Beep! 🚗",
    "Rainbow Colors 🎨",
    "Super Shapes 🔷",
    "Tiny Insects 🐞",
    "My Body 👃",
    "Dress Up 👗",
    "My Family 👨‍👩‍👧",
    "Weather Watch ☁️",
    "School Time 🎒",
    "Sports Fun ⚽",
    "Kitchen Helper 🥣",
    "Feelings 😊",
    "Dream Jobs 👨‍🚒"
  ];
  const levelTitle = levelTitles[currentLevelIndex] || "Fun Match";
  const totalPairs = levels[currentLevelIndex].length;
  const progressPercent = (matchedPairs.length / totalPairs) * 100;

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-10">
      <button 
        onClick={() => { playSoundEffect('click'); onBack(); }}
        className="flex items-center gap-2 text-gray-600 dark:text-gray-300 font-bold hover:text-kid-primary transition-colors bg-white/50 dark:bg-gray-800/50 px-4 py-2 rounded-full backdrop-blur-sm shadow-sm mb-4"
      >
        <ArrowLeft size={24} /> Back
      </button>

      <div className="text-center mb-8 relative">
        <div className="flex justify-between items-center mb-4 px-4">
          <button 
            onClick={handleReset}
            className="p-2 bg-gray-100 hover:bg-red-100 text-gray-400 hover:text-red-500 rounded-full transition-colors flex items-center gap-2 text-xs font-bold"
            title="Reset Game"
          >
            <RotateCcw size={16} /> Reset
          </button>
          
          <button 
            onClick={handleHint}
            disabled={hintIds.length > 0}
            className="p-2 bg-yellow-100 hover:bg-yellow-200 text-yellow-600 rounded-full transition-colors flex items-center gap-2 text-xs font-bold shadow-sm"
          >
            <Lightbulb size={16} className={hintIds.length > 0 ? "animate-pulse" : ""} /> Hint
          </button>
        </div>

        <h2 className="text-4xl font-black text-kid-secondary mb-2 flex justify-center items-center gap-3">
          <Gamepad2 className="animate-bounce" /> {levelTitle}
        </h2>
        
        {/* Progress Bar */}
        <div className="max-w-md mx-auto mt-4 px-4">
          <div className="flex justify-between text-sm font-bold text-gray-400 mb-1">
            <span>Progress</span>
            <span>{matchedPairs.length} / {totalPairs}</span>
          </div>
          <div className="h-4 bg-gray-200 rounded-full overflow-hidden border border-gray-300">
            <div 
              className="h-full bg-green-400 transition-all duration-500 relative"
              style={{ width: `${progressPercent}%` }}
            >
              <div className="absolute inset-0 bg-white/30 animate-[wiggle_2s_infinite]"></div>
            </div>
          </div>
        </div>
        
        <div className="mt-6 flex flex-wrap justify-center items-center gap-4">
           <div className="bg-kid-accent text-kid-dark px-6 py-2 rounded-full font-bold shadow-sm flex items-center gap-2">
             <Trophy size={16} /> Level {level}
           </div>
           
           <div className="flex gap-2">
             <button onClick={handleRetry} className="bg-gray-100 hover:bg-gray-200 text-gray-500 px-4 py-2 rounded-full font-bold flex items-center gap-2 text-sm transition-colors">
               <RefreshCcw size={16} /> Retry Level
             </button>
             <button onClick={handleSkip} className="bg-gray-100 hover:bg-gray-200 text-gray-500 px-4 py-2 rounded-full font-bold flex items-center gap-2 text-sm transition-colors">
               Skip <ArrowRight size={16} />
             </button>
           </div>
        </div>
      </div>

      <div className="flex justify-between gap-4 md:gap-16">
        {/* Left Column (Icons) */}
        <div className="flex-1 space-y-4">
          {shuffledLeft.map(item => (
            <button
              key={item.id}
              onClick={() => handleCardClick('left', item.id, item.pairId)}
              disabled={matchedPairs.includes(item.pairId)}
              className={`
                w-full h-20 md:h-28 rounded-3xl text-4xl md:text-5xl flex items-center justify-center shadow-lg transition-all
                ${matchedPairs.includes(item.pairId) ? 'bg-green-100 border-4 border-green-400 opacity-60 scale-95' : 'bg-white hover:scale-105'}
                ${selectedLeft === item.pairId ? 'ring-8 ring-kid-secondary bg-blue-50' : ''}
                ${hintIds.includes(item.id) ? 'ring-4 ring-yellow-400 bg-yellow-50 animate-pulse scale-105' : ''}
              `}
            >
              {matchedPairs.includes(item.pairId) ? <Check className="text-green-500 w-10 h-10 animate-bounce" /> : item.content}
            </button>
          ))}
        </div>

        {/* Right Column (Words) */}
        <div className="flex-1 space-y-4">
          {shuffledRight.map(item => (
            <button
              key={item.id}
              onClick={() => handleCardClick('right', item.id, item.pairId)}
              disabled={matchedPairs.includes(item.pairId)}
              className={`
                w-full h-20 md:h-28 rounded-3xl text-lg md:text-2xl font-black flex items-center justify-center shadow-lg transition-all
                ${matchedPairs.includes(item.pairId) ? 'bg-green-500 text-white scale-95' : 'bg-kid-primary text-white hover:scale-105'}
                ${wrongPair === item.id ? 'bg-red-400 animate-wiggle' : ''}
                ${!matchedPairs.includes(item.pairId) && wrongPair !== item.id ? 'bg-kid-primary text-white' : ''}
                ${hintIds.includes(item.id) ? 'ring-4 ring-yellow-400 bg-yellow-400 text-white animate-pulse scale-105' : ''}
              `}
            >
              {matchedPairs.includes(item.pairId) ? <Star className="text-white w-8 h-8 animate-spin-slow" /> : item.content}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
