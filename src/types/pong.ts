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
    maxSpeed: 12,
  },
  medium: {
    paddleWidth: 100,
    initialSpeed: 6,
    speedIncrement: 0.25,
    maxSpeed: 16,
  },
  hard: {
    paddleWidth: 70,
    initialSpeed: 8,
    speedIncrement: 0.4,
    maxSpeed: 20,
  },
};

// ─── Emoji ───────────────────────────────────────────────────────────────────

export type EmojiOption = {
  emoji: string;
  label: string; // accessibility label
};

export const EMOJI_OPTIONS: EmojiOption[] = [
  { emoji: '🐱', label: 'Cat' },
  { emoji: '🐶', label: 'Dog' },
  { emoji: '🐸', label: 'Frog' },
  { emoji: '🦊', label: 'Fox' },
  { emoji: '🐧', label: 'Penguin' },
  { emoji: '🌟', label: 'Star' },
  { emoji: '🍎', label: 'Apple' },
  { emoji: '🦄', label: 'Unicorn' },
];

// ─── Game Phase ───────────────────────────────────────────────────────────────

export type GamePhase = 'playing' | 'countdown' | 'paused' | 'gameover';

// ─── Async Storage Keys ───────────────────────────────────────────────────────

export const HIGH_SCORE_KEY = (difficulty: Difficulty) =>
  `@ellie_arcade:highscore:numbers_pong:${difficulty}`;
