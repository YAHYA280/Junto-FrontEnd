import React, { useState } from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Button, Card, Input, ErrorMessage, AnimatedView } from '../../components/ui';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuthStore } from '../../store/authStore';
import { registerSchema, validateField } from '../../utils/validation/auth.schemas';
import { responsive } from '../../utils/responsive/responsive';

type LoginMethod = 'email' | 'phone';

export const RegisterScreen: React.FC = () => {
  const router = useRouter();
  const { colors } = useTheme();
  const { register, isLoading, error, clearError } = useAuthStore();

  const [loginMethod, setLoginMethod] = useState<LoginMethod>('email');
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneE164, setPhoneE164] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateFormField = (field: string, value: string) => {
    console.log(`[RegisterScreen] Validating field: ${field}, value: ${value}`);
    const error = validateField(registerSchema, field, value);
    setErrors((prev) => ({
      ...prev,
      [field]: error || '',
    }));
    console.log(`[RegisterScreen] Validation result for ${field}:`, error || 'No error');
  };

  const handleRegister = async () => {
    console.log('[RegisterScreen] Starting registration process...');
    console.log('[RegisterScreen] Login method:', loginMethod);
    console.log('[RegisterScreen] Display name:', displayName);
    console.log('[RegisterScreen] Email:', email);
    console.log('[RegisterScreen] Phone:', phoneE164);
    console.log('[RegisterScreen] Password length:', password.length);

    Keyboard.dismiss();
    clearError();

    // Build form data
    const formData = {
      displayName,
      ...(loginMethod === 'email' ? { email } : { phoneE164 }),
      password,
      confirmPassword,
    };

    console.log('[RegisterScreen] Form data:', JSON.stringify(formData, null, 2));

    // Validate
    const result = registerSchema.safeParse(formData);

    if (!result.success) {
      console.log('[RegisterScreen] Validation failed:', result.error.errors);
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as string] = err.message;
        }
      });
      setErrors(fieldErrors);
      console.log('[RegisterScreen] Field errors:', fieldErrors);
      return;
    }

    console.log('[RegisterScreen] Validation passed, attempting registration...');

    try {
      await register({
        displayName,
        ...(loginMethod === 'email' ? { email } : { phoneE164 }),
        password,
      });

      console.log('[RegisterScreen] Registration successful, navigating to main app...');
      router.replace('/(tabs)');
    } catch (err) {
      console.error('[RegisterScreen] Registration error:', err);
      // Error is handled by the store
    }
  };

  const switchToLogin = () => {
    console.log('[RegisterScreen] Navigating to login screen...');
    router.back();
  };

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
        <AnimatedView animation="fade" duration={600}>
          <View style={styles.content}>
            {/* Header */}
            <AnimatedView animation="slideDown" delay={150} duration={600}>
              <View style={styles.header}>
                <Text style={[styles.title, { color: colors.text }]}>Create Account</Text>
                <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                  Join Junto Go today
                </Text>
              </View>
            </AnimatedView>

            {/* Main Card */}
            <AnimatedView animation="scale" delay={250} duration={600}>
              <Card variant="elevated" style={styles.card}>
            {/* Error Message */}
            {error && (
              <ErrorMessage message={error} onDismiss={clearError} />
            )}

            {/* Login Method Toggle */}
            <View style={styles.methodToggle}>
              <TouchableOpacity
                style={[
                  styles.methodButton,
                  loginMethod === 'email' && {
                    backgroundColor: colors.primary + '22',
                    borderColor: colors.primary,
                  },
                ]}
                onPress={() => {
                  console.log('[RegisterScreen] Switching to email registration');
                  setLoginMethod('email');
                }}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.methodText,
                    {
                      color: loginMethod === 'email' ? colors.primary : colors.textSecondary,
                    },
                  ]}
                >
                  Email
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.methodButton,
                  loginMethod === 'phone' && {
                    backgroundColor: colors.primary + '22',
                    borderColor: colors.primary,
                  },
                ]}
                onPress={() => {
                  console.log('[RegisterScreen] Switching to phone registration');
                  setLoginMethod('phone');
                }}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.methodText,
                    {
                      color: loginMethod === 'phone' ? colors.primary : colors.textSecondary,
                    },
                  ]}
                >
                  Phone
                </Text>
              </TouchableOpacity>
            </View>

            {/* Display Name */}
            <Input
              label="Display Name"
              placeholder="Enter your name"
              value={displayName}
              onChangeText={(text) => {
                setDisplayName(text);
                validateFormField('displayName', text);
              }}
              error={errors.displayName}
              autoCapitalize="words"
            />

            {/* Email or Phone */}
            {loginMethod === 'email' ? (
              <Input
                label="Email"
                placeholder="Enter your email"
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  validateFormField('email', text);
                }}
                error={errors.email}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
              />
            ) : (
              <Input
                label="Phone Number"
                placeholder="+212612345678"
                value={phoneE164}
                onChangeText={(text) => {
                  setPhoneE164(text);
                  validateFormField('phoneE164', text);
                }}
                error={errors.phoneE164}
                keyboardType="phone-pad"
                autoComplete="tel"
              />
            )}

            {/* Password */}
            <Input
              label="Password"
              placeholder="Enter your password"
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                validateFormField('password', text);
              }}
              error={errors.password}
              isPassword
              autoCapitalize="none"
            />

            {/* Confirm Password */}
            <Input
              label="Confirm Password"
              placeholder="Re-enter your password"
              value={confirmPassword}
              onChangeText={(text) => {
                setConfirmPassword(text);
                validateFormField('confirmPassword', text);
              }}
              error={errors.confirmPassword}
              isPassword
              autoCapitalize="none"
            />

            {/* Register Button */}
            <Button
              title={isLoading ? 'Creating Account...' : 'Sign Up'}
              onPress={handleRegister}
              loading={isLoading}
              disabled={isLoading}
              variant="primary"
              size="large"
              style={styles.registerButton}
            />

            {/* Terms */}
            <Text style={[styles.terms, { color: colors.textTertiary }]}>
              By signing up, you agree to our Terms of Service and Privacy Policy
            </Text>
          </Card>

          </AnimatedView>

          {/* Footer */}
          <AnimatedView animation="slideUp" delay={350} duration={600}>
            <View style={styles.footer}>
              <Text style={[styles.footerText, { color: colors.textSecondary }]}>
                Already have an account?{' '}
              </Text>
              <TouchableOpacity onPress={switchToLogin} activeOpacity={0.7}>
                <Text style={[styles.signInText, { color: colors.primaryLight }]}>
                  Sign In
                </Text>
              </TouchableOpacity>
            </View>
          </AnimatedView>
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
    flexGrow: 1,
    justifyContent: 'center',
    padding: responsive.spacing.lg,
  },
  content: {
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
  },
  header: {
    marginBottom: responsive.spacing.xl,
    alignItems: 'center',
  },
  title: {
    fontSize: responsive.fontSize.xxxl,
    fontWeight: 'bold',
    marginBottom: responsive.spacing.xs,
  },
  subtitle: {
    fontSize: responsive.fontSize.md,
  },
  card: {
    marginBottom: responsive.spacing.lg,
  },
  methodToggle: {
    flexDirection: 'row',
    gap: responsive.spacing.sm,
    marginBottom: responsive.spacing.lg,
  },
  methodButton: {
    flex: 1,
    paddingVertical: responsive.spacing.md,
    borderRadius: responsive.borderRadius.md,
    borderWidth: 1,
    borderColor: 'transparent',
    alignItems: 'center',
  },
  methodText: {
    fontSize: responsive.fontSize.base,
    fontWeight: '600',
  },
  registerButton: {
    marginTop: responsive.spacing.md,
    marginBottom: responsive.spacing.md,
  },
  terms: {
    fontSize: responsive.fontSize.xs,
    textAlign: 'center',
    lineHeight: 18,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    fontSize: responsive.fontSize.base,
  },
  signInText: {
    fontSize: responsive.fontSize.base,
    fontWeight: '600',
  },
});
