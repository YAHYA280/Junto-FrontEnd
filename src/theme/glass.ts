import { ViewStyle } from 'react-native';
import { colors } from './colors';
import { shadows } from './shadows';

// Glassmorphism style presets
export const glassStyles = {
  // Light glass card
  light: {
    backgroundColor: colors.glass.light,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
    ...shadows.glass,
  } as ViewStyle,

  // Medium glass card
  medium: {
    backgroundColor: colors.glass.medium,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 24,
    ...shadows.glass,
  } as ViewStyle,

  // Dark glass card
  dark: {
    backgroundColor: colors.glass.dark,
    borderWidth: 1,
    borderColor: 'rgba(71, 181, 255, 0.3)',
    borderRadius: 20,
    ...shadows.glassStrong,
  } as ViewStyle,

  // Primary glass (for buttons/CTAs)
  primary: {
    backgroundColor: colors.glass.primary,
    borderWidth: 1.5,
    borderColor: 'rgba(223, 246, 255, 0.4)',
    borderRadius: 16,
    ...shadows.glass,
  } as ViewStyle,

  // Subtle glass (for backgrounds)
  subtle: {
    backgroundColor: colors.glass.subtle,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
  } as ViewStyle,

  // Floating glass (for bottom nav)
  floating: {
    backgroundColor: colors.glass.dark,
    borderWidth: 1,
    borderColor: 'rgba(71, 181, 255, 0.4)',
    borderRadius: 28,
    ...shadows.glassStrong,
  } as ViewStyle,

  // Card glass (for deal cards)
  card: {
    backgroundColor: colors.glass.medium,
    borderWidth: 1.5,
    borderColor: 'rgba(223, 246, 255, 0.2)',
    borderRadius: 24,
    ...shadows.glass,
    overflow: 'hidden' as const,
  } as ViewStyle,
};

export type GlassStyle = keyof typeof glassStyles;

// Blur intensity presets for BlurView
export const blurIntensity = {
  light: 20,
  medium: 40,
  strong: 60,
  intense: 80,
};
