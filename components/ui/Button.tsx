import React from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
  ViewStyle,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { useTheme } from '../../contexts/ThemeContext';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: 'primary' | 'secondary' | 'outline';
  loading?: boolean;
  size?: 'small' | 'medium' | 'large';
}

export const Button: React.FC<ButtonProps> = ({
  title,
  variant = 'primary',
  loading = false,
  size = 'medium',
  disabled,
  style,
  ...props
}) => {
  const { colors, isDark } = useTheme();

  const buttonStyles: ViewStyle[] = [
    styles.button,
    styles[`button${size.charAt(0).toUpperCase() + size.slice(1)}` as keyof typeof styles],
  ];

  const getVariantStyles = (): ViewStyle => {
    switch (variant) {
      case 'primary':
        return {
          backgroundColor: colors.primary,
          shadowColor: colors.primary,
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.4,
          shadowRadius: 12,
          elevation: 8,
        };
      case 'secondary':
        return {
          backgroundColor: colors.accent,
          shadowColor: colors.accent,
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.4,
          shadowRadius: 12,
          elevation: 8,
        };
      case 'outline':
        return {
          backgroundColor: colors.glassBackgroundLight,
          borderWidth: 2,
          borderColor: colors.primary,
          shadowColor: colors.shadow,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.2,
          shadowRadius: 8,
          elevation: 4,
        };
      default:
        return {
          backgroundColor: colors.primary,
          shadowColor: colors.primary,
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.4,
          shadowRadius: 12,
          elevation: 8,
        };
    }
  };

  const getTextColor = () => {
    return variant === 'outline' ? colors.primary : colors.textInverse;
  };

  const getLoaderColor = () => {
    return variant === 'outline' ? colors.primary : colors.textInverse;
  };

  return (
    <TouchableOpacity
      style={[...buttonStyles, getVariantStyles(), disabled && styles.disabled, style]}
      disabled={disabled || loading}
      activeOpacity={0.8}
      {...props}
    >
      <View style={styles.contentContainer}>
        {loading ? (
          <ActivityIndicator color={getLoaderColor()} />
        ) : (
          <Text style={[
            styles.text,
            { color: getTextColor() },
            styles[`text${size.charAt(0).toUpperCase() + size.slice(1)}` as keyof typeof styles]
          ]}>
            {title}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 16,
    overflow: 'visible',
  },
  buttonSmall: {
    height: 36,
    paddingHorizontal: 16,
  },
  buttonMedium: {
    height: 48,
    paddingHorizontal: 24,
  },
  buttonLarge: {
    height: 56,
    paddingHorizontal: 32,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabled: {
    opacity: 0.5,
  },
  text: {
    fontWeight: '600',
  },
  textSmall: {
    fontSize: 14,
  },
  textMedium: {
    fontSize: 16,
  },
  textLarge: {
    fontSize: 18,
  },
});
