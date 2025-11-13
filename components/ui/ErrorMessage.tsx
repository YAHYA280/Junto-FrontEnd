import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { useTheme } from '../../contexts/ThemeContext';
import { responsive } from '../../utils/responsive/responsive';

interface ErrorMessageProps {
  message: string;
  onDismiss?: () => void;
  retryAction?: () => void;
  retryText?: string;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  message,
  onDismiss,
  retryAction,
  retryText = 'Try Again',
}) => {
  const { colors, isDark } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.error + '22' }]}>
      <BlurView
        intensity={isDark ? 30 : 20}
        tint={isDark ? 'dark' : 'light'}
        style={styles.blurContainer}
      >
        <View style={[styles.content, { borderColor: colors.error + '44' }]}>
          <View style={styles.iconContainer}>
            <Ionicons name="alert-circle" size={24} color={colors.error} />
          </View>

          <View style={styles.textContainer}>
            <Text style={[styles.message, { color: colors.error }]}>
              {message}
            </Text>
          </View>

          <View style={styles.actions}>
            {retryAction && (
              <TouchableOpacity
                style={[styles.actionButton, { backgroundColor: colors.error + '33' }]}
                onPress={retryAction}
                activeOpacity={0.7}
              >
                <Text style={[styles.actionText, { color: colors.error }]}>
                  {retryText}
                </Text>
              </TouchableOpacity>
            )}

            {onDismiss && (
              <TouchableOpacity
                style={styles.dismissButton}
                onPress={onDismiss}
                activeOpacity={0.7}
              >
                <Ionicons name="close" size={20} color={colors.error} />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </BlurView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: responsive.borderRadius.md,
    overflow: 'hidden',
    marginVertical: responsive.spacing.sm,
  },
  blurContainer: {
    overflow: 'hidden',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: responsive.spacing.md,
    borderWidth: 1,
  },
  iconContainer: {
    marginRight: responsive.spacing.md,
  },
  textContainer: {
    flex: 1,
  },
  message: {
    fontSize: responsive.fontSize.base,
    fontWeight: '500',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: responsive.spacing.sm,
  },
  actionButton: {
    paddingHorizontal: responsive.spacing.md,
    paddingVertical: responsive.spacing.sm,
    borderRadius: responsive.borderRadius.sm,
  },
  actionText: {
    fontSize: responsive.fontSize.sm,
    fontWeight: '600',
  },
  dismissButton: {
    padding: responsive.spacing.xs,
  },
});
