
import React from 'react';

export const SplashScreen: React.FC = () => {
  return (
    <div className="fixed inset-0 z-50 bg-[#0b0b1a] flex flex-col items-center justify-center text-white overflow-hidden">
      {/* Animated Star Background */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(80)].map((_, i) => (
            <div 
                key={i} 
                className="absolute bg-white rounded-full animate-pulse shadow-[0_0_8px_white]" 
                style={{ 
                    top: `${Math.random() * 100}%`, 
                    left: `${Math.random() * 100}%`,
                    width: `${Math.random() * 2 + 1}px`,
                    height: `${Math.random() * 2 + 1}px`,
                    opacity: Math.random() * 0.5 + 0.3,
                    animationDuration: `${Math.random() * 3 + 1}s`,
                    animationDelay: `${Math.random() * 5}s`
                }} 
            />
        ))}
        {/* Floating larger dots */}
        {[...Array(15)].map((_, i) => (
            <div 
                key={`float-${i}`} 
                className="absolute bg-kid-secondary/40 rounded-full animate-float" 
                style={{ 
                    top: `${Math.random() * 100}%`, 
                    left: `${Math.random() * 100}%`,
                    width: `${Math.random() * 10 + 5}px`,
                    height: `${Math.random() * 10 + 5}px`,
                    animationDuration: `${Math.random() * 10 + 10}s`,
                    animationDelay: `${Math.random() * 5}s`,
                    filter: 'blur(4px)'
                }} 
            />
        ))}
      </div>

      <div className="relative z-10 flex flex-col items-center animate-bounce-slow">
        {/* Logo Container */}
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-kid-primary blur-3xl opacity-30 rounded-full animate-pulse"></div>
          <div className="w-44 h-44 bg-gradient-to-br from-kid-primary to-kid-purple rounded-full flex items-center justify-center shadow-[0_0_80px_rgba(255,107,107,0.5)] border-4 border-white/20 relative z-10">
              <span className="text-8xl select-none animate-[wiggle_4s_ease-in-out_infinite]">🪐</span>
          </div>
          {/* Orbiting Rocket */}
          <div className="absolute inset-[-40px] animate-[spin_10s_linear_infinite]">
               <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 text-4xl filter drop-shadow-[0_0_10px_white]">🚀</div>
          </div>
        </div>
        
        <h1 className="text-6xl font-black tracking-tight mb-2 drop-shadow-[0_5px_15px_rgba(0,0,0,0.5)] text-transparent bg-clip-text bg-gradient-to-r from-kid-accent via-white to-kid-secondary">
          Kids Planet
        </h1>
        <p className="text-white/60 font-black text-xl tracking-[0.3em] uppercase">Starting Adventures</p>
      </div>
      
      {/* Refactored Loading Bar: Plasma Style */}
      <div className="mt-16 w-80 h-10 bg-black/40 backdrop-blur-md rounded-2xl overflow-hidden p-1.5 border-2 border-white/10 shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)]">
        <div className="h-full bg-gradient-to-r from-kid-primary via-kid-purple to-kid-secondary rounded-xl animate-[width_4s_ease-in-out_forwards] w-0 relative overflow-hidden">
            {/* Shimmer Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent w-full -translate-x-full animate-[wiggle_1.5s_infinite_linear]"></div>
            {/* Glossy top highlight */}
            <div className="absolute top-0 left-0 right-0 h-1/2 bg-white/20"></div>
        </div>
      </div>
      
      <div className="mt-6 text-white/40 font-bold text-sm tracking-widest animate-pulse">
        PREPARING MAGIC...
      </div>
    </div>
  );
};
