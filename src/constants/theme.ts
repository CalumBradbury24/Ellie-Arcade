// ─── Colours ─────────────────────────────────────────────────────────────────

export const Colors = {
    // Backgrounds
    background: '#FDF6FF',       // very light lavender-white
    cardBackground: '#F3E8FF',   // soft lavender
    cardBorder: '#E9D5FF',       // light purple border

    // Brand
    primary: '#C084FC',          // pastel purple
    primaryDark: '#9333EA',      // deeper purple (pressed states)
    secondary: '#86EFAC',        // pastel green
    accent: '#FDE68A',           // pastel yellow

    // Semantic
    danger: '#FCA5A5',           // pastel red — lives lost, errors
    success: '#86EFAC',          // pastel green — positive feedback

    // Text
    textDark: '#3B1F5E',         // deep purple — primary text
    textMuted: '#9CA3AF',        // grey — secondary/disabled text
    textLight: '#FFFFFF',        // white — on dark backgrounds

    // Coming Soon cards
    comingSoonBackground: '#F3F4F6',
    comingSoonBorder: '#E5E7EB',
    comingSoonText: '#9CA3AF',

    // Game UI
    scoreText: '#3B1F5E',        // used at low opacity as the big in-game score
    paddleColor: '#C084FC',      // pastel purple paddle
    ballColor: '#A5B4FC',        // pastel indigo ball background
    gameBackground: '#FDF6FF',   // same as main background

    // Overlay
    overlayBackground: 'rgba(59, 31, 94, 0.75)', // dark purple, semi-transparent
} as const;

export type ColorKey = keyof typeof Colors;

// ─── Spacing ─────────────────────────────────────────────────────────────────

export const Spacing = {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
} as const;

// ─── Border Radius ────────────────────────────────────────────────────────────

export const Radius = {
    sm: 8,
    md: 12,
    lg: 20,
    xl: 32,
    full: 9999,
} as const;

// ─── Typography ───────────────────────────────────────────────────────────────

export const FontSize = {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 20,
    xl: 28,
    xxl: 40,
    score: 100,   // in-game score display
} as const;

export const FontWeight = {
    regular: '400' as const,
    semibold: '600' as const,
    bold: '700' as const,
    heavy: '900' as const,
};

// ─── Game Constants ───────────────────────────────────────────────────────────

export const GameConstants = {
    ballRadius: 28,
    paddleHeight: 18,
    paddleBottomOffset: 60,  // px from bottom of screen
    livesCount: 3,
} as const;
