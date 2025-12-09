import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Button, Input } from '../../components/ui';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuthStore } from '../../store/authStore';
import authApi from '../../services/api/auth.api';
import { UserRole } from '../../shared/types/user';

type EditField = 'displayName' | 'email' | 'phoneE164';

export const EditProfileScreen: React.FC = () => {
  const router = useRouter();
  const { colors, isDark } = useTheme();
  const { user, refreshUser, addRole } = useAuthStore();

  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phoneE164, setPhoneE164] = useState(user?.phoneE164 || '');
  const [isLoading, setIsLoading] = useState(false);
  const [isAddingRole, setIsAddingRole] = useState(false);
  const [errors, setErrors] = useState<Record<EditField, string>>({
    displayName: '',
    email: '',
    phoneE164: '',
  });

  const validateDisplayName = (value: string): string => {
    if (!value || value.trim().length < 2) {
      return 'Display name must be at least 2 characters';
    }
    if (value.length > 50) {
      return 'Display name must be less than 50 characters';
    }
    return '';
  };

  const validateEmail = (value: string): string => {
    if (!value) return '';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      return 'Invalid email format';
    }
    return '';
  };

  const validatePhone = (value: string): string => {
    if (!value) return '';
    if (!/^\+[1-9]\d{1,14}$/.test(value)) {
      return 'Use E.164 format (e.g., +212612345678)';
    }
    return '';
  };

  const handleFieldChange = (field: EditField, value: string) => {
    switch (field) {
      case 'displayName':
        setDisplayName(value);
        break;
      case 'email':
        setEmail(value);
        break;
      case 'phoneE164':
        setPhoneE164(value);
        break;
    }
    setErrors({ ...errors, [field]: '' });
  };

  const handleSave = async () => {
    const displayNameError = validateDisplayName(displayName);
    const emailError = validateEmail(email);
    const phoneError = validatePhone(phoneE164);

    if (displayNameError || emailError || phoneError) {
      setErrors({
        displayName: displayNameError,
        email: emailError,
        phoneE164: phoneError,
      });
      return;
    }

    if (!email && !phoneE164) {
      Alert.alert('Error', 'Please provide either an email or phone number');
      return;
    }

    setIsLoading(true);

    try {
      await authApi.updateProfile({
        displayName,
        email: email || undefined,
        phoneE164: phoneE164 || undefined,
      });

      await refreshUser();

      Alert.alert('Success', 'Profile updated successfully', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.message || error.message || 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBecomeSeller = async () => {
    setIsAddingRole(true);
    try {
      await addRole(UserRole.SELLER);
      Alert.alert('Success', 'You are now a seller!');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to add seller role');
    } finally {
      setIsAddingRole(false);
    }
  };

  const isSeller = user?.roles.includes(UserRole.SELLER);

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

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header with Gradient */}
          <View style={styles.headerSection}>
            <LinearGradient
              colors={[colors.primary, colors.primaryLight]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.headerGradient}
            >
              {/* Back Button */}
              <TouchableOpacity
                style={styles.backButton}
                onPress={() => router.back()}
                activeOpacity={0.7}
              >
                <Ionicons name="arrow-back" size={22} color="#FFFFFF" />
              </TouchableOpacity>

              {/* Title */}
              <Text style={styles.headerTitle}>Edit Profile</Text>

              {/* Spacer for alignment */}
              <View style={styles.backButton} />
            </LinearGradient>

            {/* Avatar Section (overlapping gradient) */}
            <View style={styles.avatarWrapper}>
              <View style={[
                styles.avatarContainer,
                {
                  backgroundColor: isDark ? colors.surface : '#FFFFFF',
                  borderColor: isDark ? colors.border : '#E5E7EB',
                }
              ]}>
                {user.avatarUrl ? (
                  <Image source={{ uri: user.avatarUrl }} style={styles.avatar} />
                ) : (
                  <LinearGradient
                    colors={[colors.primary, colors.primaryLight]}
                    style={styles.avatarPlaceholder}
                  >
                    <Text style={styles.avatarText}>
                      {displayName.charAt(0).toUpperCase() || 'U'}
                    </Text>
                  </LinearGradient>
                )}

                <TouchableOpacity
                  style={[styles.cameraButton, { backgroundColor: colors.primary }]}
                  activeOpacity={0.7}
                >
                  <Ionicons name="camera" size={16} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
              <Text style={[styles.changePhotoText, { color: colors.textSecondary }]}>
                Tap to change photo
              </Text>
            </View>
          </View>

          {/* Personal Info Card */}
          <View style={[
            styles.card,
            {
              backgroundColor: isDark ? colors.surface : '#FFFFFF',
              borderColor: isDark ? colors.border : '#E5E7EB',
            }
          ]}>
            <View style={styles.cardHeader}>
              <View style={[styles.cardIcon, { backgroundColor: colors.primary + '15' }]}>
                <Ionicons name="person" size={18} color={colors.primary} />
              </View>
              <Text style={[styles.cardTitle, { color: colors.text }]}>
                Personal Information
              </Text>
            </View>

            <Input
              label="Display Name"
              placeholder="Enter your name"
              value={displayName}
              onChangeText={(text) => handleFieldChange('displayName', text)}
              error={errors.displayName}
              autoCapitalize="words"
              leftIcon="person-outline"
            />

            <Input
              label="Email"
              placeholder="Enter your email"
              value={email}
              onChangeText={(text) => handleFieldChange('email', text)}
              error={errors.email}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              leftIcon="mail-outline"
            />

            <Input
              label="Phone Number"
              placeholder="+212612345678"
              value={phoneE164}
              onChangeText={(text) => handleFieldChange('phoneE164', text)}
              error={errors.phoneE164}
              keyboardType="phone-pad"
              autoComplete="tel"
              leftIcon="call-outline"
            />

            <View style={[styles.infoNote, { backgroundColor: colors.info + '10' }]}>
              <Ionicons name="information-circle" size={18} color={colors.info} />
              <Text style={[styles.infoNoteText, { color: colors.info }]}>
                At least one contact method (email or phone) is required
              </Text>
            </View>
          </View>

          {/* Account Status Card */}
          <View style={[
            styles.card,
            {
              backgroundColor: isDark ? colors.surface : '#FFFFFF',
              borderColor: isDark ? colors.border : '#E5E7EB',
            }
          ]}>
            <View style={styles.cardHeader}>
              <View style={[styles.cardIcon, { backgroundColor: colors.success + '15' }]}>
                <Ionicons name="shield-checkmark" size={18} color={colors.success} />
              </View>
              <Text style={[styles.cardTitle, { color: colors.text }]}>
                Account Status
              </Text>
            </View>

            {/* Verification Status */}
            <View style={[
              styles.statusRow,
              { borderBottomColor: isDark ? colors.border : '#F3F4F6' }
            ]}>
              <View style={styles.statusLeft}>
                <View style={[
                  styles.statusIcon,
                  { backgroundColor: user.isVerified ? colors.success + '15' : colors.warning + '15' }
                ]}>
                  <Ionicons
                    name={user.isVerified ? 'checkmark-circle' : 'alert-circle'}
                    size={20}
                    color={user.isVerified ? colors.success : colors.warning}
                  />
                </View>
                <View>
                  <Text style={[styles.statusLabel, { color: colors.text }]}>Verification</Text>
                  <Text style={[styles.statusValue, { color: colors.textSecondary }]}>
                    {user.isVerified ? 'Verified' : 'Not Verified'}
                  </Text>
                </View>
              </View>
              {!user.isVerified && (
                <TouchableOpacity
                  style={[styles.statusAction, { backgroundColor: colors.warning + '15' }]}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.statusActionText, { color: colors.warning }]}>Verify</Text>
                </TouchableOpacity>
              )}
            </View>

            {/* Seller Status */}
            <View style={styles.statusRow}>
              <View style={styles.statusLeft}>
                <View style={[
                  styles.statusIcon,
                  { backgroundColor: isSeller ? colors.primary + '15' : colors.textTertiary + '15' }
                ]}>
                  <Ionicons
                    name={isSeller ? 'storefront' : 'storefront-outline'}
                    size={20}
                    color={isSeller ? colors.primary : colors.textTertiary}
                  />
                </View>
                <View>
                  <Text style={[styles.statusLabel, { color: colors.text }]}>Seller Account</Text>
                  <Text style={[styles.statusValue, { color: colors.textSecondary }]}>
                    {isSeller ? 'Active' : 'Not Active'}
                  </Text>
                </View>
              </View>
              {!isSeller && (
                <TouchableOpacity
                  style={[styles.statusAction, { backgroundColor: colors.primary + '15' }]}
                  onPress={handleBecomeSeller}
                  disabled={isAddingRole}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.statusActionText, { color: colors.primary }]}>
                    {isAddingRole ? 'Adding...' : 'Become Seller'}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.buttonSection}>
            <TouchableOpacity
              style={styles.saveButtonWrapper}
              onPress={handleSave}
              disabled={isLoading}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={[colors.primary, colors.primaryLight]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.saveButton}
              >
                {isLoading ? (
                  <Text style={styles.saveButtonText}>Saving...</Text>
                ) : (
                  <>
                    <Ionicons name="checkmark-circle" size={20} color="#FFFFFF" />
                    <Text style={styles.saveButtonText}>Save Changes</Text>
                  </>
                )}
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.cancelButton,
                {
                  backgroundColor: isDark ? colors.surface : '#FFFFFF',
                  borderColor: isDark ? colors.border : '#E5E7EB',
                }
              ]}
              onPress={() => router.back()}
              disabled={isLoading}
              activeOpacity={0.7}
            >
              <Ionicons name="close-circle-outline" size={20} color={colors.textSecondary} />
              <Text style={[styles.cancelButtonText, { color: colors.text }]}>Cancel</Text>
            </TouchableOpacity>
          </View>

          {/* Bottom Spacing */}
          <View style={{ height: 100 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
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

  // Header Section
  headerSection: {
    marginBottom: 16,
  },
  headerGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 12,
    paddingBottom: 60,
    paddingHorizontal: 16,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },

  // Avatar Section
  avatarWrapper: {
    alignItems: 'center',
    marginTop: -50,
  },
  avatarContainer: {
    padding: 6,
    borderRadius: 60,
    borderWidth: 1,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
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
    fontWeight: '700',
    color: '#FFFFFF',
  },
  cameraButton: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  changePhotoText: {
    fontSize: 13,
    marginTop: 10,
  },

  // Card Styles
  card: {
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
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  cardIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
  },

  // Info Note
  infoNote: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 10,
    gap: 10,
    marginTop: 8,
  },
  infoNoteText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 18,
  },

  // Status Row
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'transparent',
  },
  statusLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  statusIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 2,
  },
  statusValue: {
    fontSize: 12,
  },
  statusAction: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
  },
  statusActionText: {
    fontSize: 13,
    fontWeight: '600',
  },

  // Buttons
  buttonSection: {
    paddingHorizontal: 20,
    gap: 12,
    marginTop: 8,
  },
  saveButtonWrapper: {
    borderRadius: 14,
    overflow: 'hidden',
    shadowColor: '#059669',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 8,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  cancelButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 14,
    borderWidth: 1,
    gap: 8,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
