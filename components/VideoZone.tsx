
import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, SkipForward, Heart, User, Sparkles, ArrowLeft } from 'lucide-react';
import { playTextToSpeech, playSoundEffect } from '../utils/sound';

interface VideoEpisode {
  id: number;
  title: string;
  theme: string;
  frames: { text: string; icon: string; bg: string }[];
}

interface VideoZoneProps {
  onBack: () => void;
}

const EPISODES: VideoEpisode[] = [
  {
    id: 1,
    title: "Respecting Elders",
    theme: "Respect",
    frames: [
      { text: "When Grandma comes home...", icon: "👵", bg: "#FFE5D9" },
      { text: "We stand up and smile!", icon: "😊", bg: "#D8E2DC" },
      { text: "We say 'Hello' politely.", icon: "👋", bg: "#ECE4DB" },
      { text: "We help her with bags.", icon: "👜", bg: "#FFE5D9" },
      { text: "Respect makes everyone happy!", icon: "💖", bg: "#FEC89A" }
    ]
  },
  {
    id: 2,
    title: "The Magic Words",
    theme: "Manners",
    frames: [
      { text: "When you want a toy...", icon: "🧸", bg: "#D8E2DC" },
      { text: "Don't just grab it!", icon: "✋", bg: "#FFD7D7" },
      { text: "Say 'Please' first.", icon: "🙏", bg: "#FFF4D7" },
      { text: "When you get it, say 'Thank You'.", icon: "🎁", bg: "#E2D7FF" },
      { text: "Being polite is cool!", icon: "😎", bg: "#D8E2DC" }
    ]
  },
  {
    id: 3,
    title: "Helping Parents",
    theme: "Helping",
    frames: [
      { text: "Mom works hard all day.", icon: "👩", bg: "#FFE5D9" },
      { text: "I can clean up my toys.", icon: "🧩", bg: "#D8E2DC" },
      { text: "I can put my plate away.", icon: "🍽️", bg: "#ECE4DB" },
      { text: "Dad is happy when I help.", icon: "👨", bg: "#FFF4D7" },
      { text: "We are a super team!", icon: "🏡", bg: "#FEC89A" }
    ]
  },
  {
    id: 4,
    title: "Healthy Eating",
    theme: "Health",
    frames: [
      { text: "I love yummy fruits!", icon: "🍎", bg: "#FFD7D7" },
      { text: "Green veggies make me strong.", icon: "🥦", bg: "#D7FFD9" },
      { text: "Milk helps my bones grow.", icon: "🥛", bg: "#E8E8E4" },
      { text: "No too much candy!", icon: "🍬", bg: "#FFD7E4" },
      { text: "Healthy food gives me power!", icon: "💪", bg: "#FFF4D7" }
    ]
  },
  {
    id: 5,
    title: "Brushing Teeth",
    theme: "Hygiene",
    frames: [
      { text: "Every morning and night...", icon: "🌙", bg: "#E2D7FF" },
      { text: "I take my toothbrush.", icon: "🪥", bg: "#D8E2DC" },
      { text: "Brush up and down!", icon: "🦷", bg: "#ECE4DB" },
      { text: "Wash with water.", icon: "💧", bg: "#D7F9FF" },
      { text: "Look at my sparkling smile!", icon: "😁", bg: "#FFFAD7" }
    ]
  },
  {
    id: 6,
    title: "Crossing the Road",
    theme: "Safety",
    frames: [
      { text: "Stop at the red light.", icon: "🛑", bg: "#FFD7D7" },
      { text: "Look left and right.", icon: "👀", bg: "#FFF4D7" },
      { text: "Wait for the cars to stop.", icon: "🚗", bg: "#E8E8E4" },
      { text: "Walk on the zebra crossing.", icon: "🦓", bg: "#D8E2DC" },
      { text: "Safety comes first!", icon: "🛡️", bg: "#D7F9FF" }
    ]
  },
  {
    id: 7,
    title: "Sharing is Caring",
    theme: "Social",
    frames: [
      { text: "I have two cool cars.", icon: "🚗", bg: "#D7F9FF" },
      { text: "My friend has none.", icon: "😢", bg: "#FFD7D7" },
      { text: "I give one to my friend.", icon: "🤲", bg: "#FFF4D7" },
      { text: "Now we play together!", icon: "🤝", bg: "#D7FFD9" },
      { text: "Sharing brings joy.", icon: "🥰", bg: "#FFD7E4" }
    ]
  },
  {
    id: 8,
    title: "Save Water",
    theme: "Nature",
    frames: [
      { text: "Water is very precious.", icon: "💧", bg: "#D7F9FF" },
      { text: "Don't leave the tap open.", icon: "🚰", bg: "#E8E8E4" },
      { text: "Use a bucket for bath.", icon: "🪣", bg: "#FFF4D7" },
      { text: "Fix leaky pipes.", icon: "🔧", bg: "#D8E2DC" },
      { text: "Save water, save Earth!", icon: "🌍", bg: "#D7FFD9" }
    ]
  }
];

