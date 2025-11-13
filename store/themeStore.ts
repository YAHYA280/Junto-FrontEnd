import { create } from 'zustand';
import { useColorScheme } from 'react-native';

type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeStore {
  themeMode: ThemeMode;
  toggleTheme: () => void;
  setThemeMode: (mode: ThemeMode) => void;
}

export const useThemeStore = create<ThemeStore>((set, get) => ({
  themeMode: 'system',

  toggleTheme: () => {
    const currentMode = get().themeMode;
    if (currentMode === 'system') {
      set({ themeMode: 'light' });
    } else if (currentMode === 'light') {
      set({ themeMode: 'dark' });
    } else {
      set({ themeMode: 'system' });
    }
  },

  setThemeMode: (mode: ThemeMode) => {
    set({ themeMode: mode });
  },
}));
