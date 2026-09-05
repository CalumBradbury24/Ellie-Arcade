import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors, FontSize, FontWeight, Radius, Spacing } from '@/constants/theme';
import { ConfettiBurst } from '@/components/pong/ConfettiBurst';

type GameOverlayProps = {
  score: number;
  highScore: number;
  onPlayAgain: () => void;
  onHome: () => void;
  onShare: () => void;
};

export function GameOverlay({ score, highScore, onPlayAgain, onHome, onShare }: GameOverlayProps) {
  const isNewBest = score > 0 && score >= highScore;

  return (
    <View style={styles.overlay}>
      {/* Confetti fires on top of everything when a new best is set */}
      {isNewBest && <ConfettiBurst />}

      <View style={styles.card}>
        <Text style={styles.title}>Game Over! 😢</Text>

        {isNewBest && (
          <Text style={styles.newBest}>🎉 New best score!</Text>
        )}

        <View style={styles.scoreRow}>
          <View style={styles.scoreBlock}>
            <Text style={styles.scoreLabel}>Your score</Text>
            <Text style={styles.scoreValue}>{score}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.scoreBlock}>
            <Text style={styles.scoreLabel}>Best score</Text>
            <Text style={styles.scoreValue}>{highScore}</Text>
          </View>
        </View>

        <View style={styles.buttons}>
          <TouchableOpacity
            style={[styles.button, styles.primaryButton]}
            onPress={onPlayAgain}
            activeOpacity={0.85}
            accessibilityRole="button"
            accessibilityLabel="Play Again"
          >
            <Text style={styles.primaryButtonText}>Play Again 🎮</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.shareButton]}
            onPress={onShare}
            activeOpacity={0.85}
            accessibilityRole="button"
            accessibilityLabel="Share your score"
          >
            <Text style={styles.shareButtonText}>Share score 📤</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.secondaryButton]}
            onPress={onHome}
            activeOpacity={0.85}
            accessibilityRole="button"
            accessibilityLabel="Go to Home"
          >
            <Text style={styles.secondaryButtonText}>Home 🏠</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: Colors.overlayBackground,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  card: {
    backgroundColor: Colors.background,
    borderRadius: Radius.xl,
    padding: Spacing.xxl,
    marginHorizontal: Spacing.xl,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 12,
    width: '85%',
  },
  title: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.heavy,
    color: Colors.textDark,
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  newBest: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    color: Colors.primary,
    marginBottom: Spacing.md,
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: Spacing.lg,
    gap: Spacing.lg,
  },
  scoreBlock: {
    alignItems: 'center',
    flex: 1,
  },
  scoreLabel: {
    fontSize: FontSize.sm,
    color: Colors.textMuted,
    marginBottom: Spacing.xs,
    fontWeight: FontWeight.semibold,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  scoreValue: {
    fontSize: FontSize.xxl,
    fontWeight: FontWeight.heavy,
    color: Colors.textDark,
  },
  divider: {
    width: 1,
    height: 48,
    backgroundColor: Colors.cardBorder,
  },
  buttons: {
    width: '100%',
    gap: Spacing.sm,
    marginTop: Spacing.sm,
  },
  button: {
    borderRadius: Radius.lg,
    paddingVertical: Spacing.md,
    alignItems: 'center',
  },
  primaryButton: {
    backgroundColor: Colors.primary,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryButtonText: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.heavy,
    color: Colors.textLight,
  },
  secondaryButton: {
    backgroundColor: Colors.cardBackground,
    borderWidth: 2,
    borderColor: Colors.cardBorder,
  },
  secondaryButtonText: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.textDark,
  },
  shareButton: {
    backgroundColor: Colors.accent,
    borderWidth: 2,
    borderColor: Colors.cardBorder,
  },
  shareButtonText: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.textDark,
  },
});
