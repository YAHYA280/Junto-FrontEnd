import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  Alert,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuthStore } from '../../store/authStore';
import { UserRole } from '../../shared/types/user';
import authApi from '../../services/api/auth.api';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export const ProfileScreen: React.FC = () => {
  const router = useRouter();
  const { colors, isDark } = useTheme();
  const { user, logout, refreshUser } = useAuthStore();
  const [isSwitchingRole, setIsSwitchingRole] = useState(false);

  const handleLogout = async () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            try {
              await logout();
              router.replace('/(auth)');
            } catch (error) {
              console.error('[ProfileScreen] Logout error:', error);
            }
          },
        },
      ]
    );
  };

  const handleSwitchRole = async () => {
    if (!user) return;

    const isSeller = user.roles.includes('SELLER' as any);
    const isBuyer = user.roles.includes('BUYER' as any);

    let roleToAdd: 'BUYER' | 'SELLER';
    let roleLabel: string;

    if (isSeller && !isBuyer) {
      roleToAdd = 'BUYER';
      roleLabel = 'Buyer';
    } else if (isBuyer && !isSeller) {
      roleToAdd = 'SELLER';
      roleLabel = 'Seller';
    } else {
      Alert.alert('Info', 'You already have both Buyer and Seller roles!');
      return;
    }

    Alert.alert(
      'Add ' + roleLabel + ' Role',
      `Do you want to become a ${roleLabel}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Yes, Add Role',
          onPress: async () => {
            setIsSwitchingRole(true);
            try {
              await authApi.addRole({ role: roleToAdd });
              await refreshUser();
              Alert.alert('Success', `You are now a ${roleLabel}!`);
            } catch (error: any) {
              Alert.alert('Error', error.message || 'Failed to add role');
            } finally {
              setIsSwitchingRole(false);
            }
          },
        },
      ]
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
    });
  };

  if (!user) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
        <View style={styles.errorContainer}>
          <Ionicons name="person-outline" size={64} color={colors.textTertiary} />
          <Text style={[styles.errorText, { color: colors.textSecondary }]}>
            No user data available
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const isSeller = user.roles.includes('SELLER' as any);
  const isBuyer = user.roles.includes('BUYER' as any);
  const hasBothRoles = isSeller && isBuyer;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Profile Header with Gradient */}
        <View style={styles.profileHeader}>
          <LinearGradient
            colors={[colors.primary, colors.primaryLight]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.headerGradient}
          >
            {/* Avatar */}
            <View style={styles.avatarWrapper}>
              {user.avatarUrl ? (
                <Image source={{ uri: user.avatarUrl }} style={styles.avatar} />
              ) : (
                <View style={[styles.avatarPlaceholder, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
                  <Text style={styles.avatarText}>
                    {user.displayName.charAt(0).toUpperCase()}
                  </Text>
                </View>
              )}

              {user.isVerified && (
                <View style={styles.verifiedBadge}>
                  <Ionicons name="checkmark-circle" size={24} color="#FFFFFF" />
                </View>
              )}
            </View>

            {/* Name */}
            <Text style={styles.displayName}>{user.displayName}</Text>

            {/* Role Badges */}
            <View style={styles.rolesContainer}>
              {user.roles.map((role) => (
                <View key={role} style={styles.roleBadge}>
                  <Ionicons
                    name={role === UserRole.SELLER ? 'storefront' : 'cart'}
                    size={12}
                    color="#FFFFFF"
                  />
                  <Text style={styles.roleText}>
                    {role === UserRole.SELLER ? 'Seller' : 'Buyer'}
                  </Text>
                </View>
              ))}
            </View>
          </LinearGradient>
        </View>

        {/* Stats Card */}
        <View style={[
          styles.statsCard,
          {
            backgroundColor: isDark ? colors.surface : '#FFFFFF',
            borderColor: isDark ? colors.border : '#E5E7EB',
          }
        ]}>
          {/* Rating */}
          <View style={styles.statItem}>
            <View style={[styles.statIconWrapper, { backgroundColor: '#FBBF24' + '15' }]}>
              <Ionicons name="star" size={20} color="#FBBF24" />
            </View>
            <Text style={[styles.statValue, { color: colors.text }]}>
              {user.ratingAvg?.toFixed(1) || '0.0'}
            </Text>
            <Text style={[styles.statLabel, { color: colors.textTertiary }]}>
              {user.ratingCount || 0} reviews
            </Text>
          </View>

          {/* Divider */}
          <View style={[styles.statDivider, { backgroundColor: isDark ? colors.border : '#E5E7EB' }]} />

          {/* Member Since */}
          <View style={styles.statItem}>
            <View style={[styles.statIconWrapper, { backgroundColor: colors.primary + '15' }]}>
              <Ionicons name="calendar" size={20} color={colors.primary} />
            </View>
            <Text style={[styles.statValue, { color: colors.text }]} numberOfLines={1}>
              {formatDate(user.createdAt)}
            </Text>
            <Text style={[styles.statLabel, { color: colors.textTertiary }]}>
              Member since
            </Text>
          </View>

          {/* Divider */}
          <View style={[styles.statDivider, { backgroundColor: isDark ? colors.border : '#E5E7EB' }]} />

          {/* Verification */}
          <View style={styles.statItem}>
            <View style={[
              styles.statIconWrapper,
              { backgroundColor: user.isVerified ? colors.success + '15' : colors.warning + '15' }
            ]}>
              <Ionicons
                name={user.isVerified ? 'shield-checkmark' : 'shield-outline'}
                size={20}
                color={user.isVerified ? colors.success : colors.warning}
              />
            </View>
            <Text style={[styles.statValue, { color: colors.text }]}>
              {user.isVerified ? 'Verified' : 'Unverified'}
            </Text>
            <Text style={[styles.statLabel, { color: colors.textTertiary }]}>
              Account
            </Text>
          </View>
        </View>

        {/* Contact Info Card */}
        <View style={[
          styles.infoCard,
          {
            backgroundColor: isDark ? colors.surface : '#FFFFFF',
            borderColor: isDark ? colors.border : '#E5E7EB',
          }
        ]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Contact Information</Text>

          {user.email && (
            <View style={styles.infoRow}>
              <View style={[styles.infoIcon, { backgroundColor: colors.primary + '15' }]}>
                <Ionicons name="mail" size={18} color={colors.primary} />
              </View>
              <View style={styles.infoContent}>
                <Text style={[styles.infoLabel, { color: colors.textTertiary }]}>Email</Text>
                <Text style={[styles.infoValue, { color: colors.text }]}>{user.email}</Text>
              </View>
            </View>
          )}

          {user.phoneE164 && (
            <View style={styles.infoRow}>
              <View style={[styles.infoIcon, { backgroundColor: colors.success + '15' }]}>
                <Ionicons name="call" size={18} color={colors.success} />
              </View>
              <View style={styles.infoContent}>
                <Text style={[styles.infoLabel, { color: colors.textTertiary }]}>Phone</Text>
                <Text style={[styles.infoValue, { color: colors.text }]}>{user.phoneE164}</Text>
              </View>
            </View>
          )}
        </View>

        {/* Quick Actions */}
        <View style={[
          styles.actionsCard,
          {
            backgroundColor: isDark ? colors.surface : '#FFFFFF',
            borderColor: isDark ? colors.border : '#E5E7EB',
          }
        ]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Quick Actions</Text>

          {/* Edit Profile */}
          <TouchableOpacity
            style={styles.actionItem}
            onPress={() => router.push('/(tabs)/edit-profile')}
            activeOpacity={0.7}
          >
            <LinearGradient
              colors={[colors.primary, colors.primaryLight]}
              style={styles.actionIconGradient}
            >
              <Ionicons name="pencil" size={18} color="#FFFFFF" />
            </LinearGradient>
            <View style={styles.actionContent}>
              <Text style={[styles.actionLabel, { color: colors.text }]}>Edit Profile</Text>
              <Text style={[styles.actionHint, { color: colors.textTertiary }]}>
                Update your personal information
              </Text>
            </View>
            <View style={[styles.actionArrow, { backgroundColor: isDark ? colors.backgroundSecondary : '#F3F4F6' }]}>
              <Ionicons name="chevron-forward" size={16} color={colors.textTertiary} />
            </View>
          </TouchableOpacity>

          {/* Add Role */}
          {!hasBothRoles && (
            <TouchableOpacity
              style={styles.actionItem}
              onPress={handleSwitchRole}
              activeOpacity={0.7}
              disabled={isSwitchingRole}
            >
              <LinearGradient
                colors={[colors.accent, colors.accentLight]}
                style={styles.actionIconGradient}
              >
                {isSwitchingRole ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <Ionicons name="add" size={20} color="#FFFFFF" />
                )}
              </LinearGradient>
              <View style={styles.actionContent}>
                <Text style={[styles.actionLabel, { color: colors.text }]}>
                  {isSeller ? 'Become a Buyer' : 'Become a Seller'}
                </Text>
                <Text style={[styles.actionHint, { color: colors.textTertiary }]}>
                  {isSeller ? 'Start shopping for deals' : 'Start listing your deals'}
                </Text>
              </View>
              <View style={[styles.actionArrow, { backgroundColor: isDark ? colors.backgroundSecondary : '#F3F4F6' }]}>
                <Ionicons name="chevron-forward" size={16} color={colors.textTertiary} />
              </View>
            </TouchableOpacity>
          )}

          {/* Settings */}
          <TouchableOpacity
            style={styles.actionItem}
            activeOpacity={0.7}
          >
            <View style={[styles.actionIcon, { backgroundColor: colors.info + '15' }]}>
              <Ionicons name="settings" size={18} color={colors.info} />
            </View>
            <View style={styles.actionContent}>
              <Text style={[styles.actionLabel, { color: colors.text }]}>Settings</Text>
              <Text style={[styles.actionHint, { color: colors.textTertiary }]}>
                App preferences & notifications
              </Text>
            </View>
            <View style={[styles.actionArrow, { backgroundColor: isDark ? colors.backgroundSecondary : '#F3F4F6' }]}>
              <Ionicons name="chevron-forward" size={16} color={colors.textTertiary} />
            </View>
          </TouchableOpacity>

          {/* Help */}
          <TouchableOpacity
            style={[styles.actionItem, { borderBottomWidth: 0 }]}
            activeOpacity={0.7}
          >
            <View style={[styles.actionIcon, { backgroundColor: colors.warning + '15' }]}>
              <Ionicons name="help-circle" size={20} color={colors.warning} />
            </View>
            <View style={styles.actionContent}>
              <Text style={[styles.actionLabel, { color: colors.text }]}>Help & Support</Text>
              <Text style={[styles.actionHint, { color: colors.textTertiary }]}>
                FAQs, contact us, report issues
              </Text>
            </View>
            <View style={[styles.actionArrow, { backgroundColor: isDark ? colors.backgroundSecondary : '#F3F4F6' }]}>
              <Ionicons name="chevron-forward" size={16} color={colors.textTertiary} />
            </View>
          </TouchableOpacity>
        </View>

        {/* Sign Out Button */}
        <TouchableOpacity
          style={[
            styles.signOutButton,
            {
              backgroundColor: colors.error + '10',
              borderColor: colors.error + '30',
            }
          ]}
          onPress={handleLogout}
          activeOpacity={0.7}
        >
          <Ionicons name="log-out-outline" size={22} color={colors.error} />
          <Text style={[styles.signOutText, { color: colors.error }]}>Sign Out</Text>
        </TouchableOpacity>

        {/* App Version */}
        <View style={styles.versionContainer}>
          <Text style={[styles.versionText, { color: colors.textTertiary }]}>
            Junto Go v1.0.0
          </Text>
        </View>

        {/* Bottom Spacing */}
        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  errorText: {
    fontSize: 16,
  },

  // Profile Header
  profileHeader: {
    marginBottom: 16,
  },
  headerGradient: {
    alignItems: 'center',
    paddingTop: 24,
    paddingBottom: 32,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  avatarWrapper: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  avatarText: {
    fontSize: 40,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#10B981',
    borderRadius: 12,
    padding: 2,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  displayName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  rolesContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  roleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  roleText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },

  // Stats Card
  statsCard: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginBottom: 16,
    paddingVertical: 20,
    paddingHorizontal: 12,
    borderRadius: 16,
    borderWidth: 1,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: 8,
    paddingHorizontal: 4,
  },
  statIconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statValue: {
    fontSize: 15,
    fontWeight: '700',
    textAlign: 'center',
  },
  statLabel: {
    fontSize: 11,
    textAlign: 'center',
    lineHeight: 14,
  },
  statDivider: {
    width: 1,
    height: '70%',
    alignSelf: 'center',
    marginHorizontal: 4,
  },

  // Info Card
  infoCard: {
    marginHorizontal: 20,
    marginBottom: 16,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  infoIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 15,
    fontWeight: '500',
  },

  // Actions Card
  actionsCard: {
    marginHorizontal: 20,
    marginBottom: 16,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  actionIconGradient: {
    width: 44,
    height: 44,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  actionIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  actionContent: {
    flex: 1,
  },
  actionLabel: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 3,
  },
  actionHint: {
    fontSize: 12,
  },
  actionArrow: {
    width: 28,
    height: 28,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Sign Out
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 20,
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    gap: 10,
  },
  signOutText: {
    fontSize: 16,
    fontWeight: '600',
  },

  // Version
  versionContainer: {
    alignItems: 'center',
    marginTop: 24,
  },
  versionText: {
    fontSize: 12,
  },
});
