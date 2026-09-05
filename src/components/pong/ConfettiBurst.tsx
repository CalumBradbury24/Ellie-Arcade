import { useEffect } from 'react';
import { StyleSheet, Text, useWindowDimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  withSequence,
  Easing,
  runOnJS,
} from 'react-native-reanimated';

// ─── Config ───────────────────────────────────────────────────────────────────

const CONFETTI_EMOJIS = ['🎉', '⭐', '✨', '🌟', '🎊', '💫', '🏆', '🎈'];

const PARTICLE_COUNT = 24;

// How long each particle's outward flight takes (ms)
const FLIGHT_DURATION = 900;
// How long the fade-out takes after landing (ms)
const FADE_DURATION = 400;
// Total lifetime before the particle is invisible
const TOTAL_DURATION = FLIGHT_DURATION + FADE_DURATION;
// Max scatter radius in px from the burst origin
const MAX_RADIUS = 220;

type Particle = {
  id: number;
  emoji: string;
  angle: number;    // radians
  radius: number;   // scatter distance in px
  size: number;     // font size
  delay: number;    // stagger delay in ms
  spinTo: number;   // final rotation in degrees
};

function seededRandom(seed: number) {
  const x = Math.sin(seed + 1) * 10000;
  return x - Math.floor(x);
}

function buildParticles(): Particle[] {
  return Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
    id: i,
    emoji: CONFETTI_EMOJIS[i % CONFETTI_EMOJIS.length],
    // Spread evenly around the circle with a little jitter
    angle: ((i / PARTICLE_COUNT) * Math.PI * 2) + seededRandom(i * 3.7) * 0.4,
    radius: MAX_RADIUS * (0.5 + seededRandom(i * 2.1) * 0.5),
    size: 18 + Math.floor(seededRandom(i * 5.3) * 16), // 18–34
    delay: Math.floor(seededRandom(i * 8.9) * 120),     // 0–120 ms stagger
    spinTo: (seededRandom(i * 4.6) - 0.5) * 360,       // ±180°
  }));
}

const PARTICLES = buildParticles();

// ─── Single particle ──────────────────────────────────────────────────────────

function ConfettiParticle({
  particle,
  originX,
  originY,
}: {
  particle: Particle;
  originX: number;
  originY: number;
}) {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const opacity = useSharedValue(0);
  const rotate = useSharedValue(0);
  const scale = useSharedValue(0);

  const destX = Math.cos(particle.angle) * particle.radius;
  const destY = Math.sin(particle.angle) * particle.radius;

  useEffect(() => {
    const easeOut = Easing.out(Easing.cubic);

    // Pop in, fly out, then fade
    opacity.value = withDelay(
      particle.delay,
      withSequence(
        withTiming(1, { duration: 80 }),
        withDelay(FLIGHT_DURATION - 80, withTiming(0, { duration: FADE_DURATION })),
      ),
    );

    scale.value = withDelay(
      particle.delay,
      withSequence(
        withTiming(1, { duration: 150, easing: Easing.out(Easing.back(2)) }),
        withDelay(FLIGHT_DURATION - 150, withTiming(0.6, { duration: FADE_DURATION })),
      ),
    );

    translateX.value = withDelay(
      particle.delay,
      withTiming(destX, { duration: FLIGHT_DURATION, easing: easeOut }),
    );

    translateY.value = withDelay(
      particle.delay,
      withTiming(destY, { duration: FLIGHT_DURATION, easing: easeOut }),
    );

    rotate.value = withDelay(
      particle.delay,
      withTiming(particle.spinTo, { duration: TOTAL_DURATION, easing: Easing.linear }),
    );
  }, []);

  const style = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { rotate: `${rotate.value}deg` },
      { scale: scale.value },
    ],
  }));

  return (
    <Animated.View
      style={[
        styles.particle,
        {
          left: originX - particle.size / 2,
          top: originY - particle.size / 2,
          width: particle.size,
          height: particle.size,
        },
        style,
      ]}
      pointerEvents="none"
    >
      <Text style={{ fontSize: particle.size * 0.9, lineHeight: particle.size }}>
        {particle.emoji}
      </Text>
    </Animated.View>
  );
}

// ─── Burst ────────────────────────────────────────────────────────────────────

type ConfettiBurstProps = {
  /** Called once all particles have faded out */
  onComplete?: () => void;
};

export function ConfettiBurst({ onComplete }: ConfettiBurstProps) {
  const { width: screenW, height: screenH } = useWindowDimensions();

  // Burst from the vertical centre, slightly above mid-screen
  const originX = screenW / 2;
  const originY = screenH * 0.38;

  // Fire onComplete after all particles have finished
  useEffect(() => {
    if (!onComplete) return;
    const maxDelay = Math.max(...PARTICLES.map((p) => p.delay));
    const timeout = setTimeout(onComplete, maxDelay + TOTAL_DURATION + 50);
    return () => clearTimeout(timeout);
  }, [onComplete]);

  return (
    <>
      {PARTICLES.map((p) => (
        <ConfettiParticle
          key={p.id}
          particle={p}
          originX={originX}
          originY={originY}
        />
      ))}
    </>
  );
}

const styles = StyleSheet.create({
  particle: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 20,
  },
});
