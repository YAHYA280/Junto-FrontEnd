import React from 'react';
import { Text, StyleSheet, ViewStyle, TextStyle, TouchableOpacity, ActivityIndicator } from 'react-native';
import { GlareHover } from './GlareHover';
import { borderRadius, fontSize, fontWeight, shadows } from '../constants/theme';
import { useAppTheme } from '../hooks/useAppTheme';

interface GlassButtonProps {
  title: string;
  onPress: () => void;
  style?: ViewStyle;
  textStyle?: TextStyle;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  glareEffect?: boolean;
}

export const GlassButton: React.FC<GlassButtonProps> = ({
  title,
  onPress,
  style,
  textStyle,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  icon,
  glareEffect = true,
}) => {
  const theme = useAppTheme();

  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return { backgroundColor: theme.colors.primary };
      case 'secondary':
        return { backgroundColor: theme.colors.secondary };
      case 'outline':
        return {
          backgroundColor: 'transparent',
          borderWidth: 2,
          borderColor: theme.colors.primary,
        };
      case 'ghost':
        return { backgroundColor: theme.colors.backgroundSecondary };
      default:
        return { backgroundColor: theme.colors.primary };
    }
  };

  const buttonStyles = [
    styles.button,
    getVariantStyles(),
    styles[size],
    disabled && styles.disabled,
    style,
  ];

  const textStyles = [
    styles.text,
    { color: variant === 'outline' || variant === 'ghost' ? theme.colors.text : '#FFFFFF' },
    styles[`${size}Text`],
    disabled && styles.disabledText,
    textStyle,
  ];

  const ButtonContent = (
    <TouchableOpacity
      style={buttonStyles}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === 'primary' || variant === 'secondary' ? '#FFFFFF' : theme.colors.primary}
          size="small"
        />
      ) : (
        <>
          {icon}
          <Text style={textStyles}>{title}</Text>
        </>
      )}
    </TouchableOpacity>
  );

  if (glareEffect && !disabled && !loading) {
    return (
      <GlareHover
        glareColor="#ffffff"
        glareOpacity={variant === 'primary' ? 0.4 : 0.3}
        glareSize={200}
        transitionDuration={600}
      >
        {ButtonContent}
      </GlareHover>
    );
  }

  return ButtonContent;
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: borderRadius.md,
    ...shadows.md,
    gap: 8,
  },
  // Sizes
  small: {
    height: 40,
    paddingHorizontal: 16,
  },
  medium: {
    height: 52,
    paddingHorizontal: 24,
  },
  large: {
    height: 60,
    paddingHorizontal: 32,
  },
  // States
  disabled: {
    opacity: 0.5,
  },
  // Text
  text: {
    fontWeight: fontWeight.bold,
  },
  smallText: {
    fontSize: fontSize.sm,
  },
  mediumText: {
    fontSize: fontSize.base,
  },
  largeText: {
    fontSize: fontSize.lg,
  },
  disabledText: {
    opacity: 0.7,
  },
});
