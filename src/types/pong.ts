// ─── Difficulty ──────────────────────────────────────────────────────────────

export type Difficulty = 'easy' | 'medium' | 'hard';

export type DifficultyConfig = {
  /** Paddle width in pixels */
  paddleWidth: number;
  /** Starting ball speed in pixels per frame */
  initialSpeed: number;
  /** Amount added to speed magnitude after each successful paddle hit */
  speedIncrement: number;
  /** Maximum ball speed cap in pixels per frame */
  maxSpeed: number;
};

export const DIFFICULTY_CONFIG: Record<Difficulty, DifficultyConfig> = {
  easy: {
    paddleWidth: 140,
    initialSpeed: 4,
    speedIncrement: 0.15,
    maxSpeed: 14,
  },
  medium: {
    paddleWidth: 100,
    initialSpeed: 6,
    speedIncrement: 0.25,
    maxSpeed: 20,
  },
  hard: {
    paddleWidth: 70,
    initialSpeed: 8,
    speedIncrement: 0.4,
    maxSpeed: 25,
  },
};

// ─── Emoji ───────────────────────────────────────────────────────────────────

export type EmojiOption = {
  emoji: string;
  label: string; // accessibility label
  /** Ball background & glow colour */
  color: string;
};

export const EMOJI_OPTIONS: EmojiOption[] = [
  { emoji: '🐱', label: 'Cat', color: '#FDE68A' }, // warm yellow
  { emoji: '🐶', label: 'Dog', color: '#FCA5A5' }, // pastel red
  { emoji: '🐸', label: 'Frog', color: '#86EFAC' }, // pastel green
  { emoji: '🦊', label: 'Fox', color: '#FDBA74' }, // pastel orange
  { emoji: '🐧', label: 'Penguin', color: '#BAE6FD' }, // sky blue
  { emoji: '🌟', label: 'Star', color: '#FDE047' }, // golden yellow
  { emoji: '🐭', label: 'Bunny', color: '#F9A8D4' }, // pastel pink
  { emoji: '🦄', label: 'Unicorn', color: '#E879F9' }, // bright lilac
  { emoji: '🦁', label: 'Lion', color: '#FCD34D' }, // amber
  { emoji: '🐔', label: 'Chicken', color: '#FEF08A' }, // light yellow
  { emoji: '🐻', label: 'Bear', color: '#D4A96A' }, // warm tan
  { emoji: '🦆', label: 'Duck', color: '#67E8F9' }, // cyan
  { emoji: '🐝', label: 'Bee', color: '#FACC15' }, // bright yellow
  { emoji: '🐨', label: 'Koala', color: '#CBD5E1' }, // slate grey
  { emoji: '🦖', label: 'Dinosaur', color: '#4ADE80' }, // vivid green
  { emoji: '🦀', label: 'Crab', color: '#FB923C' }, // coral orange
  { emoji: '🦋', label: 'Butterfly', color: '#A78BFA' }, // soft violet
  { emoji: '🐬', label: 'Dolphin', color: '#60A5FA' }, // ocean blue
  { emoji: '🐴', label: 'Horse', color: '#A16207' }, // chestnut brown — lightened below
  { emoji: '🐌', label: 'Snail', color: '#BEF264' }, // lime green
  { emoji: '🐵', label: 'Monkey', color: '#FDBA74' }, // warm peach
  { emoji: '🐙', label: 'Octopus', color: '#C084FC' }, // pastel purple
];

// ─── Game Phase ───────────────────────────────────────────────────────────────

export type GamePhase = 'playing' | 'countdown' | 'paused' | 'gameover';

// ─── Async Storage Keys ───────────────────────────────────────────────────────

export const HIGH_SCORE_KEY = (difficulty: Difficulty) =>
  `@ellie_arcade:highscore:numbers_pong:${difficulty}`;
