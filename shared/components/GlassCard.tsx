import React from 'react';
import { View, StyleSheet, ViewStyle, TouchableOpacity } from 'react-native';
import { BlurView } from 'expo-blur';
import { GlareHover } from './GlareHover';
import { borderRadius, spacing, shadows } from '../constants/theme';
import { useAppTheme } from '../hooks/useAppTheme';

interface GlassCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  onPress?: () => void;
  glareEffect?: boolean;
  variant?: 'default' | 'elevated' | 'outlined';
  intensity?: number;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  style,
  onPress,
  glareEffect = true,
  variant = 'default',
  intensity = 20,
}) => {
  const theme = useAppTheme();
  const isDark = theme.mode === 'dark';

  const cardStyles = [
    styles.card,
    {
      backgroundColor: isDark
        ? 'rgba(26, 31, 46, 0.7)'
        : 'rgba(255, 255, 255, 0.7)',
      borderColor: isDark
        ? 'rgba(255, 255, 255, 0.1)'
        : theme.colors.border,
    },
    variant === 'elevated' && styles.elevated,
    variant === 'outlined' && {
      borderWidth: 2,
      borderColor: theme.colors.primary + '30',
    },
    style,
  ];

  const CardContent = (
    <View style={[styles.container, style]}>
      <BlurView
        intensity={intensity}
        tint={isDark ? 'dark' : 'light'}
        style={StyleSheet.absoluteFill}
      />
      <View style={cardStyles}>
        {children}
      </View>
    </View>
  );

  if (onPress) {
    return (
      <GlareHover
        glareColor={isDark ? '#ffffff' : '#ffffff'}
        glareOpacity={isDark ? 0.2 : 0.3}
        glareSize={250}
        transitionDuration={800}
        disabled={!glareEffect}
      >
        <TouchableOpacity
          style={styles.touchable}
          onPress={onPress}
          activeOpacity={0.9}
        >
          {CardContent}
        </TouchableOpacity>
      </GlareHover>
    );
  }

  if (glareEffect) {
    return (
      <GlareHover
        glareColor={isDark ? '#ffffff' : '#ffffff'}
        glareOpacity={isDark ? 0.2 : 0.3}
        glareSize={250}
        transitionDuration={800}
      >
        {CardContent}
      </GlareHover>
    );
  }

  return CardContent;
};

const styles = StyleSheet.create({
  container: {
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
  },
  card: {
    borderRadius: borderRadius.xl,
    padding: spacing.md,
    ...shadows.md,
    borderWidth: 1,
  },
  elevated: {
    ...shadows.lg,
  },
  touchable: {
    width: '100%',
  },
});
