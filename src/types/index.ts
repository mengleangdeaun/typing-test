// Core Types
export type Language = 'english' | 'khmer' | 'mixed' | 'custom';
export type TimerDuration = 15 | 30 | 60 | 120 | 180 | 240 | 300;
export type TestStatus = 'idle' | 'running' | 'finished';
export type Difficulty = 'beginner' | 'intermediate' | 'advanced' | 'expert';
export type TestMode = 'time' | 'words' | 'quote' | 'zen' | 'custom' | 'practice';

// Stats Types
export interface TestStats {
  wpm: number;
  accuracy: number;
  rawWpm: number;
  netWpm: number;
  adjustedAccuracy: number;
  charactersTyped: number;
  correctChars: number;
  incorrectChars: number;
  totalTime: number;
  typingTime: number;
  idleTime: number;
  consistency: number;
  correctWords: number;
  incorrectWords: number;
  peakWpm: number;
  wpmHistory: Array<{ time: number; wpm: number }>;
  errorHeatmap: Record<string, number>;
  mostCommonErrors: Array<{ char: string; count: number }>;
}

export interface AdvancedStats extends TestStats {
  // Extended for detailed view
  grossWpm: number;
  charAccuracy: number;
  wordAccuracy: number;
  timePerWord: number[];
  errorsByPosition: number[];
}

// Mode Types
export interface WordsModeConfig {
  wordCount: 10 | 25 | 50 | 100;
  currentWordIndex: number;
  wordHistory: Array<{
    word: string;
    typed: string;
    correct: boolean;
    time: number;
  }>;
}

export interface Quote {
  id: string;
  text: string;
  author: string;
  source: string;
  length: number;
  difficulty: Difficulty;
  tags: string[];
}

export interface ZenModeConfig {
  totalWordsTyped: number;
  totalErrors: number;
  currentStreak: number;
  bestStreak: number;
  isActive: boolean;
}

export interface CustomModeConfig {
  text: string;
  validated: boolean;
  wordCount: number;
  characterCount: number;
  hasPunctuation: boolean;
  hasNumbers: boolean;
  hasSpecialChars: boolean;
}

// Settings Types
export interface Settings {
  theme: 'light' | 'dark' | 'system';
  accentColor: string;
  fontSize: 'small' | 'medium' | 'large';
  showLiveStats: boolean;
  soundEffects: boolean;
  autoSaveHistory: boolean;
  difficulty: Difficulty;
  testMode: TestMode;
}

// Session Types
export interface Session {
  id: string;
  date: number;
  mode: TestMode;
  duration: number;
  wpm: number;
  accuracy: number;
  rawWpm: number;
  consistency: number;
  difficulty: Difficulty;
  stats: TestStats;
  textPreview: string;
}

export interface PersonalRecords {
  bestWpm: number;
  bestAccuracy: number;
  longestStreak: number;
  totalTestsCompleted: number;
  totalTimeTyped: number;
  totalCharsTyped: number;
  bestWpmByMode: Record<TestMode, number>;
  achievements: Achievement[];
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  unlockedAt: number;
  icon: string;
  condition: (stats: TestStats) => boolean;
}

// Component Props
export interface TypingDisplayProps {
  targetText: string;
  typedText: string;
  showCursor: boolean;
}

export interface ResultsDisplayProps {
  stats: TestStats | null;
  mode: TestMode;
  onRestart: () => void;
  onChangeMode: (mode: TestMode) => void;
}

export interface StatsDashboardProps {
  stats: TestStats;
  isRunning: boolean;
  timeLeft?: number;
  mode: TestMode;
  progress?: number;
}