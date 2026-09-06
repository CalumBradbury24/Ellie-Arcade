import { useCallback, useEffect, useRef, useState } from 'react';
import { StyleSheet, View, Text, useWindowDimensions, Share } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useFrameCallback,
  useAnimatedStyle,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';

import { AnimatedBackground } from '@/components/pong/AnimatedBackground';
import { Ball } from '@/components/pong/Ball';
import { Paddle } from '@/components/pong/Paddle';
import { ScoreDisplay } from '@/components/pong/ScoreDisplay';
import { LivesDisplay } from '@/components/pong/LivesDisplay';
import { GameOverlay } from '@/components/pong/GameOverlay';
import { Countdown } from '@/components/pong/Countdown';
import { useHighScore } from '@/hooks/useHighScore';
import {
  Difficulty,
  DIFFICULTY_CONFIG,
  GamePhase,
} from '@/types/pong';
import { Colors, FontSize, FontWeight, GameConstants, Spacing } from '@/constants/theme';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function clamp(value: number, min: number, max: number) {
  'worklet';
  return Math.min(Math.max(value, min), max);
}

/**
 * Blends a hex colour with white at `alpha` strength (0–1) to produce a
 * subtle tinted background. Returns an rgb() string.
 */
function tintBackground(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  // Blend toward white
  const tr = Math.round(r * alpha + 255 * (1 - alpha));
  const tg = Math.round(g * alpha + 255 * (1 - alpha));
  const tb = Math.round(b * alpha + 255 * (1 - alpha));
  return `rgb(${tr}, ${tg}, ${tb})`;
}

