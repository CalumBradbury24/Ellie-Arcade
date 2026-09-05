import { Pressable, Text, StyleSheet, View } from 'react-native';
import { Colors, FontSize, FontWeight, Radius, Spacing } from '@/constants/theme';

type GameCardProps = {
  title: string;
  emoji: string;
  description: string;
  locked?: boolean;
  onPress?: () => void;
};

export function GameCard({ title, emoji, description, locked = false, onPress }: GameCardProps) {
  return (
    <Pressable
      onPress={locked ? undefined : onPress}
      style={({ pressed }) => [
        styles.card,
        locked ? styles.cardLocked : styles.cardActive,
        pressed && !locked && styles.cardPressed,
      ]}
      accessibilityRole="button"
      accessibilityLabel={locked ? `${title} — Coming Soon` : `Play ${title}`}
      accessibilityState={{ disabled: locked }}
    >
      {/* Lock badge */}
      {locked && (
        <View style={styles.lockBadge}>
          <Text style={styles.lockIcon}>🔒</Text>
        </View>
      )}

      {/* Emoji icon */}
      <View style={[styles.emojiContainer, locked && styles.emojiContainerLocked]}>
        <Text style={styles.emoji}>{emoji}</Text>
      </View>

      {/* Text */}
      <Text style={[styles.title, locked && styles.titleLocked]} numberOfLines={1}>
        {title}
      </Text>
      <Text style={[styles.description, locked && styles.descriptionLocked]} numberOfLines={2}>
        {locked ? 'Coming Soon' : description}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    margin: Spacing.sm,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    alignItems: 'center',
    borderWidth: 2,
    minHeight: 160,
    justifyContent: 'center',
  },
  cardActive: {
    backgroundColor: Colors.cardBackground,
    borderColor: Colors.cardBorder,
    // subtle shadow
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 4,
  },
  cardLocked: {
    backgroundColor: Colors.comingSoonBackground,
    borderColor: Colors.comingSoonBorder,
  },
  cardPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.97 }],
  },
  lockBadge: {
    position: 'absolute',
    top: Spacing.sm,
    right: Spacing.sm,
  },
  lockIcon: {
    fontSize: FontSize.sm,
  },
  emojiContainer: {
    width: 64,
    height: 64,
    borderRadius: Radius.full,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
  },
  emojiContainerLocked: {
    backgroundColor: Colors.comingSoonBorder,
  },
  emoji: {
    fontSize: 32,
  },
  title: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: Colors.textDark,
    textAlign: 'center',
    marginBottom: Spacing.xs,
  },
  titleLocked: {
    color: Colors.comingSoonText,
  },
  description: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.regular,
    color: Colors.textMuted,
    textAlign: 'center',
  },
  descriptionLocked: {
    color: Colors.comingSoonText,
  },
});
