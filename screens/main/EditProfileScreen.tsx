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
import { Button, Card, Input, AnimatedView } from '../../components/ui';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuthStore } from '../../store/authStore';
import { responsive } from '../../utils/responsive/responsive';
import authApi from '../../services/api/auth.api';
import { UserRole } from '../../shared/types/user';

type EditField = 'displayName' | 'email' | 'phoneE164';

export const EditProfileScreen: React.FC = () => {
  const router = useRouter();
  const { colors } = useTheme();
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
    if (!/^[a-zA-Z\s]+$/.test(value)) {
      return 'Display name can only contain letters and spaces';
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
      return 'Invalid phone format. Use E.164 format (e.g., +212612345678)';
    }
    return '';
  };

  const handleFieldChange = (field: EditField, value: string) => {
    console.log(`[EditProfileScreen] Updating ${field}:`, value);

    // Update state
    switch (field) {
      case 'displayName':
        setDisplayName(value);
        setErrors({ ...errors, displayName: validateDisplayName(value) });
        break;
      case 'email':
        setEmail(value);
        setErrors({ ...errors, email: validateEmail(value) });
        break;
      case 'phoneE164':
        setPhoneE164(value);
        setErrors({ ...errors, phoneE164: validatePhone(value) });
        break;
    }
  };

  const handleSave = async () => {
    console.log('[EditProfileScreen] Saving profile changes...');

    // Validate all fields
    const displayNameError = validateDisplayName(displayName);
    const emailError = validateEmail(email);
    const phoneError = validatePhone(phoneE164);

    if (displayNameError || emailError || phoneError) {
      setErrors({
        displayName: displayNameError,
        email: emailError,
        phoneE164: phoneError,
      });
      console.log('[EditProfileScreen] Validation failed');
      return;
    }

    // Ensure at least email or phone is provided
    if (!email && !phoneE164) {
      Alert.alert('Error', 'Please provide either an email or phone number');
      return;
    }

    setIsLoading(true);

    try {
      const updateData = {
        displayName,
        email: email || undefined,
        phoneE164: phoneE164 || undefined,
      };

      console.log('[EditProfileScreen] Profile data to update:', updateData);

      // Call update profile API
      await authApi.updateProfile(updateData);

      // Refresh user data
      await refreshUser();

      console.log('[EditProfileScreen] Profile updated successfully');
      Alert.alert('Success', 'Profile updated successfully', [
        {
          text: 'OK',
          onPress: () => router.back(),
        },
      ]);
    } catch (error: any) {
      console.error('[EditProfileScreen] Update error:', error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        'Failed to update profile. Please try again.';
      Alert.alert('Error', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    console.log('[EditProfileScreen] Cancelling edit');
    router.back();
  };

  const handleBecomeSeller = async () => {
    console.log('[EditProfileScreen] Adding SELLER role...');
    setIsAddingRole(true);

    try {
      await addRole(UserRole.SELLER);
      console.log('[EditProfileScreen] SELLER role added successfully');
      Alert.alert('Success', 'You are now a seller! You can start listing items.');
    } catch (error: any) {
      console.error('[EditProfileScreen] Add role error:', error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        'Failed to add seller role. Please try again.';
      Alert.alert('Error', errorMessage);
    } finally {
      setIsAddingRole(false);
    }
  };

  const isSeller = user?.roles.includes(UserRole.SELLER);

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
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.select({ ios: 0, android: 25 })}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <AnimatedView animation="fade" duration={500}>
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={handleCancel}
              activeOpacity={0.7}
            >
              <Ionicons
                name="arrow-back"
                size={24}
                color={colors.text}
              />
            </TouchableOpacity>
            <Text style={[styles.title, { color: colors.text }]}>
              Edit Profile
            </Text>
            <View style={styles.backButton} />
          </View>
        </AnimatedView>

        {/* Avatar Section */}
        <AnimatedView animation="scale" delay={100} duration={500}>
          <Card variant="elevated" style={styles.avatarCard}>
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
                    {displayName.charAt(0).toUpperCase()}
                  </Text>
                </View>
              )}

              {/* Change Avatar Button */}
              <TouchableOpacity
                style={[
                  styles.changeAvatarButton,
                  { backgroundColor: colors.primary },
                ]}
                activeOpacity={0.7}
              >
                <Ionicons name="camera" size={20} color="#fff" />
              </TouchableOpacity>
            </View>

            <Text style={[styles.changeAvatarText, { color: colors.textSecondary }]}>
              Tap to change profile picture
            </Text>
          </Card>
        </AnimatedView>

        {/* Form Fields */}
        <AnimatedView animation="slideUp" delay={150} duration={500}>
          <Card variant="elevated" style={styles.formCard}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Personal Information
            </Text>

            {/* Display Name */}
            <Input
              label="Display Name"
              placeholder="Enter your name"
              value={displayName}
              onChangeText={(text) => handleFieldChange('displayName', text)}
              error={errors.displayName}
              autoCapitalize="words"
            />

            {/* Email */}
            <Input
              label="Email (optional)"
              placeholder="Enter your email"
              value={email}
              onChangeText={(text) => handleFieldChange('email', text)}
              error={errors.email}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
            />

            {/* Phone */}
            <Input
              label="Phone Number (optional)"
              placeholder="+212612345678"
              value={phoneE164}
              onChangeText={(text) => handleFieldChange('phoneE164', text)}
              error={errors.phoneE164}
              keyboardType="phone-pad"
              autoComplete="tel"
            />

            <View style={styles.noteContainer}>
              <Ionicons
                name="information-circle-outline"
                size={16}
                color={colors.textTertiary}
              />
              <Text style={[styles.noteText, { color: colors.textTertiary }]}>
                You must provide at least one contact method (email or phone)
              </Text>
            </View>
          </Card>
        </AnimatedView>

        {/* Account Info */}
        <AnimatedView animation="slideUp" delay={200} duration={500}>
          <Card variant="elevated" style={styles.infoCard}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Account Status
            </Text>

            <View style={styles.infoRow}>
              <View style={styles.infoLeft}>
                <Ionicons
                  name={user.isVerified ? 'checkmark-circle' : 'alert-circle-outline'}
                  size={20}
                  color={user.isVerified ? colors.success : colors.warning}
                />
                <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>
                  Verification Status
                </Text>
              </View>
              <Text style={[styles.infoValue, { color: colors.text }]}>
                {user.isVerified ? 'Verified' : 'Not Verified'}
              </Text>
            </View>

            {!user.isVerified && (
              <TouchableOpacity
                style={[
                  styles.verifyButton,
                  { backgroundColor: colors.warning + '22', borderColor: colors.warning },
                ]}
                activeOpacity={0.7}
              >
                <Text style={[styles.verifyButtonText, { color: colors.warning }]}>
                  Verify Account
                </Text>
              </TouchableOpacity>
            )}

            {/* Seller Role Status */}
            <View style={[styles.infoRow, { marginTop: responsive.spacing.md }]}>
              <View style={styles.infoLeft}>
                <Ionicons
                  name={isSeller ? 'storefront' : 'storefront-outline'}
                  size={20}
                  color={isSeller ? colors.primary : colors.textSecondary}
                />
                <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>
                  Seller Account
                </Text>
              </View>
              <Text style={[styles.infoValue, { color: colors.text }]}>
                {isSeller ? 'Active' : 'Not Active'}
              </Text>
            </View>

            {!isSeller && (
              <TouchableOpacity
                style={[
                  styles.verifyButton,
                  { backgroundColor: colors.primary + '22', borderColor: colors.primary },
                ]}
                onPress={handleBecomeSeller}
                disabled={isAddingRole}
                activeOpacity={0.7}
              >
                {isAddingRole ? (
                  <Text style={[styles.verifyButtonText, { color: colors.primary }]}>
                    Adding Seller Role...
                  </Text>
                ) : (
                  <Text style={[styles.verifyButtonText, { color: colors.primary }]}>
                    Be a Seller
                  </Text>
                )}
              </TouchableOpacity>
            )}
          </Card>
        </AnimatedView>

        {/* Action Buttons */}
        <AnimatedView animation="slideUp" delay={250} duration={500}>
          <View style={styles.buttonContainer}>
            <Button
              title={isLoading ? 'Saving...' : 'Save Changes'}
              onPress={handleSave}
              loading={isLoading}
              disabled={isLoading}
              variant="primary"
              size="large"
              style={styles.saveButton}
            />

            <Button
              title="Cancel"
              onPress={handleCancel}
              disabled={isLoading}
              variant="outline"
              size="large"
            />
          </View>
        </AnimatedView>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: responsive.spacing.lg,
    paddingBottom: 120,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: responsive.spacing.lg,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: responsive.fontSize.xxl,
    fontWeight: 'bold',
  },
  errorText: {
    fontSize: responsive.fontSize.base,
    textAlign: 'center',
    marginTop: responsive.spacing.xl,
  },
  avatarCard: {
    alignItems: 'center',
    paddingVertical: responsive.spacing.xl,
    marginBottom: responsive.spacing.lg,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: responsive.spacing.sm,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  avatarPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#fff',
  },
  changeAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#fff',
  },
  changeAvatarText: {
    fontSize: responsive.fontSize.sm,
  },
  formCard: {
    marginBottom: responsive.spacing.lg,
  },
  sectionTitle: {
    fontSize: responsive.fontSize.lg,
    fontWeight: 'bold',
    marginBottom: responsive.spacing.md,
  },
  noteContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: responsive.spacing.sm,
    paddingHorizontal: responsive.spacing.xs,
  },
  noteText: {
    fontSize: responsive.fontSize.xs,
    marginLeft: responsive.spacing.xs,
    flex: 1,
    lineHeight: 18,
  },
  infoCard: {
    marginBottom: responsive.spacing.lg,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: responsive.spacing.md,
  },
  infoLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: responsive.fontSize.base,
    marginLeft: responsive.spacing.sm,
  },
  infoValue: {
    fontSize: responsive.fontSize.base,
    fontWeight: '600',
  },
  verifyButton: {
    paddingVertical: responsive.spacing.sm,
    paddingHorizontal: responsive.spacing.md,
    borderRadius: responsive.borderRadius.md,
    borderWidth: 1,
    alignItems: 'center',
  },
  verifyButtonText: {
    fontSize: responsive.fontSize.base,
    fontWeight: '600',
  },
  buttonContainer: {
    gap: responsive.spacing.md,
  },
  saveButton: {
    marginBottom: responsive.spacing.sm,
  },
});
