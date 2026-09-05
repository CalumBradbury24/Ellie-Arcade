import { useEffect } from 'react';
import { StyleSheet, Text, useWindowDimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withDelay,
  Easing,
} from 'react-native-reanimated';


// ─── Shape config ─────────────────────────────────────────────────────────────

const SHAPES = ['⭐', '✨', '🌸', '💫', '🌈', '☁️', '🍀', '🌙', '❄️', '🎈'];

const PARTICLE_COUNT = 14;

type Particle = {
  id: number;
  emoji: string;
  startX: number;   // 0..1 fraction of screen width
  startY: number;   // 0..1 fraction of screen height — initial position
  size: number;
  duration: number; // ms for one full drift cycle
  delay: number;    // ms before loop starts
  drift: number;    // horizontal sway amplitude in px
};

function seededRandom(seed: number) {
  // Simple deterministic pseudo-random so particles are stable across renders
  const x = Math.sin(seed + 1) * 10000;
  return x - Math.floor(x);
}

function buildParticles(): Particle[] {
  return Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
    id: i,
    emoji: SHAPES[i % SHAPES.length],
    startX: seededRandom(i * 3.1),
    startY: seededRandom(i * 7.4),
    size: 16 + Math.floor(seededRandom(i * 5.7) * 14), // 16–30
    duration: 7000 + Math.floor(seededRandom(i * 2.3) * 8000), // 7–15 s
    delay: Math.floor(seededRandom(i * 9.1) * 6000),            // 0–6 s
    drift: (seededRandom(i * 4.2) - 0.5) * 60,                  // ±30 px
  }));
}

const PARTICLES = buildParticles();

// ─── Single particle ──────────────────────────────────────────────────────────

function FloatingShape({ particle, screenW, screenH }: {
  particle: Particle;
  screenW: number;
  screenH: number;
}) {
  const translateY = useSharedValue(0);
  const translateX = useSharedValue(0);

  // Travel distance: float up by (screenH + some buffer) so it exits the top
  const travelY = screenH + 80;

  useEffect(() => {
    translateY.value = withDelay(
      particle.delay,
      withRepeat(
        withTiming(-travelY, { duration: particle.duration, easing: Easing.linear }),
        -1, // infinite
        false,
      ),
    );

    translateX.value = withDelay(
      particle.delay,
      withRepeat(
        withTiming(particle.drift, {
          duration: particle.duration / 2,
          easing: Easing.inOut(Easing.sin),
        }),
        -1,
        true, // reverse — swings back and forth
      ),
    );
  }, []);

  const style = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
    ],
  }));

  return (
    <Animated.View
      style={[
        styles.shape,
        {
          left: particle.startX * screenW,
          top: particle.startY * screenH,
          width: particle.size,
          height: particle.size,
          opacity: 0.4,
        },
        style,
      ]}
      pointerEvents="none"
    >
      <Text style={{ fontSize: particle.size * 0.85, lineHeight: particle.size }}>
        {particle.emoji}
      </Text>
    </Animated.View>
  );
}

// ─── Background ───────────────────────────────────────────────────────────────

export function AnimatedBackground() {
  const { width: screenW, height: screenH } = useWindowDimensions();

  return (
    <>
      {PARTICLES.map((p) => (
        <FloatingShape
          key={p.id}
          particle={p}
          screenW={screenW}
          screenH={screenH}
        />
      ))}
    </>
  );
}

const styles = StyleSheet.create({
  shape: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 0,
  },
});
