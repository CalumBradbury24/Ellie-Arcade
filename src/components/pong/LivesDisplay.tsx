import { View, Text, StyleSheet } from 'react-native';
import { GameConstants, Spacing } from '@/constants/theme';

type LivesDisplayProps = {
  lives: number;
};

export function LivesDisplay({ lives }: LivesDisplayProps) {
  const hearts = Array.from({ length: GameConstants.livesCount }, (_, i) =>
    i < lives ? '❤️' : '🖤',
  );

  return (
    <View style={styles.container} accessibilityLabel={`Lives remaining: ${lives}`}>
      {hearts.map((heart, i) => (
        <Text key={i} style={styles.heart}>
          {heart}
        </Text>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: Spacing.xs,
  },
  heart: {
    fontSize: 22,
  },
});
