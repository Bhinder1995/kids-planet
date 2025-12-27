
import React, { useState, useEffect } from 'react';
import { UserProgress } from '../types';
import { Lock, ArrowLeft, Check } from 'lucide-react';
import { playSoundEffect } from '../utils/sound';
import { AVATARS } from '../utils/avatars';
import { THEMES } from '../utils/themes';

interface AvatarBuilderProps {
  progress: UserProgress;
  onUpdate: (id: number) => void;
  onUpdateTheme: (id: string) => void;
  onBack: () => void;
  onPreview: (id: number | null) => void;
}

export const AvatarBuilder: React.FC<AvatarBuilderProps> = ({ progress, onUpdate, onUpdateTheme, onBack, onPreview }) => {
  const [selectedId, setSelectedId] = useState(progress.avatarId);

  // Sync selection with parent preview state for live header updates
  useEffect(() => {
    onPreview(selectedId);
  }, [selectedId, onPreview]);

  // Reset preview when leaving this screen
  useEffect(() => {
    return () => onPreview(null);
  }, [onPreview]);

  const handleSelect = (av: typeof AVATARS[0]) => {
    if (progress.level >= av.level) {
      setSelectedId(av.id);
      playSoundEffect('click');
    } else {
      playSoundEffect('wrong');
    }
  };

  const handleSave = () => {
    playSoundEffect('correct');
    onUpdate(selectedId);
  };

  const handleThemeChange = (themeId: string) => {
    playSoundEffect('click');
    onUpdateTheme(themeId);
  };

  return (
    <div className="flex flex-col items-center space-y-8 bg-white dark:bg-gray-800 p-6 md:p-8 rounded-3xl shadow-xl border-b-8 border-kid-primary transition-colors duration-500">
      <div className="w-full flex justify-start">
        <button 
          onClick={() => { playSoundEffect('click'); onBack(); }}
          className="flex items-center gap-2 text-gray-600 dark:text-gray-300 font-bold hover:text-kid-primary transition-colors bg-gray-100 dark:bg-gray-700 px-4 py-2 rounded-full"
        >
          <ArrowLeft size={24} /> Back
        </button>
      </div>

      <div className="text-center">
        <h2 className="text-4xl font-black text-kid-dark dark:text-white mb-2">Avatar Studio</h2>
        <p className="text-gray-500 font-bold">Unlock cool characters as you level up!</p>
      </div>
      
      {/* Avatar Grid */}
      <div className="grid grid-cols-4 sm:grid-cols-4 md:grid-cols-4 gap-4">
        {AVATARS.map((av) => {
          const isLocked = progress.level < av.level;
          const isSelected = selectedId === av.id;

          return (
            <button
              key={av.id}
              onClick={() => handleSelect(av)}
              className={`
                relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center text-4xl transition-all duration-300
                ${isSelected ? 'scale-110 ring-4 ring-kid-primary shadow-xl z-10' : 'hover:scale-105'}
                ${isLocked ? 'bg-gray-200 cursor-not-allowed opacity-70' : 'cursor-pointer shadow-md'}
              `}
              style={{ backgroundColor: isLocked ? undefined : av.bg }}
            >
              {isLocked ? (
                <>
                  <span className="opacity-30 grayscale filter text-2xl">{av.icon}</span>
                  <div className="absolute inset-0 flex items-center justify-center bg-black/10 rounded-2xl">
                    <Lock size={20} className="text-gray-500" />
                  </div>
                  <div className="absolute -bottom-2 bg-gray-600 text-white text-[10px] px-2 rounded-full font-bold">
                    Lvl {av.level}
                  </div>
                </>
              ) : (
                av.icon
              )}
            </button>
          );
        })}
      </div>

      {/* Current Preview */}
      <div className="bg-gray-100 dark:bg-gray-700 p-6 rounded-[2rem] w-full max-w-sm text-center transform hover:scale-105 transition-transform duration-300">
        <p className="text-gray-500 dark:text-gray-400 font-bold mb-4 uppercase tracking-widest text-xs">Current Look</p>
        <div className="inline-block p-3 rounded-full ring-8 ring-white dark:ring-gray-600 shadow-2xl bg-white dark:bg-gray-800">
             <div className="w-32 h-32 rounded-full flex items-center justify-center text-7xl animate-bounce-slow" style={{ backgroundColor: AVATARS.find(a => a.id === selectedId)?.bg }}>
                {AVATARS.find(a => a.id === selectedId)?.icon}
             </div>
        </div>
        <p className="mt-6 font-black text-2xl text-gray-800 dark:text-white">
          Level {progress.level} Explorer
        </p>
      </div>

      <button
        onClick={handleSave}
        className="bg-kid-primary text-white text-xl font-bold py-4 px-12 rounded-full shadow-lg hover:bg-kid-secondary hover:scale-105 transition-all active:scale-95 mb-8"
      >
        Save Avatar
      </button>

      {/* Theme Selector Section */}
      <div className="w-full pt-8 border-t-4 border-gray-100 dark:border-gray-700">
        <h2 className="text-3xl font-black text-center mb-6 text-kid-dark dark:text-white flex items-center justify-center gap-2">
           Pick Your World 🎨
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {THEMES.map(theme => {
            const isActive = progress.themeId === theme.id;
            return (
              <button
                key={theme.id}
                onClick={() => handleThemeChange(theme.id)}
                className={`
                  relative h-32 rounded-3xl overflow-hidden transition-all duration-300 shadow-md group
                  ${isActive ? 'ring-4 ring-kid-dark scale-105 shadow-xl z-10' : 'hover:scale-105 hover:shadow-lg'}
                `}
              >
                {/* Theme Preview Swatches */}
                <div className="absolute inset-0 flex flex-col">
                  <div className="flex-1" style={{ backgroundColor: theme.colors.primary }}></div>
                  <div className="flex-1" style={{ backgroundColor: theme.colors.secondary }}></div>
                  <div className="flex-1" style={{ backgroundColor: theme.colors.accent }}></div>
                </div>
                
                {/* Overlay Content */}
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/10 group-hover:bg-black/0 transition-colors">
                  <span className="text-4xl drop-shadow-md mb-1">{theme.icon}</span>
                  <span className="font-black text-white text-sm drop-shadow-md px-2 py-1 bg-black/20 rounded-full">
                    {theme.name}
                  </span>
                </div>

                {isActive && (
                   <div className="absolute top-2 right-2 bg-white text-green-500 rounded-full p-1 shadow-md">
                      <Check size={16} strokeWidth={4} />
                   </div>
                )}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  );
};
