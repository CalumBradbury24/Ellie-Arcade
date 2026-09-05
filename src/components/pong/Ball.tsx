import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import type { SharedValue } from 'react-native-reanimated';
import { Text, StyleSheet } from 'react-native';
import { Colors, GameConstants } from '@/constants/theme';

type BallProps = {
  x: SharedValue<number>;
  y: SharedValue<number>;
  emoji: string;
  /** Per-emoji background & glow colour */
  themeColor?: string;
};

const { ballRadius } = GameConstants;
const diameter = ballRadius * 2;

export function Ball({ x, y, emoji, themeColor = Colors.ballColor }: BallProps) {
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: x.value - ballRadius },
      { translateY: y.value - ballRadius },
    ],
  }));

  return (
    <Animated.View
      style={[
        styles.ball,
        animatedStyle,
        {
          backgroundColor: themeColor,
          shadowColor: themeColor,
        },
      ]}
    >
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
    alignItems: 'center',
    justifyContent: 'center',
    // Shadow intensity is higher than before so the coloured glow reads clearly
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.75,
    shadowRadius: 12,
    elevation: 8,
  },
  emoji: {
    fontSize: ballRadius * 1.1,
    lineHeight: diameter,
    textAlign: 'center',
  },
});
