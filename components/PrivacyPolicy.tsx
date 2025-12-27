
import React from 'react';
import { Shield, Lock, EyeOff, Cookie, Server } from 'lucide-react';
import { playSoundEffect } from '../utils/sound';

export const PrivacyPolicy: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  return (
    <div className="max-w-4xl mx-auto pb-10">
      <button 
        onClick={() => { playSoundEffect('click'); onBack(); }}
        className="mb-6 text-gray-500 font-bold hover:text-kid-primary transition-colors flex items-center gap-2"
      >
        ← Back to App
      </button>

      <div className="bg-white dark:bg-gray-800 rounded-[3rem] p-8 md:p-12 shadow-xl border-t-8 border-kid-primary">
        <div className="text-center mb-10">
          <div className="inline-block p-4 bg-gray-100 dark:bg-gray-700 rounded-full mb-4">
             <Shield size={48} className="text-kid-secondary" />
          </div>
          <h1 className="text-4xl font-black text-gray-800 dark:text-white mb-4">Privacy Policy for Parents</h1>
          <p className="text-gray-500 dark:text-gray-400 font-bold text-lg">
            Your child's safety is our #1 priority.
          </p>
        </div>

        <div className="space-y-8">
          <Section 
            icon={<EyeOff />}
            title="1. No Personal Data Collection"
            content="We do not collect names, addresses, phone numbers, or email addresses from children. The app allows for avatar customization and progress tracking, but this data is stored locally on your device or in a non-identifiable session."
          />

          <Section 
            icon={<Cookie />}
            title="2. Essential Cookies Only"
            content="We use technical cookies strictly for the functioning of the website. These are used to: 1) Save game progress (Stars & Levels), 2) Maintain the active session, and 3) Remember simple preferences like sound settings. We do not use advertising cookies or tracking pixels."
          />

          <Section 
            icon={<Lock />}
            title="3. Family-Safe Analytics"
            content="We use Google Analytics to understand how our app is used (e.g., which games are popular). We have configured this service to: 1) Anonymize all IP addresses, 2) Disable all advertising features, 3) Disable user profiling, and 4) Enable 'Child-Directed Treatment' flags."
          />

          <Section 
            icon={<Server />}
            title="4. Third-Party Services"
            content="We may use family-safe third-party APIs (like Google Gemini) to generate stories. No personal user data is sent to these services. Requests are stateless and content-focused (e.g., 'Tell me a story about a cat')."
          />

          <div className="bg-blue-50 dark:bg-gray-700/50 p-6 rounded-3xl border-2 border-blue-100 dark:border-gray-600 mt-8">
            <h3 className="font-black text-xl text-blue-600 dark:text-blue-300 mb-2">Advertising Policy</h3>
            <p className="text-gray-600 dark:text-gray-300 font-medium">
              If ads are ever displayed, they will be strictly "Non-Personalized" and from "Family-Safe" networks. 
              Ads are clearly separated from educational content with a "Advertisement" label and borders, ensuring children do not mistake them for game elements.
            </p>
          </div>
        </div>
        
        <div className="mt-12 text-center border-t border-gray-200 dark:border-gray-700 pt-8">
          <p className="text-gray-400 text-sm">Last Updated: October 2023</p>
        </div>
      </div>
    </div>
  );
};

const Section = ({ icon, title, content }: any) => (
  <div className="flex gap-4 items-start">
    <div className="p-3 bg-kid-light rounded-2xl text-kid-primary shrink-0">
      {icon}
    </div>
    <div>
      <h3 className="text-xl font-black text-gray-800 dark:text-white mb-2">{title}</h3>
      <p className="text-gray-600 dark:text-gray-300 leading-relaxed font-medium">
        {content}
      </p>
    </div>
  </div>
);
