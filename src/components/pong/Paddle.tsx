import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import type { SharedValue } from 'react-native-reanimated';
import { StyleSheet } from 'react-native';
import { Colors, GameConstants, Radius } from '@/constants/theme';

type PaddleProps = {
  x: SharedValue<number>;
  width: number;
  bottomOffset: number;
};

export function Paddle({ x, width, bottomOffset }: PaddleProps) {
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: x.value }],
  }));

  return (
    <Animated.View
      style={[
        styles.paddle,
        animatedStyle,
        {
          width,
          bottom: bottomOffset,
          height: GameConstants.paddleHeight,
        },
      ]}
    />
  );
}

const styles = StyleSheet.create({
  paddle: {
    position: 'absolute',
    left: 0,
    borderRadius: Radius.full,
    backgroundColor: Colors.paddleColor,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 5,
  },
});
