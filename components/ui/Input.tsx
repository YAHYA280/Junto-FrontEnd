import React, { useState } from 'react';
import {
  StyleSheet,
  TextInput,
  TextInputProps,
  TouchableOpacity,
  View,
  ViewStyle,
  Text,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { useTheme } from '../../contexts/ThemeContext';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  leftIcon?: string;
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
      ? colors.error
      : isFocused
        ? colors.primary
        : isDark ? colors.border : '#D1D5DB',
    backgroundColor: isDark ? colors.surface : '#FFFFFF',
    shadowColor: error
      ? colors.error
      : isFocused
        ? colors.primary
        : '#000000',
    shadowOffset: { width: 0, height: isFocused ? 3 : 2 },
    shadowOpacity: isDark ? (isFocused ? 0.3 : 0.2) : (isFocused ? 0.15 : 0.08),
    shadowRadius: isFocused ? 6 : 4,
    elevation: isFocused ? 4 : 2,
  };

  return (
    <View style={styles.container}>
      {label && <Text style={[styles.label, { color: colors.text }]}>{label}</Text>}
      <View style={[styles.inputContainer, inputContainerStyle]}>
        <BlurView intensity={isDark ? 30 : 20} tint={isDark ? 'dark' : 'light'} style={styles.blurContainer}>
          <View style={[styles.inputWrapper, props.multiline && styles.inputWrapperMultiline]}>
            {leftIcon && (
              <View style={styles.iconLeft}>
                <Ionicons name={leftIcon as any} size={20} color={colors.textTertiary} />
              </View>
            )}
            <TextInput
              style={[
                styles.input,
                { color: colors.text },
                leftIcon && styles.inputWithLeftIcon,
                props.multiline && styles.inputMultiline,
                style
              ]}
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
                activeOpacity={0.7}
              >
                <Ionicons
                  name={showPassword ? 'eye' : 'eye-off'}
                  size={20}
                  color={colors.textTertiary}
                />
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
  inputWrapperMultiline: {
    height: 'auto',
    minHeight: 100,
    alignItems: 'flex-start',
    paddingVertical: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
  },
  inputMultiline: {
    minHeight: 80,
    textAlignVertical: 'top',
    paddingTop: 0,
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
  errorText: {
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
});
