import React from 'react';
import { View, Text, StyleSheet, TextInput, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, typography, spacing, shadows } from '../theme';

interface GlassHeaderProps {
  title?: string;
  showSearch?: boolean;
  onSearchChange?: (text: string) => void;
  searchPlaceholder?: string;
  rightComponent?: React.ReactNode;
}

export const GlassHeader: React.FC<GlassHeaderProps> = ({
  title = 'NexTrip Deals',
  showSearch = false,
  onSearchChange,
  searchPlaceholder = 'Search deals...',
  rightComponent,
}) => {
  return (
    <View style={styles.container}>
      <BlurView intensity={60} tint="dark" style={styles.blur}>
        <LinearGradient
          colors={[colors.glass.dark, colors.glass.primary]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradient}
        >
          <View style={styles.content}>
            <View style={styles.topRow}>
              <Text style={styles.title}>{title}</Text>
              {rightComponent && <View style={styles.rightComponent}>{rightComponent}</View>}
            </View>

            {showSearch && (
              <View style={styles.searchContainer}>
                <BlurView intensity={40} tint="dark" style={styles.searchBlur}>
                  <TextInput
                    style={styles.searchInput}
                    placeholder={searchPlaceholder}
                    placeholderTextColor={colors.text.tertiary}
                    onChangeText={onSearchChange}
                  />
                </BlurView>
              </View>
            )}
          </View>
        </LinearGradient>
      </BlurView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    ...shadows.glassStrong,
  },
  blur: {
    overflow: 'hidden',
  },
  gradient: {
    paddingTop: Platform.OS === 'ios' ? 50 : spacing.lg,
    paddingBottom: spacing.base,
  },
  content: {
    paddingHorizontal: spacing.lg,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  title: {
    fontSize: typography.sizes.xxl,
    fontWeight: typography.fontWeights.bold,
    color: colors.text.primary,
    letterSpacing: 0.5,
  },
  rightComponent: {
    marginLeft: spacing.md,
  },
  searchContainer: {
    marginTop: spacing.sm,
  },
  searchBlur: {
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.glass.light,
  },
  searchInput: {
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.md,
    fontSize: typography.sizes.md,
    color: colors.text.primary,
  },
});
