
import React, { useEffect } from 'react';
import { playSoundEffect } from '../utils/sound';

interface FireworksProps {
  active: boolean;
  onComplete: () => void;
  soundEnabled?: boolean;
}

export const Fireworks: React.FC<FireworksProps> = ({ active, onComplete, soundEnabled = true }) => {
  if (!active) return null;

  useEffect(() => {
    if (active) {
      if (soundEnabled) {
        playSoundEffect('cheer');
      }
      
      const timer = setTimeout(() => {
        onComplete();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [active, onComplete, soundEnabled]);

  // CSS-only fireworks overlay using Tailwind arbitrary values for simplicity in a single file
  return (
    <div className="fixed inset-0 z-[100] pointer-events-none flex items-center justify-center overflow-hidden bg-black/40 backdrop-blur-sm animate-fade-in">
      <div className="absolute inset-0 flex items-center justify-center">
        <h1 className="text-6xl md:text-8xl font-black text-white drop-shadow-[0_5px_5px_rgba(0,0,0,0.5)] animate-bounce text-center">
          GREAT JOB! <br/> 🌟🌟🌟
        </h1>
      </div>
      
      {/* Simple CSS Particles */}
      {[...Array(30)].map((_, i) => (
        <div
          key={i}
          className="absolute w-4 h-4 rounded-full animate-ping"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            backgroundColor: ['#FF6B6B', '#4ECDC4', '#FFE66D', '#6C5CE7', '#FF9F1C'][Math.floor(Math.random() * 5)],
            animationDuration: `${0.5 + Math.random()}s`,
            animationDelay: `${Math.random()}s`
          }}
        />
      ))}
       {[...Array(30)].map((_, i) => (
        <div
          key={`sparkle-${i}`}
          className="absolute w-3 h-3 rounded-full animate-bounce"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            backgroundColor: '#FFF',
            animationDuration: `${1 + Math.random()}s`,
          }}
        />
      ))}
    </div>
  );
};
