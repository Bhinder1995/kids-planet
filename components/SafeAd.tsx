import React from 'react';

// This component ensures any ad content is clearly labeled and separated
// complying with policies for kids' apps.
export const SafeAdContainer: React.FC = () => {
  return (
    <div className="w-full max-w-2xl mx-auto my-8">
      {/* Strict Separation UI */}
      <div className="flex items-center gap-4 mb-2">
        <div className="h-px bg-gray-300 dark:bg-gray-600 flex-1"></div>
        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest border border-gray-300 dark:border-gray-600 px-2 py-0.5 rounded">
          Advertisement
        </span>
        <div className="h-px bg-gray-300 dark:bg-gray-600 flex-1"></div>
      </div>

      {/* Ad Placeholder / Container */}
      <div className="bg-gray-100 dark:bg-gray-800 rounded-xl p-4 flex items-center justify-center min-h-[100px] border-2 border-dashed border-gray-300 dark:border-gray-700">
         <p className="text-gray-400 text-sm font-bold text-center">
           Safe, non-personalized content appears here.<br/>
           (No tracking allowed)
         </p>
      </div>
    </div>
  );
};
