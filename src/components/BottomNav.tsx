import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import { colors, typography, spacing, glassStyles, shadows } from '../theme';

export type NavRoute = 'Home' | 'Categories' | 'AddDeal' | 'Profile';

interface NavItem {
  route: NavRoute;
  label: string;
  icon: string;
}

const navItems: NavItem[] = [
  { route: 'Home', label: 'Home', icon: '🏠' },
  { route: 'Categories', label: 'Categories', icon: '📱' },
  { route: 'AddDeal', label: 'Add Deal', icon: '➕' },
  { route: 'Profile', label: 'Profile', icon: '👤' },
];

interface BottomNavProps {
  activeRoute: NavRoute;
  onRouteChange: (route: NavRoute) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeRoute,
  onRouteChange,
}) => {
  return (
    <View style={styles.container}>
      <BlurView intensity={80} tint="dark" style={[glassStyles.floating, styles.nav]}>
        {navItems.map((item) => (
          <TouchableOpacity
            key={item.route}
            onPress={() => onRouteChange(item.route)}
            style={styles.navItem}
            activeOpacity={0.7}
          >
            <View
              style={[
                styles.iconContainer,
                activeRoute === item.route && styles.activeIconContainer,
              ]}
            >
              <Text style={styles.icon}>{item.icon}</Text>
            </View>
            <Text
              style={[
                styles.label,
                activeRoute === item.route && styles.activeLabel,
              ]}
            >
              {item.label}
            </Text>
            {activeRoute === item.route && <View style={styles.activeDot} />}
          </TouchableOpacity>
        ))}
      </BlurView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? spacing.xl : spacing.lg,
    left: spacing.lg,
    right: spacing.lg,
    zIndex: 100,
  },
  nav: {
    flexDirection: 'row',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
    ...shadows.glassStrong,
    borderRadius: 24,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.sm,
  },
  iconContainer: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    backgroundColor: colors.glass.subtle,
    marginBottom: spacing.xs,
  },
  activeIconContainer: {
    backgroundColor: colors.primary,
    borderWidth: 0,
    shadowColor: colors.primary,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  icon: {
    fontSize: typography.sizes.lg,
  },
  label: {
    fontSize: typography.sizes.xs,
    color: colors.text.tertiary,
    fontWeight: typography.fontWeights.medium,
  },
  activeLabel: {
    color: colors.text.primary,
    fontWeight: typography.fontWeights.bold,
  },
  activeDot: {
    position: 'absolute',
    bottom: 0,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.primary,
  },
});
