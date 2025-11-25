import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesome5 } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../../shared/store/authStore';
import { useThemeStore } from '../../shared/store/themeStore';
import { useAppTheme } from '../../shared/hooks/useAppTheme';
import { spacing, borderRadius, fontSize, fontWeight, shadows } from '../../shared/constants/theme';
import { GlassCard } from '../../shared/components';

export default function ProfileScreen() {
  const { user, logout } = useAuthStore();
  const { isDark, toggleTheme } = useThemeStore();
  const theme = useAppTheme();
  const router = useRouter();

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          await logout();
          router.replace('/(auth)/login');
        },
      },
    ]);
  };

  const menuItems = [
    {
      id: '1',
      icon: 'user-circle',
      title: 'Edit Profile',
      subtitle: 'Update your personal information',
      color: '#6C5DD3',
    },
    {
      id: '2',
      icon: 'heart',
      title: 'Saved Deals',
      subtitle: 'View your favorite deals',
      color: '#FF6B9D',
    },
    {
      id: '3',
      icon: 'bell',
      title: 'Notifications',
      subtitle: 'Manage your notifications',
      color: '#FFC837',
    },
    {
      id: '4',
      icon: 'cog',
      title: 'Settings',
      subtitle: 'App preferences and settings',
      color: '#10B981',
    },
    {
      id: '5',
      icon: 'question-circle',
      title: 'Help & Support',
      subtitle: 'Get help or contact support',
      color: '#3B82F6',
    },
    {
      id: '6',
      icon: 'shield-alt',
      title: 'Privacy Policy',
      subtitle: 'Read our privacy policy',
      color: '#8B5CF6',
    },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Profile</Text>
        </View>

        {/* Profile Card */}
        <GlassCard style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <FontAwesome5 name="user" size={40} color="#FFFFFF" />
            </View>
            <TouchableOpacity style={styles.editAvatarButton}>
              <FontAwesome5 name="camera" size={14} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          <View style={styles.profileInfo}>
            <Text style={[styles.profileName, { color: theme.colors.text }]}>{user?.name || 'Guest User'}</Text>
            <Text style={[styles.profileEmail, { color: theme.colors.textSecondary }]}>{user?.email || 'guest@exemplo.com'}</Text>
          </View>

          <TouchableOpacity style={styles.editProfileButton}>
            <FontAwesome5 name="edit" size={16} color={theme.colors.primary} />
            <Text style={styles.editProfileText}>Edit</Text>
          </TouchableOpacity>
        </GlassCard>

        {/* Stats */}
        <GlassCard style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: theme.colors.text }]}>24</Text>
            <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>Saved</Text>
          </View>
          <View style={[styles.statDivider, { backgroundColor: theme.colors.border }]} />
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: theme.colors.text }]}>$432</Text>
            <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>Saved Amount</Text>
          </View>
          <View style={[styles.statDivider, { backgroundColor: theme.colors.border }]} />
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: theme.colors.text }]}>15</Text>
            <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>Reviews</Text>
          </View>
        </GlassCard>

        {/* Theme Toggle */}
        <GlassCard style={styles.themeToggle}>
          <View style={[styles.menuIcon, { backgroundColor: isDark ? '#FFD96620' : '#6C5DD320' }]}>
            <FontAwesome5 name={isDark ? 'moon' : 'sun'} size={20} color={isDark ? '#FFD966' : '#6C5DD3'} />
          </View>

          <View style={styles.menuContent}>
            <Text style={[styles.menuTitle, { color: theme.colors.text }]}>Dark Mode</Text>
            <Text style={[styles.menuSubtitle, { color: theme.colors.textSecondary }]}>
              {isDark ? 'Switch to light theme' : 'Switch to dark theme'}
            </Text>
          </View>

          <Switch
            value={isDark}
            onValueChange={toggleTheme}
            trackColor={{ false: '#E9ECEF', true: theme.colors.primary }}
            thumbColor={isDark ? '#FFFFFF' : '#F4F3F4'}
          />
        </GlassCard>

        {/* Menu Items */}
        <View style={styles.menuSection}>
          {menuItems.map((item) => (
            <GlassCard
              key={item.id}
              onPress={() => {}}
              style={styles.menuItem}
            >
              <View style={[styles.menuIcon, { backgroundColor: item.color + '20' }]}>
                <FontAwesome5 name={item.icon as any} size={20} color={item.color} />
              </View>

              <View style={styles.menuContent}>
                <Text style={[styles.menuTitle, { color: theme.colors.text }]}>{item.title}</Text>
                <Text style={[styles.menuSubtitle, { color: theme.colors.textSecondary }]}>{item.subtitle}</Text>
              </View>

              <FontAwesome5 name="chevron-right" size={16} color={theme.colors.textTertiary} />
            </GlassCard>
          ))}
        </View>

        {/* Logout Button */}
        <GlassCard
          onPress={handleLogout}
          style={styles.logoutButton}
        >
          <FontAwesome5 name="sign-out-alt" size={20} color={theme.colors.error} />
          <Text style={[styles.logoutText, { color: theme.colors.error }]}>Logout</Text>
        </GlassCard>

        <Text style={[styles.versionText, { color: theme.colors.textTertiary }]}>Version 1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
  },
  headerTitle: {
    fontSize: fontSize['3xl'],
    fontWeight: fontWeight.bold,
  },
  profileCard: {
    marginHorizontal: spacing.lg,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: spacing.md,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#6C5DD3',
    alignItems: 'center',
    justifyContent: 'center',
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FF6B9D',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  profileInfo: {
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  profileName: {
    fontSize: fontSize['2xl'],
    fontWeight: fontWeight.bold,
    marginBottom: spacing.xs,
  },
  profileEmail: {
    fontSize: fontSize.base,
  },
  editProfileButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#6C5DD310',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    gap: spacing.xs,
  },
  editProfileText: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
    color: '#6C5DD3',
  },
  statsContainer: {
    flexDirection: 'row',
    marginHorizontal: spacing.lg,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: fontSize['2xl'],
    fontWeight: fontWeight.bold,
    marginBottom: spacing.xs,
  },
  statLabel: {
    fontSize: fontSize.xs,
  },
  statDivider: {
    width: 1,
    backgroundColor: '#2D3340',
  },
  themeToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: spacing.lg,
    marginBottom: spacing.lg,
    padding: spacing.md,
  },
  menuSection: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: borderRadius.xl,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  menuIcon: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  menuContent: {
    flex: 1,
  },
  menuTitle: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.semibold,
    marginBottom: spacing.xs,
  },
  menuSubtitle: {
    fontSize: fontSize.sm,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: spacing.lg,
    borderRadius: borderRadius.xl,
    padding: spacing.md,
    marginBottom: spacing.lg,
    gap: spacing.sm,
  },
  logoutText: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.semibold,
  },
  versionText: {
    fontSize: fontSize.xs,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
});
