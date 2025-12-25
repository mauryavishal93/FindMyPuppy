export enum Difficulty {
  EASY = 'Easy',
  MEDIUM = 'Medium',
  HARD = 'Hard'
}

export interface LevelConfig {
  id: number;
  difficulty: Difficulty;
  puppyCount: number;
  points: number;
  themePrompt?: string; // Optional cached theme
}

export interface Puppy {
  id: string;
  x: number; // Percentage 0-100
  y: number; // Percentage 0-100
  rotation: number;
  scale: number;
  isFound: boolean;
  opacity: number;
  hueRotate: number;
  imageUrl: string;
  // New pose properties
  facingLeft: boolean; 
  aspectFactor: number; // < 1 means taller/standing, > 1 means wider/lying down
}

export interface UserProgress {
  clearedLevels: { [key: string]: boolean }; // key format: "DIFFICULTY_ID" e.g., "EASY_1"
  totalScore: number;
  unlockedDifficulties: Difficulty[];
}

export interface GameSession {
  isPlaying: boolean;
  currentLevel: number;
  currentDifficulty: Difficulty;
  score: number;
  timeLeft?: number;
}