import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Card, AnimatedView } from '../../components/ui';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuthStore } from '../../store/authStore';
import { responsive } from '../../utils/responsive/responsive';
import { UserRole } from '../../shared/types/user';

export const ProfileScreen: React.FC = () => {
  const router = useRouter();
  const { colors } = useTheme();
  const { user, logout } = useAuthStore();

  const handleLogout = async () => {
    console.log('[ProfileScreen] Logging out...');
    try {
      await logout();
      console.log('[ProfileScreen] Logout successful, navigating to auth...');
      router.replace('/(auth)');
    } catch (error) {
      console.error('[ProfileScreen] Logout error:', error);
    }
  };

  const getRoleDisplay = (role: UserRole) => {
    return role === UserRole.SELLER ? 'Seller' : 'Buyer';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (!user) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={[styles.errorText, { color: colors.error }]}>
          No user data available
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <AnimatedView animation="fade" duration={500}>
          <View style={styles.header}>
            <Text style={[styles.title, { color: colors.text }]}>Profile</Text>
          </View>
        </AnimatedView>

        {/* User Info Card */}
        <AnimatedView animation="scale" delay={100} duration={500}>
          <Card variant="elevated" style={styles.userCard}>
            {/* Avatar */}
            <View style={styles.avatarContainer}>
              {user.avatarUrl ? (
                <Image
                  source={{ uri: user.avatarUrl }}
                  style={styles.avatar}
                />
              ) : (
                <View
                  style={[
                    styles.avatarPlaceholder,
                    { backgroundColor: colors.primary },
                  ]}
                >
                  <Text style={styles.avatarText}>
                    {user.displayName.charAt(0).toUpperCase()}
                  </Text>
                </View>
              )}

              {/* Verification Badge */}
              {user.isVerified && (
                <View
                  style={[
                    styles.verifiedBadge,
                    { backgroundColor: colors.success },
                  ]}
                >
                  <Ionicons name="checkmark" size={16} color="#fff" />
                </View>
              )}
            </View>

            {/* Display Name */}
            <Text style={[styles.displayName, { color: colors.text }]}>
              {user.displayName}
            </Text>

            {/* Contact Info */}
            <View style={styles.contactInfo}>
              {user.email && (
                <View style={styles.infoRow}>
                  <Ionicons
                    name="mail-outline"
                    size={18}
                    color={colors.textSecondary}
                  />
                  <Text style={[styles.infoText, { color: colors.textSecondary }]}>
                    {user.email}
                  </Text>
                </View>
              )}

              {user.phoneE164 && (
                <View style={styles.infoRow}>
                  <Ionicons
                    name="call-outline"
                    size={18}
                    color={colors.textSecondary}
                  />
                  <Text style={[styles.infoText, { color: colors.textSecondary }]}>
                    {user.phoneE164}
                  </Text>
                </View>
              )}
            </View>

            {/* Rating */}
            {user.ratingAvg !== undefined && user.ratingCount !== undefined && (
              <View
                style={[
                  styles.ratingContainer,
                  {
                    backgroundColor: colors.glassBackgroundLight,
                    borderColor: colors.glassBorder,
                  },
                ]}
              >
                {/* Render Stars */}
                <View style={styles.starsRow}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Ionicons
                      key={star}
                      name={star <= Math.round(user.ratingAvg || 0) ? 'star' : 'star-outline'}
                      size={18}
                      color={star <= Math.round(user.ratingAvg || 0) ? colors.warning : colors.textTertiary}
                    />
                  ))}
                </View>
                <Text style={[styles.ratingText, { color: colors.text }]}>
                  {user.ratingAvg.toFixed(1)} ({user.ratingCount} {user.ratingCount === 1 ? 'review' : 'reviews'})
                </Text>
              </View>
            )}

            {/* Roles */}
            <View style={styles.rolesContainer}>
              {user.roles.map((role) => (
                <View
                  key={role}
                  style={[
                    styles.roleBadge,
                    { backgroundColor: colors.primary + '22' },
                  ]}
                >
                  <Text style={[styles.roleText, { color: colors.primary }]}>
                    {getRoleDisplay(role)}
                  </Text>
                </View>
              ))}
            </View>

            {/* Member Since */}
            <View style={styles.memberSince}>
              <Text style={[styles.memberSinceText, { color: colors.textTertiary }]}>
                Member since {formatDate(user.createdAt)}
              </Text>
            </View>
          </Card>
        </AnimatedView>

        {/* Account Actions */}
        <AnimatedView animation="slideUp" delay={200} duration={500}>
          <Card variant="elevated" style={styles.actionsCard}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Account
            </Text>

            {/* Edit Profile */}
            <TouchableOpacity
              style={[
                styles.actionItem,
                { borderBottomColor: colors.border },
              ]}
              onPress={() => {
                console.log('[ProfileScreen] Navigating to edit profile...');
                router.push('/(tabs)/edit-profile');
              }}
              activeOpacity={0.7}
            >
              <View style={styles.actionLeft}>
                <View
                  style={[
                    styles.actionIconContainer,
                    { backgroundColor: colors.primary + '22' },
                  ]}
                >
                  <Ionicons
                    name="person-outline"
                    size={20}
                    color={colors.primary}
                  />
                </View>
                <Text style={[styles.actionText, { color: colors.text }]}>
                  Edit Profile
                </Text>
              </View>
              <Ionicons
                name="chevron-forward"
                size={20}
                color={colors.textSecondary}
              />
            </TouchableOpacity>

            {/* Change Password */}
            <TouchableOpacity
              style={[
                styles.actionItem,
                { borderBottomColor: colors.border },
              ]}
              activeOpacity={0.7}
            >
              <View style={styles.actionLeft}>
                <View
                  style={[
                    styles.actionIconContainer,
                    { backgroundColor: colors.primary + '22' },
                  ]}
                >
                  <Ionicons
                    name="lock-closed-outline"
                    size={20}
                    color={colors.primary}
                  />
                </View>
                <Text style={[styles.actionText, { color: colors.text }]}>
                  Change Password
                </Text>
              </View>
              <Ionicons
                name="chevron-forward"
                size={20}
                color={colors.textSecondary}
              />
            </TouchableOpacity>

            {/* Notifications */}
            <TouchableOpacity
              style={styles.actionItem}
              activeOpacity={0.7}
            >
              <View style={styles.actionLeft}>
                <View
                  style={[
                    styles.actionIconContainer,
                    { backgroundColor: colors.primary + '22' },
                  ]}
                >
                  <Ionicons
                    name="notifications-outline"
                    size={20}
                    color={colors.primary}
                  />
                </View>
                <Text style={[styles.actionText, { color: colors.text }]}>
                  Notifications
                </Text>
              </View>
              <Ionicons
                name="chevron-forward"
                size={20}
                color={colors.textSecondary}
              />
            </TouchableOpacity>
          </Card>
        </AnimatedView>

        {/* App Settings */}
        <AnimatedView animation="slideUp" delay={250} duration={500}>
          <Card variant="elevated" style={styles.actionsCard}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Settings
            </Text>

            {/* Privacy & Security */}
            <TouchableOpacity
              style={[
                styles.actionItem,
                { borderBottomColor: colors.border },
              ]}
              activeOpacity={0.7}
            >
              <View style={styles.actionLeft}>
                <View
                  style={[
                    styles.actionIconContainer,
                    { backgroundColor: colors.accent + '22' },
                  ]}
                >
                  <Ionicons
                    name="shield-checkmark-outline"
                    size={20}
                    color={colors.accent}
                  />
                </View>
                <Text style={[styles.actionText, { color: colors.text }]}>
                  Privacy & Security
                </Text>
              </View>
              <Ionicons
                name="chevron-forward"
                size={20}
                color={colors.textSecondary}
              />
            </TouchableOpacity>

            {/* Help & Support */}
            <TouchableOpacity
              style={[
                styles.actionItem,
                { borderBottomColor: colors.border },
              ]}
              activeOpacity={0.7}
            >
              <View style={styles.actionLeft}>
                <View
                  style={[
                    styles.actionIconContainer,
                    { backgroundColor: colors.accent + '22' },
                  ]}
                >
                  <Ionicons
                    name="help-circle-outline"
                    size={20}
                    color={colors.accent}
                  />
                </View>
                <Text style={[styles.actionText, { color: colors.text }]}>
                  Help & Support
                </Text>
              </View>
              <Ionicons
                name="chevron-forward"
                size={20}
                color={colors.textSecondary}
              />
            </TouchableOpacity>

            {/* About */}
            <TouchableOpacity
              style={styles.actionItem}
              activeOpacity={0.7}
            >
              <View style={styles.actionLeft}>
                <View
                  style={[
                    styles.actionIconContainer,
                    { backgroundColor: colors.accent + '22' },
                  ]}
                >
                  <Ionicons
                    name="information-circle-outline"
                    size={20}
                    color={colors.accent}
                  />
                </View>
                <Text style={[styles.actionText, { color: colors.text }]}>
                  About Junto Go
                </Text>
              </View>
              <Ionicons
                name="chevron-forward"
                size={20}
                color={colors.textSecondary}
              />
            </TouchableOpacity>
          </Card>
        </AnimatedView>

        {/* Logout Button */}
        <AnimatedView animation="slideUp" delay={300} duration={500}>
          <TouchableOpacity
            style={[
              styles.logoutButton,
              { backgroundColor: colors.error + '22', borderColor: colors.error },
            ]}
            onPress={handleLogout}
            activeOpacity={0.7}
          >
            <Ionicons name="log-out-outline" size={22} color={colors.error} />
            <Text style={[styles.logoutText, { color: colors.error }]}>
              Sign Out
            </Text>
          </TouchableOpacity>
        </AnimatedView>

        {/* Version */}
        <View style={styles.versionContainer}>
          <Text style={[styles.versionText, { color: colors.textTertiary }]}>
            Version 1.0.0
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: responsive.spacing.lg,
    paddingTop: 20,
    paddingBottom: 120,
  },
  header: {
    marginBottom: responsive.spacing.md,
    alignItems: 'center',
  },
  title: {
    fontSize: responsive.fontSize.xxxl,
    fontWeight: 'bold',
  },
  errorText: {
    fontSize: responsive.fontSize.base,
    textAlign: 'center',
    marginTop: responsive.spacing.xl,
  },
  userCard: {
    alignItems: 'center',
    paddingVertical: responsive.spacing.xl,
    marginBottom: responsive.spacing.lg,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: responsive.spacing.md,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#fff',
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#fff',
  },
  displayName: {
    fontSize: responsive.fontSize.xxl,
    fontWeight: 'bold',
    marginBottom: responsive.spacing.sm,
  },
  contactInfo: {
    alignItems: 'center',
    marginBottom: responsive.spacing.md,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: responsive.spacing.xs,
  },
  infoText: {
    fontSize: responsive.fontSize.base,
    marginLeft: responsive.spacing.sm,
  },
  ratingContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: responsive.spacing.md,
    paddingHorizontal: responsive.spacing.lg,
    paddingVertical: responsive.spacing.md,
    borderRadius: responsive.borderRadius.lg,
    borderWidth: 1,
  },
  starsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 6,
  },
  ratingText: {
    fontSize: responsive.fontSize.sm,
    fontWeight: '600',
  },
  rolesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: responsive.spacing.md,
  },
  roleBadge: {
    paddingHorizontal: responsive.spacing.md,
    paddingVertical: responsive.spacing.xs,
    borderRadius: responsive.borderRadius.full,
    marginHorizontal: responsive.spacing.xs,
  },
  roleText: {
    fontSize: responsive.fontSize.sm,
    fontWeight: '600',
  },
  memberSince: {
    marginTop: responsive.spacing.xs,
  },
  memberSinceText: {
    fontSize: responsive.fontSize.sm,
  },
  actionsCard: {
    marginBottom: responsive.spacing.lg,
  },
  sectionTitle: {
    fontSize: responsive.fontSize.lg,
    fontWeight: 'bold',
    marginBottom: responsive.spacing.md,
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: responsive.spacing.md,
    borderBottomWidth: 1,
  },
  actionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: responsive.spacing.md,
  },
  actionText: {
    fontSize: responsive.fontSize.base,
    fontWeight: '500',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: responsive.spacing.md,
    borderRadius: responsive.borderRadius.md,
    borderWidth: 2,
  },
  logoutText: {
    fontSize: responsive.fontSize.base,
    fontWeight: '600',
    marginLeft: responsive.spacing.sm,
  },
  versionContainer: {
    alignItems: 'center',
    marginTop: responsive.spacing.lg,
  },
  versionText: {
    fontSize: responsive.fontSize.sm,
  },
});
