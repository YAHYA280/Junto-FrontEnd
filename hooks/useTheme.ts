import { useColorScheme } from 'react-native';
import { useThemeStore } from '../store/themeStore';

export interface ThemeColors {
  // Background colors
  background: string;
  backgroundSecondary: string;
  backgroundTertiary: string;

  // Surface colors (for cards, modals, etc.)
  surface: string;
  surfaceSecondary: string;

  // Text colors
  text: string;
  textSecondary: string;
  textTertiary: string;
  textInverse: string;

  // Primary brand colors
  primary: string;
  primaryLight: string;
  primaryDark: string;

  // Accent colors
  accent: string;
  accentLight: string;

  // Semantic colors
  success: string;
  warning: string;
  error: string;
  info: string;

  // Border and divider colors
  border: string;
  borderLight: string;
  divider: string;

  // Glassmorphism colors
  glassBackground: string;
  glassBorder: string;
  glassBackgroundLight: string;

  // Gradient colors
  gradientStart: string;
  gradientMiddle: string;
  gradientEnd: string;

  // Shadow
  shadow: string;

  // Tab Bar
  tabBarBackground: string;
  icon: string;

  // Status
  isDark: boolean;
}

const lightColors: ThemeColors = {
  // Backgrounds
  background: '#F2EFE7',
  backgroundSecondary: '#FFFFFF',
  backgroundTertiary: '#E8E5DD',

  // Surfaces
  surface: '#FFFFFF',
  surfaceSecondary: '#F2EFE7',

  // Text
  text: '#1F2937',
  textSecondary: '#4B5563',
  textTertiary: '#6B7280',
  textInverse: '#FFFFFF',

  // Primary
  primary: '#48A6A7',
  primaryLight: '#9ACBD0',
  primaryDark: '#006A71',

  // Accent
  accent: '#9ACBD0',
  accentLight: '#B5DDE0',

  // Semantic
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#48A6A7',

  // Borders
  border: '#D6D3CB',
  borderLight: '#E8E5DD',
  divider: '#D6D3CB',

  // Glassmorphism
  glassBackground: 'rgba(242, 239, 231, 0.7)',
  glassBorder: 'rgba(72, 166, 167, 0.2)',
  glassBackgroundLight: 'rgba(255, 255, 255, 0.5)',

  // Gradients
  gradientStart: '#9ACBD0',
  gradientMiddle: '#48A6A7',
  gradientEnd: '#006A71',

  // Shadow
  shadow: 'rgba(0, 106, 113, 0.1)',

  // Tab Bar
  tabBarBackground: '#FFFFFF',
  icon: '#6B7280',

  isDark: false,
};

const darkColors: ThemeColors = {
  // Backgrounds
  background: '#0D1018',
  backgroundSecondary: '#1A1F2E',
  backgroundTertiary: '#252A3A',

  // Surfaces
  surface: '#1A1F2E',
  surfaceSecondary: '#252A3A',

  // Text
  text: '#F2EFE7',
  textSecondary: '#CBD5E1',
  textTertiary: '#94A3B8',
  textInverse: '#0D1018',

  // Primary
  primary: '#9ACBD0',
  primaryLight: '#B5DDE0',
  primaryDark: '#48A6A7',

  // Accent
  accent: '#48A6A7',
  accentLight: '#9ACBD0',

  // Semantic
  success: '#34D399',
  warning: '#FBBF24',
  error: '#F87171',
  info: '#9ACBD0',

  // Borders
  border: '#2A3142',
  borderLight: '#353B4D',
  divider: '#2A3142',

  // Glassmorphism
  glassBackground: 'rgba(26, 31, 46, 0.7)',
  glassBorder: 'rgba(154, 203, 208, 0.2)',
  glassBackgroundLight: 'rgba(37, 42, 58, 0.5)',

  // Gradients
  gradientStart: '#006A71',
  gradientMiddle: '#48A6A7',
  gradientEnd: '#9ACBD0',

  // Shadow
  shadow: 'rgba(0, 0, 0, 0.3)',

  // Tab Bar
  tabBarBackground: '#1A1F2E',
  icon: '#94A3B8',

  isDark: true,
};

export const useThemeColors = (): ThemeColors => {
  const systemColorScheme = useColorScheme();
  const { themeMode } = useThemeStore();

  let effectiveScheme: 'light' | 'dark' = 'light';

  if (themeMode === 'system') {
    effectiveScheme = systemColorScheme === 'dark' ? 'dark' : 'light';
  } else {
    effectiveScheme = themeMode;
  }

  return effectiveScheme === 'dark' ? darkColors : lightColors;
};
