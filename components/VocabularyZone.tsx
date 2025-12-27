
import React, { useState } from 'react';
import { Volume2, ArrowLeft } from 'lucide-react';
import { playTextToSpeech, playSoundEffect } from '../utils/sound';

interface VocabularyZoneProps {
  onBack: () => void;
}

export const VocabularyZone: React.FC<VocabularyZoneProps> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState<'animals' | 'fruits' | 'nature' | 'colors' | 'weekdays' | 'months' | 'seasons'>('animals');

  const data = {
    animals: [
      { name: 'Lion', icon: '🦁', color: '#8B4513' },
      { name: 'Tiger', icon: '🐯', color: '#CD853F' },
      { name: 'Elephant', icon: '🐘', color: '#708090' },
      { name: 'Monkey', icon: '🐵', color: '#A0522D' },
      { name: 'Dog', icon: '🐶', color: '#D2B48C' },
      { name: 'Cat', icon: '🐱', color: '#696969' },
      { name: 'Zebra', icon: '🦓', color: '#2F4F4F' },
      { name: 'Cow', icon: '🐮', color: '#556B2F' },
      { name: 'Sheep', icon: '🐑', color: '#483D8B' },
      { name: 'Pig', icon: '🐷', color: '#C71585' },
      { name: 'Panda', icon: '🐼', color: '#1C1C1C' },
      { name: 'Rabbit', icon: '🐰', color: '#4B0082' },
      { name: 'Bear', icon: '🐻', color: '#5C4033' },
      { name: 'Fox', icon: '🦊', color: '#8B0000' },
      { name: 'Giraffe', icon: '🦒', color: '#9B870C' },
      { name: 'Horse', icon: '🐴', color: '#4E2728' },
      { name: 'Deer', icon: '🦌', color: '#5C4033' },
      { name: 'Kangaroo', icon: '🦘', color: '#8B4513' },
      { name: 'Koala', icon: '🐨', color: '#696969' },
      { name: 'Penguin', icon: '🐧', color: '#001F3F' },
      { name: 'Duck', icon: '🦆', color: '#556B2F' },
      { name: 'Chicken', icon: '🐔', color: '#8B0000' },
      { name: 'Owl', icon: '🦉', color: '#333333' },
      { name: 'Frog', icon: '🐸', color: '#006400' },
      { name: 'Turtle', icon: '🐢', color: '#004d40' },
      { name: 'Dolphin', icon: '🐬', color: '#003366' },
      { name: 'Whale', icon: '🐳', color: '#001f3f' },
      { name: 'Octopus', icon: '🐙', color: '#4B0082' },
      { name: 'Crab', icon: '🦀', color: '#8B0000' },
      { name: 'Butterfly', icon: '🦋', color: '#4B0082' },
      { name: 'Bee', icon: '🐝', color: '#827717' },
      { name: 'Ladybug', icon: '🐞', color: '#7f0000' },
      { name: 'Ant', icon: '🐜', color: '#212121' },
      { name: 'Spider', icon: '🕷️', color: '#212121' },
      { name: 'Snake', icon: '🐍', color: '#1B5E20' },
      { name: 'Mouse', icon: '🐭', color: '#424242' },
      { name: 'Hamster', icon: '🐹', color: '#4E342E' },
      { name: 'Wolf', icon: '🐺', color: '#37474F' },
      { name: 'Crocodile', icon: '🐊', color: '#1B5E20' },
    ],
    fruits: [
      { name: 'Apple', icon: '🍎', color: '#7f0000' },
      { name: 'Banana', icon: '🍌', color: '#827717' },
      { name: 'Grapes', icon: '🍇', color: '#4A148C' },
      { name: 'Orange', icon: '🍊', color: '#E65100' },
      { name: 'Strawberry', icon: '🍓', color: '#880E4F' },
      { name: 'Watermelon', icon: '🍉', color: '#1B5E20' },
      { name: 'Pineapple', icon: '🍍', color: '#F57F17' },
      { name: 'Cherry', icon: '🍒', color: '#b71c1c' },
      { name: 'Pear', icon: '🍐', color: '#33691E' },
      { name: 'Mango', icon: '🥭', color: '#FF6F00' },
      { name: 'Lemon', icon: '🍋', color: '#F9A825' },
      { name: 'Peach', icon: '🍑', color: '#D84315' },
      { name: 'Kiwi', icon: '🥝', color: '#558B2F' },
      { name: 'Coconut', icon: '🥥', color: '#3E2723' },
      { name: 'Avocado', icon: '🥑', color: '#1B5E20' },
      { name: 'Melon', icon: '🍈', color: '#689F38' },
      { name: 'Tangerine', icon: '🍊', color: '#BF360C' },
      { name: 'Blueberry', icon: '🫐', color: '#0D47A1' },
      { name: 'Olive', icon: '🫒', color: '#33691E' },
      { name: 'Green Apple', icon: '🍏', color: '#33691E' },
      { name: 'Corn', icon: '🌽', color: '#FFD600' },
      { name: 'Tomato', icon: '🍅', color: '#D50000' },
      { name: 'Carrot', icon: '🥕', color: '#E65100' },
      { name: 'Broccoli', icon: '🥦', color: '#1B5E20' },
      { name: 'Mushroom', icon: '🍄', color: '#424242' },
      { name: 'Pepper', icon: '🫑', color: '#2E7D32' },
      { name: 'Eggplant', icon: '🍆', color: '#4A148C' },
      { name: 'Potato', icon: '🥔', color: '#5D4037' }
    ],
    nature: [
      { name: 'Rose', icon: '🌹', color: '#880E4F' },
      { name: 'Sunflower', icon: '🌻', color: '#F57F17' },
      { name: 'Tulip', icon: '🌷', color: '#C2185B' },
      { name: 'Hibiscus', icon: '🌺', color: '#B71C1C' },
      { name: 'Lotus', icon: '🪷', color: '#4A148C' },
      { name: 'Blossom', icon: '🌸', color: '#AD1457' },
      { name: 'Daisy', icon: '🌼', color: '#F9A825' },
      { name: 'Bouquet', icon: '💐', color: '#37474F' },
      { name: 'Seedling', icon: '🌱', color: '#1B5E20' },
      { name: 'Herb', icon: '🌿', color: '#1B5E20' },
      { name: 'Leaf', icon: '🌿', color: '#1B5E20' },
      { name: 'Cactus', icon: '🌵', color: '#33691E' },
      { name: 'Palm Tree', icon: '🌴', color: '#E65100' },
      { name: 'Tree', icon: '🌳', color: '#1B5E20' },
      { name: 'Pine', icon: '🌲', color: '#1B5E20' },
      { name: 'Shamrock', icon: '☘️', color: '#1B5E20' },
      { name: 'Clover', icon: '🍀', color: '#1B5E20' },
      { name: 'Maple', icon: '🍁', color: '#BF360C' },
      { name: 'Autumn', icon: '🍂', color: '#BF360C' },
      { name: 'Wheat', icon: '🌾', color: '#F57F17' },
    ],
    colors: [
      { name: 'Red', icon: '🔴', color: '#D50000' },
      { name: 'Blue', icon: '🔵', color: '#0D47A1' },
      { name: 'Green', icon: '🟢', color: '#1B5E20' },
      { name: 'Yellow', icon: '🟡', color: '#FFD600' },
      { name: 'Orange', icon: '🟠', color: '#E65100' },
      { name: 'Purple', icon: '🟣', color: '#4A148C' },
      { name: 'Pink', icon: '💗', color: '#C2185B' },
      { name: 'Black', icon: '⚫', color: '#000000' },
      { name: 'White', icon: '⚪', color: '#424242' },
      { name: 'Brown', icon: '🟤', color: '#3E2723' },
      { name: 'Gray', icon: '🌚', color: '#212121' },
      { name: 'Gold', icon: '🪙', color: '#F57F17' },
    ],
    weekdays: [
      { name: 'Monday', icon: '1️⃣', color: '#01579B' },
      { name: 'Tuesday', icon: '2️⃣', color: '#1B5E20' },
      { name: 'Wednesday', icon: '3️⃣', color: '#4A148C' },
      { name: 'Thursday', icon: '4️⃣', color: '#BF360C' },
      { name: 'Friday', icon: '5️⃣', color: '#006064' },
      { name: 'Saturday', icon: '6️⃣', color: '#311B92' },
      { name: 'Sunday', icon: '7️⃣', color: '#b71c1c' },
    ],
    months: [
      { name: 'January', icon: '❄️', color: '#01579B' },
      { name: 'February', icon: '💗', color: '#880E4F' },
      { name: 'March', icon: '🍀', color: '#1B5E20' },
      { name: 'April', icon: '🌧️', color: '#006064' },
      { name: 'May', icon: '🌸', color: '#4A148C' },
      { name: 'June', icon: '☀️', color: '#F57F17' },
      { name: 'July', icon: '🍦', color: '#E65100' },
      { name: 'August', icon: '🏖️', color: '#BF360C' },
      { name: 'September', icon: '🍎', color: '#311B92' },
      { name: 'October', icon: '🎃', color: '#BF360C' },
      { name: 'November', icon: '🦃', color: '#3E2723' },
      { name: 'December', icon: '🎄', color: '#1B5E20' },
    ],
    seasons: [
      { name: 'Spring', icon: '🌸', color: '#C2185B' },
      { name: 'Summer', icon: '☀️', color: '#F57F17' },
      { name: 'Autumn', icon: '🍂', color: '#E65100' },
      { name: 'Winter', icon: '❄️', color: '#0D47A1' },
    ]
  };

  const getTabLabel = (tab: typeof activeTab) => {
     if (tab === 'nature') return 'Nature';
     if (tab === 'colors') return 'Colors';
     if (tab === 'weekdays') return 'Week Days';
     if (tab === 'months') return 'Months';
     if (tab === 'seasons') return 'Seasons';
     return tab;
  };

  const handleTabChange = (tab: typeof activeTab) => {
    playSoundEffect('click');
    setActiveTab(tab);
  };

  const handleItemClick = (name: string) => {
    playSoundEffect('click');
    playTextToSpeech(name, undefined, 'friendly');
  };

  return (
    <div className="space-y-6">
      <button 
        onClick={() => { playSoundEffect('click'); onBack(); }}
        className="flex items-center gap-2 text-gray-300 font-bold hover:text-kid-primary transition-colors bg-gray-800/50 px-4 py-2 rounded-full backdrop-blur-sm shadow-sm border border-white/5"
      >
        <ArrowLeft size={24} /> Back
      </button>

      <h2 className="text-4xl font-black text-center text-kid-accent mb-6">Word Explore!</h2>
      
      <div className="flex justify-center gap-2 md:gap-4 mb-8 overflow-x-auto pb-4 no-scrollbar">
        {(['animals', 'fruits', 'nature', 'colors', 'weekdays', 'months', 'seasons'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => handleTabChange(tab)}
            className={`
              px-6 py-2 rounded-full font-black text-lg capitalize transition-all transform whitespace-nowrap
              ${activeTab === tab 
                ? 'bg-kid-primary text-white scale-110 shadow-lg' 
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }
            `}
          >
            {getTabLabel(tab)}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 pb-20">
        {data[activeTab].map((item) => {
          return (
            <button
              key={item.name}
              onClick={() => handleItemClick(item.name)}
              className="group relative aspect-square rounded-3xl shadow-md hover:shadow-xl transition-all hover:-translate-y-2 flex flex-col items-center justify-center overflow-hidden border-4 border-white/10"
              style={{ backgroundColor: item.color }}
            >
              <span className="text-6xl group-hover:scale-125 transition-transform duration-300 mb-2 drop-shadow-lg">
                {item.icon}
              </span>
              <span className="font-black text-white text-lg drop-shadow-md">{item.name}</span>
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Volume2 size={20} className="text-white/70" />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
