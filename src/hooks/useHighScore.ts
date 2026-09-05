import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Difficulty, HIGH_SCORE_KEY } from '@/types/pong';

type UseHighScoreReturn = {
  highScore: number;
  saveHighScore: (score: number) => Promise<void>;
};

export function useHighScore(difficulty: Difficulty): UseHighScoreReturn {
  const [highScore, setHighScore] = useState(0);
  const key = HIGH_SCORE_KEY(difficulty);

  // Load on mount (or when difficulty changes)
  useEffect(() => {
    AsyncStorage.getItem(key)
      .then((stored) => {
        if (stored !== null) {
          const parsed = parseInt(stored, 10);
          if (!isNaN(parsed)) {
            setHighScore(parsed);
          }
        }
      })
      .catch(() => {
        // First run or storage unavailable — silently ignore
      });
  }, [key]);

  const saveHighScore = useCallback(
    async (score: number) => {
      if (score <= highScore) return;
      try {
        await AsyncStorage.setItem(key, String(score));
        setHighScore(score);
      } catch {
        // Storage failure shouldn't crash the game
      }
    },
    [key, highScore],
  );

  return { highScore, saveHighScore };
}
