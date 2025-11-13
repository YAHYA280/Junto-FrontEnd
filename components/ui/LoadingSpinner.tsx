import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { responsive } from '../../utils/responsive/responsive';

interface LoadingSpinnerProps {
  size?: 'small' | 'large';
  message?: string;
  fullScreen?: boolean;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'large',
  message,
  fullScreen = false,
}) => {
  const { colors } = useTheme();

  const containerStyle = fullScreen
    ? styles.fullScreenContainer
    : styles.container;

  return (
    <View style={[containerStyle, { backgroundColor: fullScreen ? colors.background : 'transparent' }]}>
      <ActivityIndicator size={size} color={colors.primary} />
      {message && (
        <Text style={[styles.message, { color: colors.textSecondary }]}>
          {message}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: responsive.spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullScreenContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  message: {
    marginTop: responsive.spacing.md,
    fontSize: responsive.fontSize.base,
    textAlign: 'center',
  },
});
