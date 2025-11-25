import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

type ThemeMode = 'light' | 'dark';

interface ThemeState {
  mode: ThemeMode;
  isDark: boolean;
  toggleTheme: () => void;
  setTheme: (mode: ThemeMode) => void;
  loadTheme: () => Promise<void>;
}

export const useThemeStore = create<ThemeState>((set) => ({
  mode: 'light',
  isDark: false,

  toggleTheme: async () => {
    set((state) => {
      const newMode: ThemeMode = state.mode === 'light' ? 'dark' : 'light';
      AsyncStorage.setItem('theme_mode', newMode);
      return {
        mode: newMode,
        isDark: newMode === 'dark',
      };
    });
  },

  setTheme: async (mode: ThemeMode) => {
    await AsyncStorage.setItem('theme_mode', mode);
    set({
      mode,
      isDark: mode === 'dark',
    });
  },

  loadTheme: async () => {
    try {
      const savedMode = await AsyncStorage.getItem('theme_mode');
      if (savedMode === 'light' || savedMode === 'dark') {
        set({
          mode: savedMode,
          isDark: savedMode === 'dark',
        });
      }
    } catch (error) {
      console.error('Failed to load theme:', error);
    }
  },
}));
