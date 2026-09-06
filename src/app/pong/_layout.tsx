import { Stack } from 'expo-router';
import { Colors, FontSize, FontWeight } from '@/constants/theme';

function PongLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: Colors.background },
        headerTintColor: Colors.textDark,
        headerTitleStyle: {
          fontWeight: FontWeight.bold,
          fontSize: FontSize.lg,
          color: Colors.textDark,
        },
        headerShadowVisible: false,
        contentStyle: { backgroundColor: Colors.background },
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen
        name="index"
        options={{ title: 'Pong' }}
      />
      <Stack.Screen
        name="game"
        options={{ headerShown: false }}
      />
    </Stack>
  );
}

export default PongLayout;