function randomSign() {
  'worklet';
  return Math.random() > 0.5 ? 1 : -1;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function GameScreen() {
  const router = useRouter();
  const { width: screenW, height: screenH } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  // ── Params ──
  const params = useLocalSearchParams<{ difficulty: string; emoji: string; ballColor: string }>();
  const difficulty = (params.difficulty ?? 'easy') as Difficulty;
  const emoji = params.emoji ?? '🐱';
  const ballColor = params.ballColor ?? '#A5B4FC';
  const config = DIFFICULTY_CONFIG[difficulty];

  // ── High score ──
  const { highScore, saveHighScore } = useHighScore(difficulty);

  // ── React state (JS thread) ──
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState<number>(GameConstants.livesCount);
  const [gamePhase, setGamePhase] = useState<GamePhase>('playing');

  // Keep a ref to lives so the worklet closure can read the latest value
  const livesRef = useRef<number>(GameConstants.livesCount);

  // ── Shared values (UI thread) ──
  const ballX = useSharedValue(screenW / 2);
  const ballY = useSharedValue(screenH / 3);
  const ballVX = useSharedValue(config.initialSpeed * 0.7 * randomSign());
  const ballVY = useSharedValue(-config.initialSpeed); // fires toward top wall on first serve
  const paddleX = useSharedValue((screenW - config.paddleWidth) / 2);

  // Speed tracking on the UI thread
  const currentSpeed = useSharedValue(config.initialSpeed);

  // Screen-shake on miss
  const shakeX = useSharedValue(0);
  const shakeStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shakeX.value }],
  }));

  const { ballRadius, paddleHeight, paddleBottomOffset } = GameConstants;
  const paddleY = screenH - paddleBottomOffset - paddleHeight;

  // ── Reset ball to centre, firing upward ──
  const resetBall = useCallback(() => {
    ballX.value = screenW / 2;
    ballY.value = screenH / 2;
    // currentSpeed is intentionally preserved — speed carries over after a miss
    ballVX.value = currentSpeed.value * 0.7 * (Math.random() > 0.5 ? 1 : -1);
    ballVY.value = -currentSpeed.value; // fires toward top wall
  }, [screenW, screenH, ballX, ballY, ballVX, ballVY, currentSpeed]);

  // ── JS-thread callbacks called from worklet ──
  const onScore = useCallback(() => {
    setScore((s) => s + 1);
  }, []);

  const onMiss = useCallback(() => {
    // Screen shake — rapid left/right oscillation that settles back to 0
    const D = 10; // px amplitude
    const T = 55; // ms per step
    shakeX.value = withSequence(
      withTiming(-D, { duration: T }),
      withTiming(D, { duration: T }),
      withTiming(-D * 0.7, { duration: T }),
      withTiming(D * 0.7, { duration: T }),
      withTiming(-D * 0.4, { duration: T }),
      withTiming(D * 0.4, { duration: T }),
      withTiming(0, { duration: T }),
    );

    const remaining = livesRef.current - 1;
    livesRef.current = remaining;
    setLives(remaining);

    if (remaining <= 0) {
      setGamePhase('gameover');
    } else {
      // Enter countdown phase — ball has already been reset in resetBall()
      resetBall();
      setGamePhase('countdown');
    }
  }, [resetBall]);

  // ── Game loop (runs on UI thread) ──
  const gameActive = useSharedValue(true);

  const frameCallback = useFrameCallback(() => {
    if (!gameActive.value) return;

    // Move ball
    ballX.value += ballVX.value;
    ballY.value += ballVY.value;

    // Left / right wall bounce
    if (ballX.value - ballRadius <= 0) {
      ballX.value = ballRadius;
      ballVX.value = Math.abs(ballVX.value);
    } else if (ballX.value + ballRadius >= screenW) {
      ballX.value = screenW - ballRadius;
      ballVX.value = -Math.abs(ballVX.value);
    }

    // Top wall bounce
    if (ballY.value - ballRadius <= 0) {
      ballY.value = ballRadius;
      ballVY.value = Math.abs(ballVY.value);
    }

    // Paddle collision — ball moving downward, ball bottom reaches paddle top
    const ballBottom = ballY.value + ballRadius;
    const paddleLeft = paddleX.value;
    const paddleRight = paddleX.value + config.paddleWidth;

    if (
      ballVY.value > 0 &&
      ballBottom >= paddleY &&
      ballBottom <= paddleY + paddleHeight + 4 && // small tolerance
      ballX.value >= paddleLeft - ballRadius * 0.5 &&
      ballX.value <= paddleRight + ballRadius * 0.5
    ) {
      // Bounce — add slight horizontal deflection based on hit position
      const hitPos = (ballX.value - paddleLeft) / config.paddleWidth; // 0..1
      const deflect = (hitPos - 0.5) * 2; // -1..1

      // Increase speed
      const newSpeed = clamp(
        currentSpeed.value + config.speedIncrement,
        config.initialSpeed,
        config.maxSpeed,
      );
      currentSpeed.value = newSpeed;

      ballVY.value = -newSpeed;
      ballVX.value = clamp(
        deflect * newSpeed * 0.8,
        -newSpeed,
        newSpeed,
      );

      // Nudge ball above paddle to prevent tunnelling
      ballY.value = paddleY - ballRadius - 1;

      // Notify JS thread
      scheduleOnRN(onScore);
    }

    // Ball exits bottom
    if (ballY.value - ballRadius > screenH) {
      gameActive.value = false;
      scheduleOnRN(onMiss);
    }
  });

  // Handle phase transitions
  useEffect(() => {
    if (gamePhase === 'gameover') {
      gameActive.value = false;
      frameCallback.setActive(false);
      saveHighScore(score);
    } else if (gamePhase === 'countdown') {
      // Stop the loop while countdown is shown; Countdown component
      // will call startAfterCountdown() when it reaches 0
      gameActive.value = false;
      frameCallback.setActive(false);
    }
    // 'playing' is handled by startAfterCountdown / handlePlayAgain directly
  }, [gamePhase, score, frameCallback, gameActive, saveHighScore]);

  // ── Paddle gesture ──
  const panGesture = Gesture.Pan().onUpdate((e) => {
    paddleX.value = clamp(
      e.absoluteX - config.paddleWidth / 2,
      0,
      screenW - config.paddleWidth,
    );
  });

  // ── Called by Countdown when it reaches 0 ──
  const startAfterCountdown = useCallback(() => {
    gameActive.value = true;
    frameCallback.setActive(true);
    setGamePhase('playing');
  }, [gameActive, frameCallback]);

  // ── Game Over handlers ──
  function handlePlayAgain() {
    livesRef.current = GameConstants.livesCount;
    setLives(GameConstants.livesCount);
    setScore(0);
    // Reset speed to initial for a fresh game (unlike mid-game misses)
    currentSpeed.value = config.initialSpeed;
    resetBall();
    paddleX.value = (screenW - config.paddleWidth) / 2;
    // Start immediately on Play Again (no countdown needed for fresh game)
    gameActive.value = true;
    frameCallback.setActive(true);
    setGamePhase('playing');
  }

  function handleShare() {
    const difficultyLabel = difficulty.charAt(0).toUpperCase() + difficulty.slice(1);
    const isNewBest = score > 0 && score >= highScore;
    const message = isNewBest
      ? `🏆 New best! I scored ${score} in Pong (${difficultyLabel}) on Ellie Arcade! Can you beat it? ${emoji}`
      : `🏓 I scored ${score} in Pong (${difficultyLabel}) on Ellie Arcade! Think you can do better? ${emoji}`;
    Share.share({ message });
  }

  function handleHome() {
    router.replace('/');
  }

  // ── Render ──
  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View style={[styles.container, { width: screenW, height: screenH, backgroundColor: tintBackground(ballColor, 0.25) }, shakeStyle]}>
        {/* Drifting shapes behind everything */}
        <AnimatedBackground />

        {/* Score watermark — hidden during countdown */}
        {gamePhase !== 'countdown' && <ScoreDisplay score={score} />}

        {/* HUD — lives + high score */}
        <View style={[styles.hud, { top: insets.top + Spacing.sm }]}>
          <LivesDisplay lives={lives} />
          <Text style={styles.highScoreText}>Best: {highScore}</Text>
        </View>

        {/* Ball — hidden during countdown */}
        {gamePhase !== 'countdown' && <Ball x={ballX} y={ballY} emoji={emoji} themeColor={ballColor} />}

        {/* Paddle */}
        <Paddle
          x={paddleX}
          width={config.paddleWidth}
          bottomOffset={paddleBottomOffset}
        />

        {/* Countdown overlay (after a miss, before ball resumes) */}
        {gamePhase === 'countdown' && (
          <Countdown onComplete={startAfterCountdown} />
        )}

        {/* Game Over overlay */}
        {gamePhase === 'gameover' && (
          <GameOverlay
            score={score}
            highScore={highScore}
            onPlayAgain={handlePlayAgain}
            onHome={handleHome}
            onShare={handleShare}
          />
        )}
      </Animated.View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'hidden',
  },
  hud: {
    position: 'absolute',
    left: Spacing.lg,
    right: Spacing.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 5,
  },
  highScoreText: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: Colors.textDark,
    opacity: 0.7,
  },
});
