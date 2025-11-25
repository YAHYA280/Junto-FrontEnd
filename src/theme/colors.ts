// Enhanced Color Palette - JuntoGo with Learnify Design System
export const colors = {
  // Primary Colors (Learnify-enhanced)
  primary: '#335EF7',           // Learnify primary blue
  secondary: '#FFD300',         // Learnify secondary yellow
  tertiary: '#6C4DDA',          // Learnify tertiary purple

  // JuntoGo original colors (kept for compatibility)
  darkBlue: '#06283D',          // Deep background
  primaryBlue: '#1363DF',       // Primary actions
  lightBlue: '#47B5FF',         // Secondary/highlights
  paleBlue: '#DFF6FF',          // Accents/text on dark

  // Glassmorphism overlays with transparency
  glass: {
    dark: 'rgba(6, 40, 61, 0.7)',       // #06283D with 70% opacity
    primary: 'rgba(19, 99, 223, 0.6)',  // #1363DF with 60% opacity
    light: 'rgba(71, 181, 255, 0.5)',   // #47B5FF with 50% opacity
    pale: 'rgba(223, 246, 255, 0.9)',   // #DFF6FF with 90% opacity
    subtle: 'rgba(71, 181, 255, 0.15)', // Very light overlay
    medium: 'rgba(19, 99, 223, 0.3)',   // Medium overlay
  },

  // Transparent variants (Learnify)
  transparentPrimary: 'rgba(51, 94, 247, 0.08)',
  transparentSecondary: 'rgba(108, 77, 218, 0.15)',
  transparentTertiary: 'rgba(51, 94, 247, 0.1)',
  transparentRed: 'rgba(255, 62, 61, 0.15)',

  // Gradients
  gradients: {
    background: ['#06283D', '#1363DF'],
    card: ['rgba(19, 99, 223, 0.2)', 'rgba(71, 181, 255, 0.1)'],
    button: ['#1363DF', '#47B5FF'],
    shimmer: ['transparent', 'rgba(223, 246, 255, 0.3)', 'transparent'],
  },

  // Semantic colors (Learnify-enhanced)
  success: '#0ABE75',
  warning: '#FACC15',
  error: '#F75555',
  info: '#246BFD',

  // Neutral colors (Learnify)
  black: '#181A20',
  black2: '#1D272F',
  white: '#FFFFFF',
  secondaryWhite: '#F8F8F8',
  tertiaryWhite: '#F7F7F7',

  // Gray scale (Learnify)
  gray: '#9E9E9E',
  gray2: '#35383F',
  gray3: '#9E9E9E',
  greyscale900: '#212121',
  greyscale800: '#424242',
  grayscale700: '#616161',
  grayscale600: '#757575',
  greyscale500: '#FAFAFA',
  grayscale400: '#BDBDBD',
  greyscale300: '#E0E0E0',
  grayscale200: '#EEEEEE',
  grayscale100: '#F5F5F5',

  // Dark mode colors (Learnify)
  dark1: '#000000',
  dark2: '#1F222A',
  dark3: '#35383F',

  // Text colors
  text: {
    primary: '#DFF6FF',
    secondary: '#47B5FF',
    tertiary: 'rgba(223, 246, 255, 0.7)',
    dark: '#06283D',
  },

  // Status colors with glass effect
  status: {
    hot: 'rgba(244, 67, 54, 0.8)',      // Red for hot deals
    transport: 'rgba(33, 150, 243, 0.8)', // Blue for transport
    realEstate: 'rgba(76, 175, 80, 0.8)', // Green for real estate
  },

  // Transparent for overlays
  transparent: 'transparent',
};

export type ColorName = keyof typeof colors;
