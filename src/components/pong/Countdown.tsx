import { useEffect, useState } from 'react';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withTiming,
  withSpring,
} from 'react-native-reanimated';
import { StyleSheet } from 'react-native';
import { Colors, FontWeight } from '@/constants/theme';

type CountdownProps = {
  onComplete: () => void;
};

const TICK_MS = 900; // how long each number is shown

export function Countdown({ onComplete }: CountdownProps) {
  const [count, setCount] = useState(3);
  const scale = useSharedValue(0.4);
  const opacity = useSharedValue(1);

  // Animate in the current number
  useEffect(() => {
    scale.value = withSequence(
      withSpring(1.2, { duration: 200 }),
      withSpring(1.0, { duration: 150 }),
    );
    opacity.value = withTiming(1, { duration: 100 });
  }, [count, scale, opacity]);

  // Tick down
  useEffect(() => {
    if (count === -1) onComplete(); // We count down 3,2,1,Go!
    const timer = setTimeout(() => {
      // Fade out before switching number
      opacity.value = withTiming(0, { duration: 200 });
      setTimeout(() => setCount((c) => c - 1), 220);
    }, TICK_MS);

    return () => clearTimeout(timer);
  }, [count, onComplete, opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  // on 0 we show the `Go!` text
  if (count === -1) return null;

  return (
    <Animated.Text
      style={[styles.text, animatedStyle]}
      accessibilityLabel={`Starting in ${count}`}
      accessibilityLiveRegion="assertive"
    >
      {count || 'GO!'}
    </Animated.Text>
  );
}

const styles = StyleSheet.create({
  text: {
    position: 'absolute',
    alignSelf: 'center',
    top: '40%',
    fontSize: 140,
    fontWeight: FontWeight.heavy,
    color: Colors.primary,
    width: '100%',
    textAlign: 'center',
    // Subtle shadow so it reads over the game background
    textShadowColor: 'rgba(0,0,0,0.12)',
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 8,
  },
});
