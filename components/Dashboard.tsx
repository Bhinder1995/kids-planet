
import React, { useState, useEffect } from 'react';
import { AppRoute, UserProgress, Badge } from '../types';
import { Play, Star, Rocket, BookOpen, Library, MonitorPlay, Gamepad2, Music, Smile, Lightbulb, Trophy, Brain, Lock } from 'lucide-react';
import { SafeAdContainer } from './SafeAd';
import { playSoundEffect } from '../utils/sound';

interface DashboardProps {
  onNavigate: (route: AppRoute) => void;
  progress: UserProgress;
  availableBadges: Badge[];
}

export const Dashboard: React.FC<DashboardProps> = ({ onNavigate, progress, availableBadges }) => {
  const [factIndex, setFactIndex] = useState(0);

  const facts = [
    "Octopuses have three hearts! 🐙",
    "Honey never spoils. 🍯",
    "Bananas are berries! 🍌",
    "Clouds are heavy! ☁️",
    "Cats sleep a lot. 🐱",
    "Butterflies taste with feet! 🦋",
    "The sun is a star! ☀️",
    "Venus spins backward! 🪐",
    "Sharks have no bones! 🦈",
    "Horses sleep standing up! 🐴",
    "Sloths hold their breath longer than dolphins! 🦥",
    "Ants never sleep! 🐜",
    "Sea otters hold hands when sleeping! 🦦",
    "There are more stars than sand! ✨",
    "Space is completely silent! 🤫",
    "A shrimp's heart is in its head! 🦐",
    "Crocodiles can't stick tongues out! 🐊"
  ];

  useEffect(() => {
    setFactIndex(Math.floor(Math.random() * facts.length));
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setFactIndex((prev) => (prev + 1) % facts.length);
    }, 8000); 
    return () => clearInterval(timer);
  }, []);

  const handleNextFact = () => {
    playSoundEffect('click');
    setFactIndex((prev) => (prev + 1) % facts.length);
  };

  const handleNavigate = (route: AppRoute) => {
    playSoundEffect('click');
    onNavigate(route);
  };

  const isDailyComplete = progress.dailyStats.lastPlayedDate === new Date().toDateString() && progress.dailyStats.questionsAnswered >= 2;
  
  const BigCard = ({ title, color, icon, route, desc, emoji }: any) => (
    <button
      onClick={() => handleNavigate(route)}
      className={`
        relative overflow-hidden group w-full text-left
        p-6 rounded-[2rem] shadow-[0_10px_0_rgba(0,0,0,0.2)] 
        transition-all duration-300 
        hover:-translate-y-2 hover:shadow-[0_20px_0_rgba(0,0,0,0.3)] hover:rotate-1
        active:translate-y-[0px] active:shadow-none active:rotate-0
      `}
      style={{ backgroundColor: color }}
    >
      <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:scale-150 group-hover:rotate-12 transition-transform duration-500">
        <span className="text-9xl">{emoji}</span>
      </div>
      
      <div className="relative z-10">
        <div className="bg-white/20 w-12 h-12 rounded-xl flex items-center justify-center mb-4 backdrop-blur-sm group-hover:scale-110 transition-transform">
           {icon}
        </div>
        <h2 className="text-2xl font-black text-white mb-1 drop-shadow-md">{title}</h2>
        <p className="text-white/90 font-bold text-sm">{desc}</p>
        <div className="mt-6 inline-flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full text-white text-sm font-bold backdrop-blur-sm group-hover:bg-white group-hover:text-gray-800 transition-colors">
          <Play size={16} className="fill-current" />
          Play Now
        </div>
      </div>
    </button>
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-4">
        <div className="space-y-1 text-left w-full">
          <h1 className="text-4xl md:text-5xl font-black text-kid-accent animate-bounce-slow text-left">
            Welcome back!
          </h1>
          <p className="text-lg text-gray-400 text-left">Ready to learn something new?</p>
        </div>
        
        <button 
          onClick={() => {
             playSoundEffect('click');
             !isDailyComplete && onNavigate(AppRoute.CHALLENGE);
          }}
          className={`
            relative overflow-hidden rounded-2xl p-0.5 shadow-lg transition-transform hover:scale-105
            bg-gradient-to-r from-purple-500 to-indigo-600 md:w-auto w-full shrink-0
            ${isDailyComplete ? 'opacity-80' : ''}
          `}
        >
          <div className="bg-white/10 backdrop-blur-sm px-4 py-3 rounded-[0.9rem] flex items-center gap-3">
             <div className="bg-white text-purple-600 p-2 rounded-full shadow-lg">
                {isDailyComplete ? <Trophy size={18} className="fill-yellow-400 text-yellow-500" /> : <Brain size={18} />}
             </div>
             <div className="text-left">
                <h3 className="text-white font-black text-sm uppercase tracking-wide">Daily Quest</h3>
                <p className="text-white/90 text-xs font-bold">
                  {isDailyComplete ? "Complete! ✅" : "Win a Badge! 🚀"}
                </p>
             </div>
          </div>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div 
          onClick={handleNextFact}
          className="bg-gradient-to-r from-yellow-300 to-orange-400 rounded-2xl p-1 shadow-md transform hover:scale-[1.01] active:scale-95 transition-all cursor-pointer select-none"
        >
          <div className="bg-gray-800/90 rounded-[0.9rem] p-3 flex items-center gap-3 relative overflow-hidden h-full">
            <div className="bg-yellow-400 p-2.5 rounded-full text-white shadow-sm animate-pulse shrink-0">
              <Lightbulb size={20} strokeWidth={3} />
            </div>
            <div className="flex-1 z-10 text-left">
              <h3 className="text-[10px] font-black text-orange-400 uppercase tracking-widest mb-0.5">Fun Fact (Tap Me!)</h3>
              <p key={factIndex} className="text-base md:text-lg font-black text-gray-200 animate-fade-in leading-tight">
                "{facts[factIndex]}"
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-2xl p-3 shadow-md border-2 border-white/5 flex flex-col justify-center">
          <div className="flex items-center gap-2 mb-2 px-1">
            <Trophy className="text-yellow-500 w-4 h-4" fill="currentColor" />
            <h3 className="text-sm font-black text-white">My Badges</h3>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar px-1">
            {availableBadges.map(badge => {
              const isUnlocked = progress.badges.includes(badge.id);
              return (
                <div key={badge.id} className={`shrink-0 flex flex-col items-center w-14 ${isUnlocked ? 'opacity-100' : 'opacity-30 grayscale'}`}>
                  <div 
                    className="w-10 h-10 rounded-full flex items-center justify-center text-lg shadow-sm mb-1 border-2 border-white/10"
                    style={{ backgroundColor: isUnlocked ? badge.color : '#374151' }}
                  >
                    {isUnlocked ? badge.icon : <Lock size={14} className="text-gray-500" />}
                  </div>
                  <span className="text-[8px] font-bold text-center leading-tight text-gray-400 truncate w-full">{badge.name}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pt-2">
        <BigCard title="Story Time" desc="Magical moral stories" color="#FF8C00" emoji="📚" icon={<Star className="text-white" />} route={AppRoute.STORIES} />
        <BigCard title="Space Zone" desc="Explore planets!" color="#6C5CE7" emoji="🚀" icon={<Rocket className="text-white" />} route={AppRoute.SPACE} />
        <BigCard title="ABC & 123" desc="Letters & numbers" color="#FF6B6B" emoji="🅰️" icon={<BookOpen className="text-white" />} route={AppRoute.LEARN} />
        <BigCard title="Word Fun" desc="Fruits & Animals" color="#FF9F1C" emoji="🦁" icon={<Library className="text-white" />} route={AppRoute.VOCABULARY} />
        <BigCard title="Good Habits" desc="Moral Videos" color="#2EC4B6" emoji="🎬" icon={<MonitorPlay className="text-white" />} route={AppRoute.VIDEOS} />
        <BigCard title="Game Zone" desc="Match words & win" color="#FF9FF3" emoji="🎮" icon={<Gamepad2 className="text-white" />} route={AppRoute.GAMES} />
        <BigCard title="Fun Rhymes" desc="Sing along songs" color="#4ECDC4" emoji="🎵" icon={<Music className="text-white" />} route={AppRoute.RHYMES} />
        <BigCard title="My Avatar" desc="Customize character" color="#9C88FF" emoji="👾" icon={<Smile className="text-white" />} route={AppRoute.PROFILE} />
      </div>

      <div className="bg-gray-800 rounded-3xl p-6 shadow-lg border-2 border-white/5">
        <div className="flex justify-between items-center mb-2">
           <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">Level Progress</span>
           <span className="text-kid-accent font-black">Lvl {progress.level}</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-4 overflow-hidden border border-white/5">
          <div 
            className="bg-gradient-to-r from-kid-primary to-kid-purple h-4 rounded-full transition-all duration-1000 relative overflow-hidden" 
            style={{ width: `${(progress.stars % 100)}%` }}
          >
            <div className="absolute inset-0 bg-white/30 animate-[wiggle_2s_infinite]"></div>
          </div>
        </div>
      </div>

      <SafeAdContainer />
    </div>
  );
};
