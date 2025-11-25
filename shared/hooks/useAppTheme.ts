import { useThemeStore } from '../store/themeStore';
import { lightTheme, darkTheme } from '../constants/theme';
import { Theme } from '../types';

export const useAppTheme = (): Theme => {
  const { mode } = useThemeStore();
  return mode === 'dark' ? darkTheme : lightTheme;
};
