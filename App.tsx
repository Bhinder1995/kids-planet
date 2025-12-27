
import React, { useState, useEffect, useRef } from 'react';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { SplashScreen } from './components/SplashScreen';
import { LearnZone } from './components/LearnZone';
import { SpaceZone } from './components/SpaceZone';
import { StoryZone } from './components/StoryZone';
import { RhymesZone } from './components/RhymesZone';
import { GamesZone } from './components/GamesZone';
import { VocabularyZone } from './components/VocabularyZone';
import { VideoZone } from './components/VideoZone';
import { AvatarBuilder } from './components/AvatarBuilder';
import { Fireworks } from './components/Fireworks';
import { PrivacyPolicy } from './components/PrivacyPolicy';
import { DailyChallenge } from './components/DailyChallenge';
import { AppRoute, UserProgress, Badge, Story } from './types';
import { initSafeAnalytics } from './services/analytics';
import { THEMES } from './utils/themes';
import { setGlobalSoundEnabled, unlockAudio } from './utils/sound';

const AVAILABLE_BADGES: Badge[] = [
  { id: 'science_whiz', name: 'Science Whiz', icon: '🧪', description: 'Won a Daily Challenge', color: '#4ECDC4', unlocked: false },
  { id: 'quest_master', name: 'Quest Master', icon: '👑', description: 'Completed 5 Daily Quests', color: '#FF6B6B', unlocked: false },
  { id: 'super_star', name: 'Super Star', icon: '⭐', description: 'Reached Level 10', color: '#FFE66D', unlocked: false },
];

