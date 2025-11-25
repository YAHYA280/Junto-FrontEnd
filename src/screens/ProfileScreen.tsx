import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { GlassCard, Button, SettingsItem } from '../components';
import { colors, typography, spacing } from '../theme';
import { useAuth } from '../context';

export const ProfileScreen: React.FC = () => {
  const { user, isAuthenticated, roles, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      console.log('Logged out successfully');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={colors.gradients.background}
        style={styles.background}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Profile</Text>

        {!isAuthenticated ? (
          <GlassCard style={styles.card}>
            <Text style={styles.emoji}>👤</Text>
            <Text style={styles.message}>Not logged in</Text>
            <Text style={styles.description}>
              Sign in to access your profile and manage your deals
            </Text>
            <Button
              title="Login"
              onPress={() => console.log('Navigate to login')}
              filled={true}
              style={styles.button}
            />
            <Button
              title="Register"
              onPress={() => console.log('Navigate to register')}
              filled={false}
              style={styles.button}
            />
          </GlassCard>
        ) : (
          <>
            <GlassCard style={styles.card}>
              <Text style={styles.emoji}>👤</Text>
              <Text style={styles.name}>{user?.displayName}</Text>
              {user?.email && (
                <Text style={styles.info}>{user.email}</Text>
              )}
              {user?.phoneE164 && (
                <Text style={styles.info}>{user.phoneE164}</Text>
              )}

              <View style={styles.rolesContainer}>
                <Text style={styles.rolesTitle}>Roles:</Text>
                {roles.map((role) => (
                  <View key={role} style={styles.roleBadge}>
                    <Text style={styles.roleText}>{role}</Text>
                  </View>
                ))}
              </View>

              <View style={styles.statsRow}>
                <View style={styles.stat}>
                  <Text style={styles.statValue}>
                    {user?.ratingAvg || '0.00'}
                  </Text>
                  <Text style={styles.statLabel}>Rating</Text>
                </View>
                <View style={styles.stat}>
                  <Text style={styles.statValue}>
                    {user?.ratingCount || 0}
                  </Text>
                  <Text style={styles.statLabel}>Reviews</Text>
                </View>
                <View style={styles.stat}>
                  <Text style={styles.statValue}>
                    {user?.isVerified ? '✓' : '✗'}
                  </Text>
                  <Text style={styles.statLabel}>Verified</Text>
                </View>
              </View>
            </GlassCard>

            <GlassCard style={styles.menuCard}>
              <SettingsItem
                icon="person-outline"
                name="Edit Profile"
                onPress={() => console.log('Edit profile')}
              />
              <SettingsItem
                icon="notifications-outline"
                name="Notifications"
                onPress={() => console.log('Notifications')}
              />
              <SettingsItem
                icon="shield-outline"
                name="Security"
                onPress={() => console.log('Security')}
              />
              <SettingsItem
                icon="help-circle-outline"
                name="Help & Support"
                onPress={() => console.log('Help')}
              />
            </GlassCard>

            <Button
              title="Logout"
              onPress={handleLogout}
              filled={false}
              style={styles.logoutButton}
            />
          </>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  content: {
    padding: spacing.lg,
    paddingTop: spacing.xxxl,
  },
  title: {
    fontSize: typography.sizes.xxxl,
    fontWeight: typography.fontWeights.bold,
    color: colors.text.primary,
    marginBottom: spacing.xl,
  },
  card: {
    padding: spacing.xl,
    alignItems: 'center',
    marginBottom: spacing.base,
  },
  emoji: {
    fontSize: 64,
    marginBottom: spacing.lg,
  },
  name: {
    fontSize: typography.sizes.xxl,
    fontWeight: typography.fontWeights.bold,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  info: {
    fontSize: typography.sizes.md,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
  },
  message: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.fontWeights.bold,
    color: colors.text.primary,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  description: {
    fontSize: typography.sizes.md,
    color: colors.text.tertiary,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  rolesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.lg,
    flexWrap: 'wrap',
  },
  rolesTitle: {
    fontSize: typography.sizes.sm,
    color: colors.text.tertiary,
    marginRight: spacing.sm,
  },
  roleBadge: {
    backgroundColor: colors.glass.primary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: 12,
    marginLeft: spacing.xs,
  },
  roleText: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.fontWeights.semibold,
    color: colors.text.primary,
  },
  statsRow: {
    flexDirection: 'row',
    marginTop: spacing.xl,
    gap: spacing.xl,
  },
  stat: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: typography.sizes.xxl,
    fontWeight: typography.fontWeights.bold,
    color: colors.lightBlue,
    marginBottom: spacing.xs,
  },
  statLabel: {
    fontSize: typography.sizes.sm,
    color: colors.text.tertiary,
  },
  button: {
    width: '100%',
    marginTop: spacing.md,
  },
  logoutButton: {
    marginTop: spacing.lg,
  },
  menuCard: {
    padding: spacing.lg,
    marginTop: spacing.lg,
  },
});
