import { FlatList, Text, View, StyleSheet, ListRenderItemInfo } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { GameCard } from '@/components/GameCard';
import { Colors, FontSize, FontWeight, Spacing } from '@/constants/theme';

type Game = {
  id: string;
  title: string;
  emoji: string;
  description: string;
  locked: boolean;
  route?: string;
};

const GAMES: Game[] = [
  {
    id: 'pong',
    title: 'Pong',
    emoji: '🏓',
    description: 'Bounce the ball with your paddle. How long can you last?',
    locked: false,
    route: '/pong',
  },
  {
    id: 'coming-soon-1',
    title: 'Mystery Game',
    emoji: '🎮',
    description: 'Coming Soon',
    locked: true,
  },
  {
    id: 'coming-soon-2',
    title: 'Mystery Game',
    emoji: '🧩',
    description: 'Coming Soon',
    locked: true,
  },
  {
    id: 'coming-soon-3',
    title: 'Mystery Game',
    emoji: '⭐',
    description: 'Coming Soon',
    locked: true,
  },
];

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  function renderItem({ item }: ListRenderItemInfo<Game>) {
    return (
      <GameCard
        title={item.title}
        emoji={item.emoji}
        description={item.description}
        locked={item.locked}
        onPress={() => {
          if (item.route) {
            router.push(item.route as '/pong');
          }
        }}
      />
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerEmoji}>🎮</Text>
        <Text style={styles.headerTitle}>Ellie Arcade</Text>
        <Text style={styles.headerSubtitle}>Pick a game and play!</Text>
      </View>

      {/* Game grid */}
      <FlatList
        data={GAMES}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={[
          styles.listContent,
          { paddingBottom: insets.bottom + Spacing.lg },
        ]}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.lg,
  },
  headerEmoji: {
    fontSize: 48,
    marginBottom: Spacing.sm,
  },
  headerTitle: {
    fontSize: FontSize.xxl,
    fontWeight: FontWeight.heavy,
    color: Colors.textDark,
    textAlign: 'center',
    marginBottom: Spacing.xs,
  },
  headerSubtitle: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.regular,
    color: Colors.textMuted,
    textAlign: 'center',
  },
  listContent: {
    paddingHorizontal: Spacing.sm,
    paddingTop: Spacing.sm,
  },
});
