import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import type { SharedValue } from 'react-native-reanimated';
import { Text, StyleSheet } from 'react-native';
import { Colors, GameConstants } from '@/constants/theme';

type BallProps = {
  x: SharedValue<number>;
  y: SharedValue<number>;
  emoji: string;
};

const { ballRadius } = GameConstants;
const diameter = ballRadius * 2;

export function Ball({ x, y, emoji }: BallProps) {
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: x.value - ballRadius },
      { translateY: y.value - ballRadius },
    ],
  }));

  return (
    <Animated.View style={[styles.ball, animatedStyle]}>
      <Text style={styles.emoji} accessibilityLabel={`Ball: ${emoji}`}>
        {emoji}
      </Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  ball: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: diameter,
    height: diameter,
    borderRadius: ballRadius,
    backgroundColor: Colors.ballColor,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  emoji: {
    fontSize: ballRadius * 1.1,
    lineHeight: diameter,
    textAlign: 'center',
  },
});