export const VideoZone: React.FC<VideoZoneProps> = ({ onBack }) => {
  const [activeVideo, setActiveVideo] = useState<VideoEpisode | null>(null);
  const [currentFrame, setCurrentFrame] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  
  // Use a ref to track if we should continue playing to handle closures in callbacks
  const isPlayingRef = useRef(false);

  useEffect(() => {
    isPlayingRef.current = isPlaying;
    
    if (isPlaying && activeVideo) {
      playCurrentFrame();
    } else {
      window.speechSynthesis.cancel();
    }
    // We only trigger this effect when play state changes or video opens.
    // The frame advancement happens in the callback.
  }, [isPlaying, activeVideo]);

  const playCurrentFrame = () => {
    if (!activeVideo || !isPlayingRef.current) return;

    const frame = activeVideo.frames[currentFrame];
    
    playTextToSpeech(frame.text, () => {
      // This callback runs when speech finishes
      if (isPlayingRef.current) {
        if (currentFrame < activeVideo.frames.length - 1) {
          setCurrentFrame(prev => {
            // Need to trigger the next frame's speech, but we can't do it inside the setter strictly.
            // Using setTimeout to break the stack and allow render
            setTimeout(() => {
               // The useEffect won't auto-trigger speech because we removed currentFrame from dependency
               // to avoid double triggers. We will manually call playCurrentFrame via the prop change?
               // Actually, easier to just rely on the effect if we structure dependencies right,
               // but `playTextToSpeech` is imperative.
               // Let's rely on a chain here.
            }, 0);
            return prev + 1;
          });
        } else {
          setIsPlaying(false);
        }
      }
    }, 'friendly');
  };

  // When currentFrame changes, if we are still playing, play the new frame
  useEffect(() => {
    if (isPlaying && activeVideo) {
        // Add a small delay to allow UI to update before audio starts
        const timer = setTimeout(() => {
            playCurrentFrame();
        }, 100);
        return () => clearTimeout(timer);
    }
  }, [currentFrame]);


  const startVideo = (video: VideoEpisode) => {
    playSoundEffect('click');
    setActiveVideo(video);
    setCurrentFrame(0);
    setIsPlaying(true);
  };

  const closeVideo = () => {
    playSoundEffect('click');
    setIsPlaying(false);
    window.speechSynthesis.cancel();
    setActiveVideo(null);
  };

  const togglePlay = () => {
    playSoundEffect('click');
    setIsPlaying(!isPlaying);
  }

  return (
    <div className="space-y-8">
      <button 
        onClick={() => { playSoundEffect('click'); onBack(); }}
        className="flex items-center gap-2 text-gray-600 dark:text-gray-300 font-bold hover:text-kid-primary transition-colors bg-white/50 dark:bg-gray-800/50 px-4 py-2 rounded-full backdrop-blur-sm shadow-sm"
      >
        <ArrowLeft size={24} /> Back
      </button>

      <div className="text-center">
        <h2 className="text-4xl font-black text-kid-purple mb-2">Good Habits Cinema 🎬</h2>
        <p className="text-gray-500 font-bold">Watch and learn how to be a superhero!</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {EPISODES.map(video => (
          <button
            key={video.id}
            onClick={() => startVideo(video)}
            className="group bg-white dark:bg-gray-800 p-6 rounded-[2rem] shadow-xl text-left border-b-8 border-kid-secondary hover:-translate-y-2 transition-transform"
          >
            <div className="h-40 bg-gray-100 rounded-2xl mb-4 flex items-center justify-center text-6xl group-hover:scale-105 transition-transform">
              {video.frames[0].icon}
            </div>
            <h3 className="text-2xl font-black text-gray-800 dark:text-white mb-2">{video.title}</h3>
            <span className="bg-kid-light text-kid-primary px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
              {video.theme}
            </span>
          </button>
        ))}
      </div>

      {/* Video Modal / Player */}
      {activeVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-white dark:bg-gray-900 w-full max-w-2xl rounded-[2rem] overflow-hidden shadow-2xl border-4 border-white relative">
            
            {/* Screen Area */}
            <div 
                className="aspect-video flex flex-col items-center justify-center p-8 text-center transition-colors duration-1000"
                style={{ backgroundColor: activeVideo.frames[currentFrame].bg }}
            >
              <div className="text-9xl mb-8 animate-bounce-slow filter drop-shadow-xl">
                {activeVideo.frames[currentFrame].icon}
              </div>
              <p className="text-3xl md:text-4xl font-black text-gray-800 drop-shadow-md leading-tight">
                {activeVideo.frames[currentFrame].text}
              </p>
            </div>

            {/* Controls */}
            <div className="bg-gray-100 dark:bg-gray-800 p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                 <button 
                   onClick={togglePlay}
                   className="w-12 h-12 bg-kid-primary rounded-full flex items-center justify-center text-white shadow-lg hover:scale-110 transition-transform"
                 >
                   {isPlaying ? <Pause fill="currentColor" /> : <Play fill="currentColor" className="ml-1" />}
                 </button>
                 <div className="text-sm font-bold text-gray-500">
                    {currentFrame + 1} / {activeVideo.frames.length}
                 </div>
              </div>

              {/* Progress Bar */}
              <div className="flex-1 mx-4 h-3 bg-gray-300 rounded-full overflow-hidden">
                <div 
                    className="h-full bg-kid-secondary transition-all duration-300"
                    style={{ width: `${((currentFrame + 1) / activeVideo.frames.length) * 100}%` }}
                />
              </div>

              <button 
                onClick={closeVideo}
                className="px-4 py-2 font-bold text-gray-500 hover:text-red-500"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
