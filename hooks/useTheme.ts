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
  // Backgrounds - Light Gray for contrast (like dark mode has dark gray bg)
  background: '#F3F4F6',
  backgroundSecondary: '#E5E7EB',
  backgroundTertiary: '#D1D5DB',

  // Surfaces - White cards on gray backgrounds (creates contrast)
  surface: '#FFFFFF',
  surfaceSecondary: '#F9FAFB',

  // Text - Dark gray for readability
  text: '#111827',
  textSecondary: '#4B5563',
  textTertiary: '#6B7280',
  textInverse: '#FFFFFF',

  // Primary - Main Emerald Green #059669
  primary: '#059669',
  primaryLight: '#10B981',
  primaryDark: '#047857',

  // Accent - Lighter emerald for highlights
  accent: '#34D399',
  accentLight: '#6EE7B7',

  // Semantic
  success: '#059669',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',

  // Borders - Darker gray for visibility on gray bg
  border: '#D1D5DB',
  borderLight: '#E5E7EB',
  divider: '#D1D5DB',

  // Glassmorphism - White with subtle transparency
  glassBackground: 'rgba(255, 255, 255, 0.95)',
  glassBorder: 'rgba(0, 0, 0, 0.08)',
  glassBackgroundLight: 'rgba(255, 255, 255, 0.9)',

  // Gradients - Emerald gradient for buttons/elements
  gradientStart: '#059669',
  gradientMiddle: '#10B981',
  gradientEnd: '#34D399',

  // Shadow - Darker shadow for visibility on gray
  shadow: 'rgba(0, 0, 0, 0.15)',

  // Tab Bar - White (stands out from gray background)
  tabBarBackground: '#FFFFFF',
  icon: '#6B7280',

  isDark: false,
};

const darkColors: ThemeColors = {
  // Backgrounds - True dark for OLED-friendly contrast
  background: '#111111',
  backgroundSecondary: '#1A1A1A',
  backgroundTertiary: '#262626',

  // Surfaces - Elevated cards with clear contrast
  surface: '#1E1E1E',
  surfaceSecondary: '#2A2A2A',

  // Text - High contrast for readability
  text: '#FFFFFF',
  textSecondary: '#A3A3A3',
  textTertiary: '#737373',
  textInverse: '#111111',

  // Primary - Bright emerald for dark mode pop
  primary: '#10B981',
  primaryLight: '#34D399',
  primaryDark: '#059669',

  // Accent - Vibrant emerald
  accent: '#6EE7B7',
  accentLight: '#A7F3D0',

  // Semantic - Brighter for dark backgrounds
  success: '#22C55E',
  warning: '#FBBF24',
  error: '#F87171',
  info: '#60A5FA',

  // Borders - Visible but subtle
  border: '#333333',
  borderLight: '#404040',
  divider: '#2A2A2A',

  // Glassmorphism - Dark glass effect
  glassBackground: 'rgba(30, 30, 30, 0.95)',
  glassBorder: 'rgba(255, 255, 255, 0.1)',
  glassBackgroundLight: 'rgba(42, 42, 42, 0.9)',

  // Gradients - Emerald gradient for dark mode
  gradientStart: '#059669',
  gradientMiddle: '#10B981',
  gradientEnd: '#34D399',

  // Shadow - Subtle glow effect
  shadow: 'rgba(0, 0, 0, 0.6)',

  // Tab Bar - Matches surface for cohesion
  tabBarBackground: '#1E1E1E',
  icon: '#737373',

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