function App() {
  const [loading, setLoading] = useState(true);
  const [route, setRoute] = useState<AppRoute>(AppRoute.HOME);
  const [soundEnabled, setSoundEnabled] = useState(true); 
  const [musicEnabled, setMusicEnabled] = useState(false); 
  const [showReward, setShowReward] = useState(false);
  
  // Track preview avatar in the top bar while in builder mode
  const [previewAvatar, setPreviewAvatar] = useState<number | null>(null);
  
  const bgMusicRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    initSafeAnalytics('G-XXXXXXXXXX'); 
    bgMusicRef.current = new Audio('https://assets.mixkit.co/music/preview/mixkit-play-date-1193.mp3');
    bgMusicRef.current.loop = true;
    bgMusicRef.current.volume = 0.15; 

    // Global click listener to unlock audio on mobile
    const handleGlobalClick = () => {
      unlockAudio();
      window.removeEventListener('click', handleGlobalClick);
    };
    window.addEventListener('click', handleGlobalClick);

    return () => window.removeEventListener('click', handleGlobalClick);
  }, []);

  // Sync SFX state with Utility
  useEffect(() => {
    setGlobalSoundEnabled(soundEnabled);
  }, [soundEnabled]);

  useEffect(() => {
    if (bgMusicRef.current) {
      if (musicEnabled) {
        bgMusicRef.current.play().catch(e => {
          console.log("Music autoplay blocked");
          setMusicEnabled(false); 
        });
      } else {
        bgMusicRef.current.pause();
      }
    }
  }, [musicEnabled]);

  const [progress, setProgress] = useState<UserProgress>(() => {
    const saved = localStorage.getItem('kids_planet_progress');
    const defaults: UserProgress = { 
      stars: 0, 
      completedTasks: [], 
      level: 1, 
      avatarId: 0,
      themeId: 'default',
      badges: [],
      favorites: [],
      difficulty: 'easy',
      dailyStats: { lastPlayedDate: '', questionsAnswered: 0 }
    };

    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return {
          ...defaults,
          ...parsed,
          themeId: parsed.themeId || 'default', // Backwards compatibility
          dailyStats: {
            ...defaults.dailyStats,
            ...(parsed.dailyStats || {})
          }
        };
      } catch (e) {
        console.error("Error parsing save data", e);
        return defaults;
      }
    }
    return defaults;
  });

  // Apply Theme Colors
  useEffect(() => {
    const theme = THEMES.find(t => t.id === progress.themeId) || THEMES[0];
    const root = document.documentElement;
    root.style.setProperty('--kid-primary', theme.colors.primary);
    root.style.setProperty('--kid-secondary', theme.colors.secondary);
    root.style.setProperty('--kid-accent', theme.colors.accent);
    root.style.setProperty('--kid-dark', theme.colors.dark);
    root.style.setProperty('--kid-light', theme.colors.light);
    root.style.setProperty('--kid-purple', theme.colors.purple);
    
    // Also update meta theme-color for mobile browsers
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', theme.colors.primary);
    }
  }, [progress.themeId]);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 4000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    localStorage.setItem('kids_planet_progress', JSON.stringify(progress));
  }, [progress]);

  const handleTaskComplete = (xp = 10) => {
    setProgress(prev => ({
      ...prev,
      stars: prev.stars + xp,
      level: Math.floor((prev.stars + xp) / 100) + 1
    }));
  };

  const unlockBadge = (badgeId: string) => {
    if (!progress.badges.includes(badgeId)) {
      setProgress(prev => ({ ...prev, badges: [...prev.badges, badgeId] }));
      setShowReward(true); 
      alert(`New Badge Unlocked: ${AVAILABLE_BADGES.find(b => b.id === badgeId)?.name}!`);
    }
  };

  const updateAvatar = (id: number) => {
    setProgress(prev => ({ ...prev, avatarId: id }));
    setPreviewAvatar(null); 
    setShowReward(true);
    setRoute(AppRoute.HOME);
  };

  const updateTheme = (themeId: string) => {
    setProgress(prev => ({ ...prev, themeId }));
  };

  const toggleFavorite = (story: Story) => {
    setProgress(prev => {
      const exists = prev.favorites.some(f => f.title === story.title);
      return {
        ...prev,
        favorites: exists 
          ? prev.favorites.filter(f => f.title !== story.title)
          : [...prev.favorites, story]
      };
    });
  };

  const handleDailyComplete = (success: boolean) => {
    const today = new Date().toDateString();
    
    let newDifficulty = progress.difficulty;
    if (success) {
      if (progress.difficulty === 'easy') newDifficulty = 'medium';
      else if (progress.difficulty === 'medium') newDifficulty = 'hard';
    } else {
      if (progress.difficulty === 'hard') newDifficulty = 'medium';
      else if (progress.difficulty === 'medium') newDifficulty = 'easy';
    }

    setProgress(prev => {
      const isNewDay = prev.dailyStats.lastPlayedDate !== today;
      return {
        ...prev,
        difficulty: newDifficulty,
        dailyStats: {
          lastPlayedDate: today,
          questionsAnswered: isNewDay ? 1 : prev.dailyStats.questionsAnswered + 1
        }
      };
    });

    if (success) {
      handleTaskComplete(20);
      unlockBadge('science_whiz');
    } else {
      handleTaskComplete(5);
    }

    setTimeout(() => setRoute(AppRoute.HOME), 3000);
  };

  const handleBack = () => setRoute(AppRoute.HOME);

  if (loading) return <SplashScreen />;

  const renderContent = () => {
    switch (route) {
      case AppRoute.LEARN:
        return <LearnZone onComplete={() => handleTaskComplete(2)} onBack={handleBack} />;
      case AppRoute.VOCABULARY:
        return <VocabularyZone onBack={handleBack} />;
      case AppRoute.VIDEOS:
        return <VideoZone onBack={handleBack} />;
      case AppRoute.SPACE:
        return <SpaceZone onBack={handleBack} />;
      case AppRoute.STORIES:
        return <StoryZone 
                  onComplete={() => handleTaskComplete(15)} 
                  onBack={handleBack} 
                  favorites={progress.favorites}
                  onToggleFavorite={toggleFavorite}
                />;
      case AppRoute.RHYMES:
        return <RhymesZone onBack={handleBack} />;
      case AppRoute.GAMES:
        return <GamesZone onComplete={() => { handleTaskComplete(20); setShowReward(true); }} onBack={handleBack} />;
      case AppRoute.PROFILE:
        return <AvatarBuilder 
                  progress={progress} 
                  onUpdate={updateAvatar} 
                  onUpdateTheme={updateTheme}
                  onBack={handleBack} 
                  onPreview={setPreviewAvatar}
                />;
      case AppRoute.PRIVACY:
        return <PrivacyPolicy onBack={handleBack} />;
      case AppRoute.CHALLENGE:
        return <DailyChallenge difficulty={progress.difficulty} onComplete={handleDailyComplete} onBack={handleBack} />;
      case AppRoute.HOME:
      default:
        return <Dashboard onNavigate={setRoute} progress={progress} availableBadges={AVAILABLE_BADGES} />;
    }
  };

  return (
    <Layout
      currentRoute={route}
      onNavigate={setRoute}
      darkMode={true}
      toggleDarkMode={() => {}}
      progress={progress}
      soundEnabled={soundEnabled}
      toggleSound={() => setSoundEnabled(!soundEnabled)}
      musicEnabled={musicEnabled}
      toggleMusic={() => setMusicEnabled(!musicEnabled)}
      previewAvatarId={previewAvatar}
    >
      {renderContent()}
      <Fireworks active={showReward} onComplete={() => setShowReward(false)} soundEnabled={soundEnabled} />
    </Layout>
  );
}

export default App;
