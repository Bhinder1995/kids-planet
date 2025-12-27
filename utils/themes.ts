
export interface AppTheme {
  id: string;
  name: string;
  icon: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    dark: string;
    light: string;
    purple: string;
  };
}

export const THEMES: AppTheme[] = [
  {
    id: 'default',
    name: 'Mars Mission',
    icon: '🪐',
    colors: {
      primary: '#FF6B6B',    // Red-Coral
      secondary: '#4ECDC4',  // Teal
      accent: '#FFE66D',     // Yellow
      dark: '#292F36',       // Dark Gunmetal
      light: '#F7FFF7',      // Mint White
      purple: '#6C5CE7'      // Purple
    }
  },
  {
    id: 'ocean',
    name: 'Ocean Splash',
    icon: '🐬',
    colors: {
      primary: '#0096C7',    // Bright Blue
      secondary: '#48CAE4',  // Cyan
      accent: '#ADE8F4',     // Pale Blue
      dark: '#023E8A',       // Deep Navy
      light: '#F0F8FF',      // Alice Blue
      purple: '#0077B6'      // Ocean Blue
    }
  },
  {
    id: 'jungle',
    name: 'Jungle Safari',
    icon: '🦁',
    colors: {
      primary: '#588157',    // Hunter Green
      secondary: '#F4A261',  // Orange
      accent: '#E9C46A',     // Mustard
      dark: '#3A5A40',       // Dark Green
      light: '#DAD7CD',      // Sage Tint
      purple: '#A3B18A'      // Light Olive
    }
  },
  {
    id: 'candy',
    name: 'Candy Land',
    icon: '🦄',
    colors: {
      primary: '#FF8FAB',    // Hot Pink
      secondary: '#FFC2D1',  // Light Pink
      accent: '#FFE5EC',     // Pale Pink
      dark: '#FB6F92',       // Dark Pink/Red
      light: '#FFF0F3',      // Lavender Blush
      purple: '#C1121F'      // Berry
    }
  }
];
