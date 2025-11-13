import { Dimensions, PixelRatio, Platform } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Base dimensions (iPhone 11 Pro as reference)
const BASE_WIDTH = 375;
const BASE_HEIGHT = 812;

/**
 * Device size categories
 */
export enum DeviceSize {
  SMALL = 'small', // iPhone SE, small Android
  MEDIUM = 'medium', // iPhone 13/14, standard Android
  LARGE = 'large', // iPhone Pro Max, large Android
  TABLET = 'tablet', // iPads, Android tablets
}

/**
 * Get device size category
 */
export const getDeviceSize = (): DeviceSize => {
  if (SCREEN_WIDTH >= 768) {
    return DeviceSize.TABLET;
  } else if (SCREEN_WIDTH >= 414) {
    return DeviceSize.LARGE;
  } else if (SCREEN_WIDTH >= 375) {
    return DeviceSize.MEDIUM;
  } else {
    return DeviceSize.SMALL;
  }
};

/**
 * Scale a value based on screen width
 */
export const scale = (size: number): number => {
  return (SCREEN_WIDTH / BASE_WIDTH) * size;
};

/**
 * Scale vertically based on screen height
 */
export const verticalScale = (size: number): number => {
  return (SCREEN_HEIGHT / BASE_HEIGHT) * size;
};

/**
 * Moderate scale - less aggressive scaling
 */
export const moderateScale = (size: number, factor: number = 0.5): number => {
  return size + (scale(size) - size) * factor;
};

/**
 * Font scale with accessibility support
 */
export const fontScale = (size: number): number => {
  const scaled = scale(size);
  return Math.round(PixelRatio.roundToNearestPixel(scaled));
};

/**
 * Responsive dimensions
 */
export const responsive = {
  // Screen dimensions
  screenWidth: SCREEN_WIDTH,
  screenHeight: SCREEN_HEIGHT,

  // Device info
  deviceSize: getDeviceSize(),
  isSmallDevice: SCREEN_WIDTH < 375,
  isMediumDevice: SCREEN_WIDTH >= 375 && SCREEN_WIDTH < 414,
  isLargeDevice: SCREEN_WIDTH >= 414 && SCREEN_WIDTH < 768,
  isTablet: SCREEN_WIDTH >= 768,

  // Platform
  isIOS: Platform.OS === 'ios',
  isAndroid: Platform.OS === 'android',

  // Spacing
  spacing: {
    xs: scale(4),
    sm: scale(8),
    md: scale(16),
    lg: scale(24),
    xl: scale(32),
    xxl: scale(48),
  },

  // Font sizes
  fontSize: {
    xs: fontScale(10),
    sm: fontScale(12),
    base: fontScale(14),
    md: fontScale(16),
    lg: fontScale(18),
    xl: fontScale(20),
    xxl: fontScale(24),
    xxxl: fontScale(32),
  },

  // Icon sizes
  iconSize: {
    xs: scale(16),
    sm: scale(20),
    md: scale(24),
    lg: scale(32),
    xl: scale(40),
  },

  // Border radius
  borderRadius: {
    xs: scale(4),
    sm: scale(8),
    md: scale(12),
    lg: scale(16),
    xl: scale(20),
    full: scale(9999),
  },

  // Button heights
  buttonHeight: {
    sm: scale(36),
    md: scale(48),
    lg: scale(56),
  },

  // Input heights
  inputHeight: {
    sm: scale(40),
    md: scale(50),
    lg: scale(60),
  },

  // Safe areas (approximate - use SafeAreaView for actual values)
  safeArea: {
    top: Platform.select({ ios: 44, android: 0, default: 0 }),
    bottom: Platform.select({ ios: 34, android: 0, default: 0 }),
  },
};

/**
 * Get responsive padding based on device size
 */
export const getResponsivePadding = (): number => {
  switch (getDeviceSize()) {
    case DeviceSize.SMALL:
      return responsive.spacing.md;
    case DeviceSize.MEDIUM:
      return responsive.spacing.lg;
    case DeviceSize.LARGE:
      return responsive.spacing.lg;
    case DeviceSize.TABLET:
      return responsive.spacing.xl;
    default:
      return responsive.spacing.md;
  }
};

/**
 * Get responsive font size multiplier
 */
export const getFontMultiplier = (): number => {
  switch (getDeviceSize()) {
    case DeviceSize.SMALL:
      return 0.9;
    case DeviceSize.MEDIUM:
      return 1;
    case DeviceSize.LARGE:
      return 1.1;
    case DeviceSize.TABLET:
      return 1.2;
    default:
      return 1;
  }
};

export default responsive;
