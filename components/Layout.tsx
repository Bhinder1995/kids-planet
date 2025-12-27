
import React, { useState, useEffect } from 'react';
import { AppRoute, UserProgress } from '../types';
// Fix: Added Library and MonitorPlay icons to the imports from lucide-react
import { Rocket, BookOpen, User, Gamepad2, Home, Volume2, VolumeX, Music4, Mail, Cookie, Shield, Library, MonitorPlay } from 'lucide-react';
import { CookieConsent } from './CookieConsent';
import { AVATARS } from '../utils/avatars';
import { playSoundEffect } from '../utils/sound';

interface LayoutProps {
  children: React.ReactNode;
  currentRoute: AppRoute;
  onNavigate: (route: AppRoute) => void;
  darkMode: boolean;
  toggleDarkMode: () => void;
  progress: UserProgress;
  soundEnabled: boolean;
  toggleSound: () => void;
  musicEnabled: boolean;
  toggleMusic: () => void;
  previewAvatarId?: number | null;
}

export const Layout: React.FC<LayoutProps> = ({ 
  children, currentRoute, onNavigate, progress, 
  soundEnabled, toggleSound, musicEnabled, toggleMusic, previewAvatarId
}) => {
  
  const [showCookies, setShowCookies] = useState(false);

  useEffect(() => {
    const accepted = localStorage.getItem('cookie_consent');
    if (!accepted) {
      setShowCookies(true);
    }
  }, []);

  const handleCookieAccept = () => {
    playSoundEffect('correct');
    localStorage.setItem('cookie_consent', 'true');
    setShowCookies(false);
  };

  const handleOpenCookies = () => {
    playSoundEffect('click');
    setShowCookies(true);
  };

  const handleNav = (route: AppRoute) => {
    playSoundEffect('click');
    onNavigate(route);
  };

  const NavButton = ({ route, icon: Icon, label, color }: { route: AppRoute, icon: any, label: string, color: string }) => (
    <button
      onClick={() => handleNav(route)}
      className={`
        flex flex-col items-center justify-center p-2 rounded-2xl transition-all duration-300 min-w-[60px] bg-gray-800 text-white
        ${currentRoute === route ? 'scale-110 -translate-y-2 shadow-xl ring-4 ring-white/50' : 'hover:scale-105 opacity-80 hover:opacity-100'}
      `}
      style={{ backgroundColor: currentRoute === route ? color : undefined }}
    >
      <div className={`p-3 rounded-xl mb-1 ${currentRoute !== route ? 'bg-gray-700' : 'bg-white/20'}`}>
        <Icon size={20} className={currentRoute === route ? 'stroke-[3px]' : ''} />
      </div>
      <span className="text-[10px] font-bold tracking-wide">{label}</span>
    </button>
  );

  const levelProgress = (progress.stars % 100);
  const displayId = previewAvatarId !== undefined && previewAvatarId !== null ? previewAvatarId : progress.avatarId;
  const currentAvatar = AVATARS.find(a => a.id === displayId) || AVATARS[0];

  return (
    <div className="min-h-screen transition-colors duration-500 bg-kid-dark text-white">
      
      <CookieConsent visible={showCookies} onAccept={handleCookieAccept} />

      <header className="sticky top-0 z-40 px-4 py-3 flex justify-between items-center bg-black/30 backdrop-blur-md shadow-sm border-b border-white/5">
        <div className="flex flex-col justify-center cursor-pointer group" onClick={() => handleNav(AppRoute.HOME)}>
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-kid-primary rounded-full flex items-center justify-center animate-spin-slow shadow-lg border-2 border-white group-hover:scale-110 transition-transform">
              <span className="text-2xl">🪐</span>
            </div>
            <div>
              <h1 className="text-xl font-black leading-none text-kid-accent">
                Kids Planet
              </h1>
              <div className="flex items-center gap-1 mt-1">
                 <div className="w-24 h-2 bg-gray-700 rounded-full overflow-hidden border border-gray-600/50">
                    <div 
                      className="h-full bg-kid-secondary transition-all duration-500" 
                      style={{ width: `${levelProgress}%` }}
                    />
                 </div>
                 <span className="text-[10px] font-bold text-gray-400">Lvl {progress.level}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 md:gap-3">
          <button 
            onClick={() => handleNav(AppRoute.PROFILE)}
            className="mr-1 w-9 h-9 md:w-10 md:h-10 rounded-full flex items-center justify-center text-xl shadow-md border-2 border-white hover:scale-110 transition-transform cursor-pointer"
            style={{ backgroundColor: currentAvatar.bg }}
          >
            {currentAvatar.icon}
          </button>

          <button 
            onClick={() => { playSoundEffect('click'); toggleMusic(); }} 
            className={`p-2 rounded-full transition-colors ${musicEnabled ? 'bg-green-600/30 text-green-400' : 'bg-gray-700/50 text-gray-500'}`}
          >
            {musicEnabled ? <Music4 size={20} className="animate-pulse" /> : <div className="relative"><Music4 size={20} /><div className="absolute inset-0 flex items-center justify-center"><div className="w-full h-0.5 bg-current rotate-45"></div></div></div>}
          </button>

          <button 
            onClick={() => { playSoundEffect('click'); toggleSound(); }} 
            className={`p-2 rounded-full transition-colors ${soundEnabled ? 'bg-blue-600/30 text-blue-400' : 'bg-gray-700/50 text-gray-500'}`}
          >
            {soundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
          </button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 pb-40 md:pb-32 min-h-[calc(100vh-80px)]">
        {children}
      </main>

      <footer className="pb-32 md:pb-28 text-center relative z-10 px-4">
         <div className="bg-gray-800/80 backdrop-blur-sm p-6 rounded-3xl inline-flex flex-col items-center gap-4 border-2 border-dashed border-gray-700 max-w-lg mx-auto w-full shadow-sm hover:shadow-md transition-shadow">
            
            <div className="flex items-center gap-2 text-gray-500 font-black uppercase tracking-widest text-xs">
               <Shield size={14} /> Parents Zone
            </div>

            <div className="flex flex-wrap justify-center gap-3 md:gap-6 text-xs font-bold text-gray-400">
               <button onClick={() => { playSoundEffect('click'); handleNav(AppRoute.PRIVACY); }} className="flex items-center gap-1 hover:text-kid-primary transition-colors px-3 py-1.5 rounded-full hover:bg-gray-700">
                 <Shield size={14} /> Privacy Policy
               </button>
               <button onClick={handleOpenCookies} className="flex items-center gap-1 hover:text-kid-secondary transition-colors px-3 py-1.5 rounded-full hover:bg-gray-700">
                 <Cookie size={14} /> Cookie Settings
               </button>
               <a href="mailto:support@kidsplanet.io" onClick={() => playSoundEffect('click')} className="flex items-center gap-1 hover:text-kid-purple transition-colors px-3 py-1.5 rounded-full hover:bg-gray-700">
                 <Mail size={14} /> Contact
               </a>
            </div>
            
            <div className="text-[10px] text-gray-500 font-medium">
               &copy; {new Date().getFullYear()} Kids Planet. Safe & Fun Learning.
            </div>
         </div>
      </footer>

      <nav className="fixed bottom-0 left-0 right-0 p-2 pb-6 md:pb-4 bg-gray-900/95 backdrop-blur-xl border-t border-white/5 shadow-[0_-10px_40px_rgba(0,0,0,0.3)] z-50 overflow-x-auto no-scrollbar">
        <div className="max-w-4xl mx-auto flex justify-start md:justify-center items-end min-w-max px-2 gap-2">
          <NavButton route={AppRoute.HOME} icon={Home} label="Home" color="#FF6B6B" />
          <NavButton route={AppRoute.LEARN} icon={BookOpen} label="ABC" color="#4ECDC4" />
          <NavButton route={AppRoute.VOCABULARY} icon={Library} label="Words" color="#FF9F1C" />
          <NavButton route={AppRoute.VIDEOS} icon={MonitorPlay} label="Cinema" color="#2EC4B6" />
          <NavButton route={AppRoute.GAMES} icon={Gamepad2} label="Games" color="#FF9FF3" />
          <NavButton route={AppRoute.RHYMES} icon={Music4} label="Rhymes" color="#A8E6CF" />
          <NavButton route={AppRoute.SPACE} icon={Rocket} label="Space" color="#6C5CE7" />
          <NavButton route={AppRoute.PROFILE} icon={User} label="Me" color="#FFE66D" />
        </div>
      </nav>
    </div>
  );
};
