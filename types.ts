
export enum AppRoute {
  HOME = 'HOME',
  LEARN = 'LEARN',
  SPACE = 'SPACE',
  STORIES = 'STORIES',
  PROFILE = 'PROFILE',
  GAMES = 'GAMES',
  RHYMES = 'RHYMES',
  VOCABULARY = 'VOCABULARY',
  VIDEOS = 'VIDEOS',
  PRIVACY = 'PRIVACY',
  CHALLENGE = 'CHALLENGE'
}

export interface Planet {
  name: string;
  color: string;
  fact: string;
  distance: string;
  size: string;
  icon: string;
  description?: string;
}

export interface Story {
  id?: string; // Added ID for favorites
  title: string;
  content: string;
  moral: string;
  isGenerated?: boolean;
}

export interface Badge {
  id: string;
  name: string;
  icon: string;
  description: string;
  color: string;
  unlocked: boolean;
}

export interface DailyStats {
  lastPlayedDate: string; // YYYY-MM-DD
  questionsAnswered: number;
}

export interface UserProgress {
  stars: number;
  completedTasks: string[];
  level: number;
  avatarId: number;
  themeId: string; // New: To track selected theme
  badges: string[]; // List of unlocked badge IDs
  favorites: Story[];
  difficulty: 'easy' | 'medium' | 'hard';
  dailyStats: DailyStats;
}

export interface LearningItem {
  char: string;
  word: string;
  icon: string;
  type: 'alphabet' | 'number';
}
