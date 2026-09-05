import { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Pressable,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Difficulty,
  DIFFICULTY_CONFIG,
  EMOJI_OPTIONS,
} from '@/types/pong';
import { useHighScore } from '@/hooks/useHighScore';
import { Colors, FontSize, FontWeight, Radius, Spacing } from '@/constants/theme';

const DIFFICULTIES: { value: Difficulty; label: string; description: string }[] = [
  { value: 'easy', label: 'Easy', description: 'Big paddle, slow ball' },
  { value: 'medium', label: 'Medium', description: 'Normal paddle & speed' },
  { value: 'hard', label: 'Hard', description: 'Small paddle, fast ball' },
];

// Load all three high scores at the top level — hooks can't be called in loops
function useAllHighScores() {
  const easy = useHighScore('easy');
  const medium = useHighScore('medium');
  const hard = useHighScore('hard');
  return { easy: easy.highScore, medium: medium.highScore, hard: hard.highScore };
}

export default function NumbersPongSetup() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [selectedEmoji, setSelectedEmoji] = useState(EMOJI_OPTIONS[0].emoji);
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>('easy');
  const highScores = useAllHighScores();

  function handlePlay() {
    const option = EMOJI_OPTIONS.find((o) => o.emoji === selectedEmoji) ?? EMOJI_OPTIONS[0];
    router.push({
      pathname: '/pong/game',
      params: {
        difficulty: selectedDifficulty,
        emoji: selectedEmoji,
        ballColor: option.color,
      },
    });
  }

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={[
        styles.content,
        { paddingBottom: insets.bottom + Spacing.xxl },
      ]}
      showsVerticalScrollIndicator={false}
    >
      {/* Hero */}
      <View style={styles.hero}>
        <Text style={styles.heroEmoji}>🏓</Text>
        <Text style={styles.heroTitle}>Numbers Pong</Text>
        <Text style={styles.heroSubtitle}>
          Bounce the ball — don't let it fall!
        </Text>
      </View>

      {/* ── Emoji Picker ── */}
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>Choose your ball</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.emojiRow}
        >
          {EMOJI_OPTIONS.map((option) => {
            const isSelected = selectedEmoji === option.emoji;
            return (
              <Pressable
                key={option.emoji}
                onPress={() => setSelectedEmoji(option.emoji)}
                style={[styles.emojiButton, isSelected && styles.emojiButtonSelected]}
                accessibilityRole="radio"
                accessibilityLabel={option.label}
                accessibilityState={{ checked: isSelected }}
              >
                <Text style={styles.emojiText}>{option.emoji}</Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      {/* ── Difficulty Picker ── */}
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>Choose difficulty</Text>
        <View style={styles.difficultyRow}>
          {DIFFICULTIES.map((d) => {
            const isSelected = selectedDifficulty === d.value;
            const config = DIFFICULTY_CONFIG[d.value];
            const best = highScores[d.value];
            return (
              <TouchableOpacity
                key={d.value}
                onPress={() => setSelectedDifficulty(d.value)}
                style={[styles.difficultyButton, isSelected && styles.difficultyButtonSelected]}
                activeOpacity={0.75}
                accessibilityRole="radio"
                accessibilityLabel={`${d.label} — ${d.description}. Best score: ${best}`}
                accessibilityState={{ checked: isSelected }}
              >
                <Text style={[styles.difficultyLabel, isSelected && styles.difficultyLabelSelected]}>
                  {d.label}
                </Text>
                <Text style={[styles.difficultyDescription, isSelected && styles.difficultyDescriptionSelected]}>
                  {d.description}
                </Text>
                {/* Visual paddle size hint */}
                <View style={styles.paddlePreviewContainer}>
                  <View
                    style={[
                      styles.paddlePreview,
                      isSelected && styles.paddlePreviewSelected,
                      { width: config.paddleWidth * 0.5 },
                    ]}
                  />
                </View>
                {/* High score */}
                <View style={styles.bestScoreContainer}>
                  <Text style={[styles.bestScoreLabel, isSelected && styles.bestScoreLabelSelected]}>
                    Best
                  </Text>
                  <Text style={[styles.bestScoreValue, isSelected && styles.bestScoreValueSelected]}>
                    {best > 0 ? best : '—'}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* ── Play Button ── */}
      <TouchableOpacity
        style={styles.playButton}
        onPress={handlePlay}
        activeOpacity={0.85}
        accessibilityRole="button"
        accessibilityLabel="Play Numbers Pong"
      >
        <Text style={styles.playButtonText}>Play! 🎮</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xl,
  },

  // Hero
  hero: {
    alignItems: 'center',
    marginBottom: Spacing.xxl,
  },
  heroEmoji: {
    fontSize: 56,
    marginBottom: Spacing.sm,
  },
  heroTitle: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.heavy,
    color: Colors.textDark,
    marginBottom: Spacing.xs,
  },
  heroSubtitle: {
    fontSize: FontSize.md,
    color: Colors.textMuted,
    textAlign: 'center',
  },

  // Section
  section: {
    marginBottom: Spacing.xl,
  },
  sectionLabel: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.textDark,
    marginBottom: Spacing.md,
  },

  // Emoji picker
  emojiRow: {
    gap: Spacing.sm,
    paddingHorizontal: Spacing.xs,
  },
  emojiButton: {
    width: 60,
    height: 60,
    borderRadius: Radius.full,
    backgroundColor: Colors.cardBackground,
    borderWidth: 2,
    borderColor: Colors.cardBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emojiButtonSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.35,
    shadowRadius: 6,
    elevation: 4,
  },
  emojiText: {
    fontSize: 28,
  },

  // Difficulty picker
  difficultyRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  difficultyButton: {
    flex: 1,
    borderRadius: Radius.md,
    backgroundColor: Colors.cardBackground,
    borderWidth: 2,
    borderColor: Colors.cardBorder,
    padding: Spacing.md,
    alignItems: 'center',
    gap: Spacing.xs,
  },
  difficultyButtonSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  difficultyLabel: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: Colors.textDark,
  },
  difficultyLabelSelected: {
    color: Colors.textLight,
  },
  difficultyDescription: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
    textAlign: 'center',
  },
  difficultyDescriptionSelected: {
    color: 'rgba(255,255,255,0.8)',
  },
  paddlePreviewContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: Spacing.xs,
  },
  paddlePreview: {
    height: 6,
    borderRadius: Radius.full,
    backgroundColor: Colors.cardBorder,
  },
  paddlePreviewSelected: {
    backgroundColor: 'rgba(255,255,255,0.6)',
  },

  // Best score inside difficulty card
  bestScoreContainer: {
    alignItems: 'center',
    marginTop: Spacing.xs,
    paddingTop: Spacing.xs,
    borderTopWidth: 1,
    borderTopColor: Colors.cardBorder,
    width: '100%',
  },
  bestScoreLabel: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semibold,
    color: Colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  bestScoreLabelSelected: {
    color: 'rgba(255,255,255,0.65)',
  },
  bestScoreValue: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.heavy,
    color: Colors.textDark,
  },
  bestScoreValueSelected: {
    color: Colors.textLight,
  },

  // Play button
  playButton: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.xl,
    paddingVertical: Spacing.lg,
    alignItems: 'center',
    marginTop: Spacing.sm,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 6,
  },
  playButtonText: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.heavy,
    color: Colors.textLight,
    letterSpacing: 0.5,
  },
});
