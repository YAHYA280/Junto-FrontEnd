import { Dimensions } from 'react-native';
import { colors } from '../theme/colors';

const { height, width } = Dimensions.get('window');

export const COLORS = {
  primary: colors.primary,
  secondary: colors.secondary,
  tertiary: colors.tertiary,
  success: colors.success,
  black: colors.black,
  black2: colors.black2,
  info: colors.info,
  warning: colors.warning,
  error: colors.error,
  white: colors.white,
  secondaryWhite: colors.secondaryWhite,
  tertiaryWhite: colors.tertiaryWhite,
  gray: colors.gray,
  gray2: colors.gray2,
  gray3: colors.gray3,
  dark1: colors.dark1,
  dark2: colors.dark2,
  dark3: colors.dark3,
  greyscale900: colors.greyscale900,
  greyscale800: colors.greyscale800,
  grayscale700: colors.grayscale700,
  grayscale400: colors.grayscale400,
  greyscale300: colors.greyscale300,
  greyscale500: colors.greyscale500,
  grayscale600: colors.grayscale600,
  grayscale200: colors.grayscale200,
  grayscale100: colors.grayscale100,
  transparentPrimary: colors.transparentPrimary,
  transparentSecondary: colors.transparentSecondary,
  transparentTertiary: colors.transparentTertiary,
  transparentRed: colors.transparentRed,
};

export const SIZES = {
  // Global SIZES
  base: 8,
  font: 14,
  radius: 30,
  padding: 8,
  padding2: 12,
  padding3: 16,

  // FONTS Sizes
  largeTitle: 50,
  h1: 36,
  h2: 22,
  h3: 16,
  h4: 14,
  body1: 30,
  body2: 20,
  body3: 16,
  body4: 14,

  // App Dimensions
  width,
  height,
};

export const FONTS = {
  largeTitle: { fontFamily: 'System', fontSize: SIZES.largeTitle, lineHeight: 55, fontWeight: '900' as const },
  h1: { fontFamily: 'System', fontSize: SIZES.h1, lineHeight: 36, fontWeight: '700' as const },
  h2: { fontFamily: 'System', fontSize: SIZES.h2, lineHeight: 30, fontWeight: '700' as const },
  h3: { fontFamily: 'System', fontSize: SIZES.h3, lineHeight: 22, fontWeight: '700' as const },
  h4: { fontFamily: 'System', fontSize: SIZES.h4, lineHeight: 20, fontWeight: '700' as const },
  body1: { fontFamily: 'System', fontSize: SIZES.body1, lineHeight: 36, fontWeight: '400' as const },
  body2: { fontFamily: 'System', fontSize: SIZES.body2, lineHeight: 30, fontWeight: '400' as const },
  body3: { fontFamily: 'System', fontSize: SIZES.body3, lineHeight: 22, fontWeight: '400' as const },
  body4: { fontFamily: 'System', fontSize: SIZES.body4, lineHeight: 20, fontWeight: '400' as const },
};

const appTheme = { COLORS, SIZES, FONTS };

export default appTheme;
