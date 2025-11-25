import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Animated,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Dimensions,
  Keyboard,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { FontAwesome5 } from '@expo/vector-icons';
import { useAuthStore } from '../../shared/store/authStore';
import { spacing, borderRadius, fontSize, fontWeight, shadows } from '../../shared/constants/theme';
import { useAppTheme } from '../../shared/hooks/useAppTheme';
import { GlassCard, GlassButton } from '../../shared/components';

const { height } = Dimensions.get('window');

export default function LoginScreen() {
  const [email, setEmail] = useState('Loisbecket@gmail.com');
  const [password, setPassword] = useState('password123');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const { login, isLoading, error } = useAuthStore();
  const theme = useAppTheme();
  const router = useRouter();

  // Animations
  const cardSlideAnim = useRef(new Animated.Value(50)).current;
  const cardFadeAnim = useRef(new Animated.Value(0)).current;
  const keyboardOffsetAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(cardSlideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(cardFadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();

    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      (event) => {
        const keyboardHeight = event.endCoordinates.height;
        const offset = Platform.OS === 'ios' ? -keyboardHeight * 0.05 : -keyboardHeight * 0.2;

        Animated.timing(keyboardOffsetAnim, {
          toValue: offset,
          duration: 250,
          useNativeDriver: true,
        }).start();
      }
    );

    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      Animated.timing(keyboardOffsetAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }).start();
    });

    return () => {
      keyboardDidShowListener?.remove();
      keyboardDidHideListener?.remove();
    };
  }, []);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {};

    if (!validateEmail(email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    try {
      await login(email, password);
      router.replace('/(tabs)');
    } catch (error) {
      Alert.alert('Error', 'Login failed. Please try again.');
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      <View style={styles.screenContainer}>
        {/* Header Background */}
        <View style={[styles.header, { backgroundColor: theme.colors.primary }]}>
          <View style={styles.headerContent}>
            <FontAwesome5 name="store-alt" size={48} color="#FFFFFF" />
          </View>
        </View>

        {/* Main Card */}
        <Animated.View
          style={[
            styles.card,
            { backgroundColor: theme.colors.background },
            {
              opacity: cardFadeAnim,
              transform: [{ translateY: cardSlideAnim }, { translateY: keyboardOffsetAnim }],
            },
          ]}
        >
          {/* Header */}
          <View style={styles.cardHeader}>
            <Text style={[styles.title, { color: theme.colors.text }]}>Welcome Back!</Text>
            <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>Sign in to continue to Junto</Text>
          </View>

          {/* Form */}
          <View style={styles.formContainer}>
            {/* Email Input */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: theme.colors.text }]}>Email Address</Text>
              <View style={[styles.inputContainer, { backgroundColor: theme.colors.backgroundSecondary, borderColor: theme.colors.border }, errors.email && { borderColor: theme.colors.error }]}>
                <FontAwesome5 name="envelope" size={16} color={theme.colors.textSecondary} style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, { color: theme.colors.text }]}
                  placeholder="Enter your email"
                  placeholderTextColor={theme.colors.textTertiary}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>
              {errors.email && <Text style={[styles.errorText, { color: theme.colors.error }]}>{errors.email}</Text>}
            </View>

            {/* Password Input */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: theme.colors.text }]}>Password</Text>
              <View style={[styles.inputContainer, { backgroundColor: theme.colors.backgroundSecondary, borderColor: theme.colors.border }, errors.password && { borderColor: theme.colors.error }]}>
                <FontAwesome5 name="lock" size={16} color={theme.colors.textSecondary} style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, { color: theme.colors.text }]}
                  placeholder="Enter your password"
                  placeholderTextColor={theme.colors.textTertiary}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
                  <FontAwesome5 name={showPassword ? 'eye' : 'eye-slash'} size={16} color={theme.colors.textSecondary} />
                </TouchableOpacity>
              </View>
              {errors.password && <Text style={[styles.errorText, { color: theme.colors.error }]}>{errors.password}</Text>}
            </View>

            {/* Remember Me & Forgot Password */}
            <View style={styles.optionsContainer}>
              <TouchableOpacity style={styles.checkboxContainer} onPress={() => setRememberMe(!rememberMe)}>
                <View style={[styles.checkbox, { borderColor: theme.colors.border }, rememberMe && { backgroundColor: theme.colors.primary, borderColor: theme.colors.primary }]}>
                  {rememberMe && <FontAwesome5 name="check" size={12} color="#FFFFFF" />}
                </View>
                <Text style={[styles.checkboxLabel, { color: theme.colors.textSecondary }]}>Remember me</Text>
              </TouchableOpacity>

              <TouchableOpacity>
                <Text style={[styles.forgotPassword, { color: theme.colors.primary }]}>Forgot Password?</Text>
              </TouchableOpacity>
            </View>

            {/* Error Message */}
            {error && (
              <View style={styles.errorContainer}>
                <FontAwesome5 name="exclamation-circle" size={16} color={theme.colors.error} />
                <Text style={[styles.errorMessageText, { color: theme.colors.error }]}>{error}</Text>
              </View>
            )}

            {/* Login Button */}
            <GlassButton
              title="Sign In"
              onPress={handleLogin}
              loading={isLoading}
              disabled={isLoading}
              variant="primary"
              size="large"
              icon={!isLoading && <FontAwesome5 name="arrow-right" size={16} color="#FFFFFF" />}
              style={{ marginBottom: spacing.lg }}
            />

            {/* Divider */}
            <View style={styles.divider}>
              <View style={[styles.dividerLine, { backgroundColor: theme.colors.border }]} />
              <Text style={[styles.dividerText, { color: theme.colors.textSecondary }]}>or continue with</Text>
              <View style={[styles.dividerLine, { backgroundColor: theme.colors.border }]} />
            </View>

            {/* Social Login Buttons */}
            <View style={styles.socialButtons}>
              <GlassCard
                onPress={() => Alert.alert('Google Login', 'Google login coming soon')}
                style={styles.socialButton}
              >
                <FontAwesome5 name="google" size={20} color="#DB4437" />
              </GlassCard>
              <GlassCard
                onPress={() => Alert.alert('Facebook Login', 'Facebook login coming soon')}
                style={styles.socialButton}
              >
                <FontAwesome5 name="facebook" size={20} color="#4267B2" />
              </GlassCard>
              <GlassCard
                onPress={() => Alert.alert('Apple Login', 'Apple login coming soon')}
                style={styles.socialButton}
              >
                <FontAwesome5 name="apple" size={20} color="#000000" />
              </GlassCard>
            </View>

            {/* Sign Up Link */}
            <View style={styles.signupContainer}>
              <Text style={[styles.signupText, { color: theme.colors.textSecondary }]}>Don't have an account? </Text>
              <TouchableOpacity>
                <Text style={[styles.signupLink, { color: theme.colors.primary }]}>Sign Up</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  screenContainer: {
    flex: 1,
  },
  header: {
    height: 180,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    paddingTop: 60,
  },
  headerContent: {
    alignItems: 'center',
  },
  card: {
    marginHorizontal: spacing.lg,
    marginTop: -60,
    borderRadius: borderRadius['2xl'],
    padding: spacing.lg,
    ...shadows.xl,
    minHeight: Platform.OS === 'ios' ? height * 0.7 : height * 0.8,
  },
  cardHeader: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  title: {
    fontSize: fontSize['3xl'],
    fontWeight: fontWeight.bold,
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: fontSize.base,
  },
  formContainer: {
    flex: 1,
  },
  inputGroup: {
    marginBottom: spacing.lg,
  },
  label: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
    marginBottom: spacing.sm,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: borderRadius.md,
    borderWidth: 1,
    paddingHorizontal: spacing.md,
    height: 56,
  },
  inputIcon: {
    marginRight: spacing.sm,
  },
  input: {
    flex: 1,
    fontSize: fontSize.base,
  },
  eyeIcon: {
    padding: spacing.sm,
  },
  errorText: {
    fontSize: fontSize.xs,
    marginTop: spacing.xs,
  },
  optionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  checkboxLabel: {
    fontSize: fontSize.sm,
  },
  forgotPassword: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEE2E2',
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginBottom: spacing.lg,
  },
  errorMessageText: {
    fontSize: fontSize.sm,
    marginLeft: spacing.sm,
    flex: 1,
  },
  loginButton: {
    borderRadius: borderRadius.md,
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.md,
  },
  loginButtonDisabled: {
    opacity: 0.6,
  },
  loginButtonText: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: '#FFFFFF',
  },
  buttonIcon: {
    marginLeft: spacing.sm,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: spacing.xl,
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    fontSize: fontSize.sm,
    marginHorizontal: spacing.md,
  },
  socialButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  socialButton: {
    width: 56,
    height: 56,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  signupText: {
    fontSize: fontSize.sm,
  },
  signupLink: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.bold,
  },
});
