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
import { useAuthStore } from '../../store/authStore';
import { useTheme } from '../../contexts/ThemeContext';
import { loginSchema } from '../../utils/validation/auth.schemas';
import { responsive } from '../../utils/responsive/responsive';

type LoginMethod = 'email' | 'phone';

export const LoginScreen: React.FC = () => {
  const router = useRouter();
  const { colors } = useTheme();
  const { login, isLoading, error, clearError } = useAuthStore();

  const [loginMethod, setLoginMethod] = useState<LoginMethod>('email');
  const [email, setEmail] = useState('');
  const [phoneE164, setPhoneE164] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleLogin = async () => {
    console.log('[LoginScreen] Starting login process...');
    console.log('[LoginScreen] Login method:', loginMethod);
    console.log('[LoginScreen] Email:', email);
    console.log('[LoginScreen] Phone:', phoneE164);
    console.log('[LoginScreen] Password length:', password.length);

    Keyboard.dismiss();
    clearError();

    // Build form data
    const formData = {
      ...(loginMethod === 'email' ? { email } : { phoneE164 }),
      password,
    };

    console.log('[LoginScreen] Form data:', JSON.stringify(formData, null, 2));

    // Validate
    const result = loginSchema.safeParse(formData);

    if (!result.success) {
      console.log('[LoginScreen] Validation failed:', result.error.errors);
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as string] = err.message;
        }
      });
      setErrors(fieldErrors);
      console.log('[LoginScreen] Field errors:', fieldErrors);
      return;
    }

    console.log('[LoginScreen] Validation passed, attempting login...');

    try {
      await login({
        ...(loginMethod === 'email' ? { email } : { phoneE164 }),
        password,
      });

      console.log('[LoginScreen] Login successful, navigation will be handled by useProtectedRoute hook');
      // Navigation is handled automatically by useProtectedRoute hook in _layout.tsx
    } catch (err) {
      console.error('[LoginScreen] Login error:', err);
      // Error is handled by the store
    }
  };

  const switchToRegister = () => {
    console.log('[LoginScreen] Navigating to register screen...');
    router.push('/(auth)/signup');
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
                <Text style={[styles.title, { color: colors.text }]}>Welcome Back</Text>
                <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                  Sign in to continue
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
                      console.log('[LoginScreen] Switching to email login');
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
                      console.log('[LoginScreen] Switching to phone login');
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

                {/* Email or Phone */}
                {loginMethod === 'email' ? (
                  <Input
                    label="Email"
                    placeholder="Enter your email"
                    value={email}
                    onChangeText={setEmail}
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
                    onChangeText={setPhoneE164}
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
                  onChangeText={setPassword}
                  error={errors.password}
                  isPassword
                  autoCapitalize="none"
                />

                {/* Forgot Password */}
                <TouchableOpacity style={styles.forgotPassword}>
                  <Text style={[styles.forgotPasswordText, { color: colors.primaryLight }]}>
                    Forgot Password?
                  </Text>
                </TouchableOpacity>

                {/* Sign In Button */}
                <Button
                  title={isLoading ? 'Signing In...' : 'Sign In'}
                  onPress={handleLogin}
                  loading={isLoading}
                  disabled={isLoading}
                  variant="primary"
                  size="large"
                  style={styles.loginButton}
                />
              </Card>
            </AnimatedView>

            {/* Footer */}
            <AnimatedView animation="slideUp" delay={350} duration={600}>
              <View style={styles.footer}>
                <Text style={[styles.footerText, { color: colors.textSecondary }]}>
                  Don't have an account?{' '}
                </Text>
                <TouchableOpacity onPress={switchToRegister} activeOpacity={0.7}>
                  <Text style={[styles.signUpText, { color: colors.primaryLight }]}>
                    Sign Up
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
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: responsive.spacing.lg,
  },
  forgotPasswordText: {
    fontSize: responsive.fontSize.sm,
    fontWeight: '600',
  },
  loginButton: {
    marginTop: responsive.spacing.md,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    fontSize: responsive.fontSize.base,
  },
  signUpText: {
    fontSize: responsive.fontSize.base,
    fontWeight: '600',
  },
});
