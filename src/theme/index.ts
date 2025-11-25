// Central theme export
import { colors } from './colors';
import { typography } from './typography';
import { spacing } from './spacing';
import { shadows } from './shadows';
import { glassStyles, blurIntensity } from './glass';

// Re-export everything
export { colors } from './colors';
export { typography } from './typography';
export { spacing } from './spacing';
export { shadows } from './shadows';
export { glassStyles, blurIntensity } from './glass';

export type { ColorName } from './colors';
export type { TypographySize, FontWeight } from './typography';
export type { SpacingSize } from './spacing';
export type { ShadowSize } from './shadows';
export type { GlassStyle } from './glass';

// Theme object
export const theme = {
  colors,
  typography,
  spacing,
  shadows,
  glassStyles,
  blurIntensity,
};

export default theme;
