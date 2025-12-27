
import React from 'react';
import { Cookie, ShieldCheck } from 'lucide-react';

interface CookieConsentProps {
  visible: boolean;
  onAccept: () => void;
}

export const CookieConsent: React.FC<CookieConsentProps> = ({ visible, onAccept }) => {
  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[60] p-4 animate-fade-in-up">
      <div className="max-w-4xl mx-auto bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-[2rem] p-6 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] border-4 border-kid-secondary flex flex-col md:flex-row items-center gap-6">
        
        <div className="bg-kid-light p-4 rounded-full shrink-0">
          <Cookie size={40} className="text-kid-primary" />
        </div>

        <div className="flex-1 text-center md:text-left">
          <h3 className="text-xl font-black text-gray-800 dark:text-white mb-2 flex items-center justify-center md:justify-start gap-2">
            Cookies & Privacy <ShieldCheck size={20} className="text-green-500" />
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-300 font-bold leading-relaxed">
            We use <span className="text-kid-primary">essential cookies only</span>. 
            This helps us save your game progress, remember your language, and keep the game working. 
            We do <span className="underline decoration-red-400 decoration-2">not</span> collect personal data or track you for ads.
          </p>
        </div>

        <button 
          onClick={onAccept}
          className="bg-kid-primary hover:bg-kid-secondary text-white font-black py-4 px-8 rounded-full shadow-lg transition-all transform hover:scale-105 whitespace-nowrap"
        >
          Got it! 👍
        </button>
      </div>
    </div>
  );
};
