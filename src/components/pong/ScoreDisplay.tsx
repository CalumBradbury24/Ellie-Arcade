import { useEffect } from 'react';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withSpring,
} from 'react-native-reanimated';
import { StyleSheet } from 'react-native';
import { Colors, FontSize, FontWeight } from '@/constants/theme';

type ScoreDisplayProps = {
  score: number;
};

export function ScoreDisplay({ score }: ScoreDisplayProps) {
  const scale = useSharedValue(1);

  // Trigger pop animation whenever score increments
  useEffect(() => {
    if (score === 0) return;
    scale.value = withSequence(
      withSpring(1.35, { duration: 120 }),
      withSpring(1, { duration: 180 }),
    );
  }, [score, scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.Text
      style={[styles.score, animatedStyle]}
      pointerEvents="none"
      accessibilityLabel={`Score: ${score}`}
    >
      {score}
    </Animated.Text>
  );
}

const styles = StyleSheet.create({
  score: {
    position: 'absolute',
    alignSelf: 'center',
    top: '35%',
    fontSize: FontSize.score,
    fontWeight: FontWeight.heavy,
    color: Colors.scoreText,
    opacity: 0.12,
    textAlign: 'center',
    width: '100%',
  },
});
