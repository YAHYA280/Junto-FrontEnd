import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { useTheme } from '../../contexts/ThemeContext';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  isPassword?: boolean;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  leftIcon,
  rightIcon,
  isPassword = false,
  style,
  ...props
}) => {
  const { colors, isDark } = useTheme();
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const inputContainerStyle: ViewStyle = {
    borderWidth: isFocused ? 2 : 1,
    borderColor: error
      ? colors.error + '99'
      : isFocused
        ? colors.primary + '99'
        : colors.glassBorder,
    backgroundColor: colors.glassBackgroundLight,
  };

  return (
    <View style={styles.container}>
      {label && <Text style={[styles.label, { color: colors.text }]}>{label}</Text>}
      <View style={[styles.inputContainer, inputContainerStyle]}>
        <BlurView intensity={isDark ? 30 : 20} tint={isDark ? 'dark' : 'light'} style={styles.blurContainer}>
          <View style={styles.inputWrapper}>
            {leftIcon && <View style={styles.iconLeft}>{leftIcon}</View>}
            <TextInput
              style={[styles.input, { color: colors.text }, leftIcon && styles.inputWithLeftIcon, style]}
              placeholderTextColor={colors.textTertiary}
              secureTextEntry={isPassword && !showPassword}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              {...props}
            />
            {isPassword && (
              <TouchableOpacity
                style={styles.iconRight}
                onPress={() => setShowPassword(!showPassword)}
              >
                <Text style={styles.eyeIcon}>{showPassword ? '👁️' : '👁️‍🗨️'}</Text>
              </TouchableOpacity>
            )}
            {rightIcon && !isPassword && <View style={styles.iconRight}>{rightIcon}</View>}
          </View>
        </BlurView>
      </View>
      {error && <Text style={[styles.errorText, { color: colors.error }]}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    marginLeft: 4,
  },
  inputContainer: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  blurContainer: {
    overflow: 'hidden',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    height: 50,
  },
  input: {
    flex: 1,
    fontSize: 16,
  },
  inputWithLeftIcon: {
    marginLeft: 8,
  },
  iconLeft: {
    marginRight: 8,
  },
  iconRight: {
    marginLeft: 8,
  },
  eyeIcon: {
    fontSize: 20,
  },
  errorText: {
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
});
