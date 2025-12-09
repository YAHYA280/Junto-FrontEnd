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
    const baseShadow = isDark
      ? {
          shadowColor: '#000000',
          shadowOpacity: 0.4,
        }
      : {
          shadowColor: '#000000',
          shadowOpacity: 0.12,
        };

    switch (variant) {
      case 'elevated':
        return {
          backgroundColor: isDark ? colors.surface : '#FFFFFF',
          borderWidth: 1,
          borderColor: isDark ? colors.border : '#E5E7EB',
          ...baseShadow,
          shadowOffset: { width: 0, height: 4 },
          shadowRadius: 12,
          elevation: 8,
        };
      case 'outlined':
        return {
          backgroundColor: isDark ? colors.surface : '#FFFFFF',
          borderWidth: 2,
          borderColor: colors.primary,
          ...baseShadow,
          shadowOffset: { width: 0, height: 2 },
          shadowRadius: 8,
          elevation: 4,
        };
      default:
        return {
          backgroundColor: isDark ? colors.surface : '#FFFFFF',
          borderWidth: 1,
          borderColor: isDark ? colors.border : '#E5E7EB',
          ...baseShadow,
          shadowOffset: { width: 0, height: 2 },
          shadowRadius: 8,
          elevation: 4,
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
