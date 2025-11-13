import React from 'react';
import { StyleSheet, View, ViewProps, ViewStyle } from 'react-native';
import { BlurView } from 'expo-blur';
import { useTheme } from '../../contexts/ThemeContext';

interface CardProps extends ViewProps {
  children: React.ReactNode;
  variant?: 'default' | 'elevated' | 'outlined';
  blurIntensity?: number;
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  blurIntensity,
  style,
  ...props
}) => {
  const { colors, isDark } = useTheme();

  const defaultBlurIntensity = blurIntensity || (isDark ? 40 : 30);

  const getVariantStyles = (): ViewStyle => {
    switch (variant) {
      case 'elevated':
        return {
          backgroundColor: colors.glassBackground,
          borderWidth: 1,
          borderColor: colors.glassBorder,
          shadowColor: colors.shadow,
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.2,
          shadowRadius: 16,
          elevation: 8,
        };
      case 'outlined':
        return {
          backgroundColor: colors.glassBackgroundLight,
          borderWidth: 2,
          borderColor: colors.primary + '66',
          shadowColor: colors.primary,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.15,
          shadowRadius: 8,
          elevation: 3,
        };
      default:
        return {
          backgroundColor: colors.glassBackground,
          borderWidth: 1,
          borderColor: colors.glassBorder,
          shadowColor: colors.shadow,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 3,
        };
    }
  };

  return (
    <View style={[styles.container, getVariantStyles(), style]} {...props}>
      <BlurView intensity={defaultBlurIntensity} tint={isDark ? 'dark' : 'light'} style={styles.blurContainer}>
        <View style={styles.content}>{children}</View>
      </BlurView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  blurContainer: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
});
