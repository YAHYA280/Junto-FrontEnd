import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../contexts/ThemeContext';
import { Input } from '../../components/ui';
import dealsApi from '../../services/api/deals.api';
import { CreateHotDealInput } from '../../shared/types/deal';

// Category options
const CATEGORIES = [
  { id: 'food', label: 'Food & Dining', icon: 'restaurant' as const },
  { id: 'transport', label: 'Transport', icon: 'car' as const },
  { id: 'housing', label: 'Housing', icon: 'home' as const },
  { id: 'shopping', label: 'Shopping', icon: 'bag' as const },
  { id: 'services', label: 'Services', icon: 'construct' as const },
];

// Duration options with colors
const DURATIONS = [
  { id: '24h', label: '24 Hours', hours: 24, color: '#EF4444', icon: 'flash' as const },
  { id: '48h', label: '48 Hours', hours: 48, color: '#F59E0B', icon: 'time' as const },
  { id: '72h', label: '72 Hours', hours: 72, color: '#22C55E', icon: 'calendar' as const },
];

export const CreateDealScreen: React.FC = () => {
  const { colors, isDark } = useTheme();
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priceOriginal, setPriceOriginal] = useState('');
  const [priceDeal, setPriceDeal] = useState('');
  const [quantityTotal, setQuantityTotal] = useState('');
  const [merchantName, setMerchantName] = useState('');
  const [redemptionNotes, setRedemptionNotes] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedDuration, setSelectedDuration] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!selectedCategory) {
      newErrors.category = 'Please select a category';
    }

    if (!selectedDuration) {
      newErrors.duration = 'Please select a deal duration';
    }

    if (!priceDeal.trim()) {
      newErrors.priceDeal = 'Deal price is required';
    } else if (isNaN(parseFloat(priceDeal))) {
      newErrors.priceDeal = 'Must be a valid number';
    }

    if (priceOriginal && isNaN(parseFloat(priceOriginal))) {
      newErrors.priceOriginal = 'Must be a valid number';
    }

    if (quantityTotal && isNaN(parseInt(quantityTotal))) {
      newErrors.quantityTotal = 'Must be a valid number';
    }

    if (!merchantName.trim()) {
      newErrors.merchantName = 'Merchant name is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) {
      Alert.alert('Validation Error', 'Please fix the errors before submitting');
      return;
    }

    setIsSubmitting(true);

    try {
      // Calculate start and expiry dates based on selected duration
      const now = new Date();
      const duration = DURATIONS.find(d => d.id === selectedDuration);
      const expiryDate = new Date(now.getTime() + (duration?.hours || 24) * 60 * 60 * 1000);

      const dealData: CreateHotDealInput = {
        title: title.trim(),
        description: description.trim() || undefined,
        currency: 'MAD',
        priceOriginal: priceOriginal ? priceOriginal.trim() : undefined,
        priceDeal: priceDeal.trim(),
        quantityTotal: quantityTotal ? parseInt(quantityTotal) : undefined,
        startsAt: now.toISOString(),
        expiresAt: expiryDate.toISOString(),
        hot: {
          merchantName: merchantName.trim(),
          redemptionNotes: redemptionNotes.trim() || undefined,
          category: selectedCategory,
        },
      };

      const newDeal = await dealsApi.createHotDeal(dealData);

      Alert.alert(
        'Success',
        'Deal created successfully!',
        [
          {
            text: 'OK',
            onPress: () => router.push(`/deals/${newDeal.id}`),
          },
        ]
      );
    } catch (err: any) {
      console.error('[CreateDeal] Error:', err);
      Alert.alert('Error', err.message || 'Failed to create deal');
    } finally {
      setIsSubmitting(false);
    }
  };

  const calculateDiscount = () => {
    if (!priceOriginal || !priceDeal) return null;
    const original = parseFloat(priceOriginal);
    const deal = parseFloat(priceDeal);
    if (isNaN(original) || isNaN(deal) || original === 0) return null;
    return Math.round(((original - deal) / original) * 100);
  };

  const calculateSavings = () => {
    if (!priceOriginal || !priceDeal) return null;
    const original = parseFloat(priceOriginal);
    const deal = parseFloat(priceDeal);
    if (isNaN(original) || isNaN(deal)) return null;
    return (original - deal).toFixed(2);
  };

  const discount = calculateDiscount();
  const savings = calculateSavings();

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
                <Ionicons name="close" size={24} color="#FFFFFF" />
              </TouchableOpacity>

              {/* Title */}
              <Text style={styles.headerTitle}>Create Deal</Text>

              {/* Spacer */}
              <View style={styles.headerSpacer} />
            </LinearGradient>

            {/* Hero Icon (overlapping) */}
            <View style={styles.heroWrapper}>
              <View style={[
                styles.heroIconContainer,
                {
                  backgroundColor: isDark ? colors.surface : '#FFFFFF',
                  borderColor: isDark ? colors.border : '#E5E7EB',
                }
              ]}>
                <LinearGradient
                  colors={[colors.primary, colors.primaryLight]}
                  style={styles.heroIcon}
                >
                  <Ionicons name="pricetag" size={32} color="#FFFFFF" />
                </LinearGradient>
              </View>
              <Text style={[styles.heroTitle, { color: colors.text }]}>
                Post a New Deal
              </Text>
              <Text style={[styles.heroSubtitle, { color: colors.textSecondary }]}>
                Share amazing deals with the community
              </Text>
            </View>
          </View>

          {/* Deal Preview Card */}
          {(title || priceDeal || selectedCategory || selectedDuration) && (
            <View style={[
              styles.previewCard,
              {
                backgroundColor: isDark ? colors.surface : '#FFFFFF',
                borderColor: isDark ? colors.border : '#E5E7EB',
              }
            ]}>
              <View style={styles.previewHeader}>
                <View style={[styles.previewIcon, { backgroundColor: colors.primary + '15' }]}>
                  <Ionicons name="eye" size={16} color={colors.primary} />
                </View>
                <Text style={[styles.previewLabel, { color: colors.textSecondary }]}>
                  Live Preview
                </Text>
              </View>

              <View style={styles.previewContent}>
                {/* Tags Row */}
                <View style={styles.previewTagsRow}>
                  {selectedCategory && (
                    <View style={[styles.categoryBadge, { backgroundColor: colors.primary + '15' }]}>
                      <Ionicons
                        name={CATEGORIES.find(c => c.id === selectedCategory)?.icon || 'pricetag'}
                        size={12}
                        color={colors.primary}
                      />
                      <Text style={[styles.categoryBadgeText, { color: colors.primary }]}>
                        {CATEGORIES.find(c => c.id === selectedCategory)?.label}
                      </Text>
                    </View>
                  )}
                  {selectedDuration && (
                    <View style={[
                      styles.durationBadge,
                      { backgroundColor: DURATIONS.find(d => d.id === selectedDuration)?.color + '15' }
                    ]}>
                      <Ionicons
                        name={DURATIONS.find(d => d.id === selectedDuration)?.icon || 'time'}
                        size={12}
                        color={DURATIONS.find(d => d.id === selectedDuration)?.color}
                      />
                      <Text style={[
                        styles.durationBadgeText,
                        { color: DURATIONS.find(d => d.id === selectedDuration)?.color }
                      ]}>
                        {DURATIONS.find(d => d.id === selectedDuration)?.label}
                      </Text>
                    </View>
                  )}
                </View>

                {merchantName && (
                  <View style={[styles.merchantBadge, { backgroundColor: isDark ? colors.backgroundSecondary : '#F3F4F6' }]}>
                    <Ionicons name="storefront" size={12} color={colors.textSecondary} />
                    <Text style={[styles.merchantBadgeText, { color: colors.textSecondary }]}>
                      {merchantName}
                    </Text>
                  </View>
                )}

                <Text style={[styles.previewTitle, { color: colors.text }]} numberOfLines={2}>
                  {title || 'Your deal title'}
                </Text>

                <View style={styles.previewPriceRow}>
                  {priceOriginal && (
                    <Text style={[styles.previewOriginalPrice, { color: colors.textTertiary }]}>
                      MAD {priceOriginal}
                    </Text>
                  )}
                  <Text style={[styles.previewDealPrice, { color: colors.primary }]}>
                    MAD {priceDeal || '0.00'}
                  </Text>
                  {discount !== null && discount > 0 && (
                    <View style={[styles.discountBadge, { backgroundColor: colors.error }]}>
                      <Text style={styles.discountBadgeText}>-{discount}%</Text>
                    </View>
                  )}
                </View>

                {savings && parseFloat(savings) > 0 && (
                  <View style={[styles.savingsBadge, { backgroundColor: colors.success + '15' }]}>
                    <Ionicons name="trending-down" size={14} color={colors.success} />
                    <Text style={[styles.savingsText, { color: colors.success }]}>
                      Save MAD {savings}
                    </Text>
                  </View>
                )}
              </View>
            </View>
          )}

          {/* Category Selection Card */}
          <View style={[
            styles.card,
            {
              backgroundColor: isDark ? colors.surface : '#FFFFFF',
              borderColor: isDark ? colors.border : '#E5E7EB',
            }
          ]}>
            <View style={styles.cardHeader}>
              <View style={[styles.cardIcon, { backgroundColor: colors.primary + '15' }]}>
                <Ionicons name="grid" size={18} color={colors.primary} />
              </View>
              <Text style={[styles.cardTitle, { color: colors.text }]}>
                Category
              </Text>
            </View>

            <Text style={[styles.selectionLabel, { color: colors.textSecondary }]}>
              What type of deal is this?
            </Text>

            <View style={styles.categoryGrid}>
              {CATEGORIES.map((category) => {
                const isSelected = selectedCategory === category.id;
                return (
                  <TouchableOpacity
                    key={category.id}
                    style={[
                      styles.categoryOption,
                      {
                        backgroundColor: isSelected
                          ? colors.primary + '15'
                          : isDark ? colors.backgroundSecondary : '#F9FAFB',
                        borderColor: isSelected ? colors.primary : (isDark ? colors.border : '#E5E7EB'),
                      }
                    ]}
                    onPress={() => {
                      setSelectedCategory(category.id);
                      if (errors.category) setErrors({ ...errors, category: '' });
                    }}
                    activeOpacity={0.7}
                  >
                    <View style={[
                      styles.categoryIconWrapper,
                      { backgroundColor: isSelected ? colors.primary : colors.textTertiary + '20' }
                    ]}>
                      <Ionicons
                        name={category.icon}
                        size={14}
                        color={isSelected ? '#FFFFFF' : colors.textTertiary}
                      />
                    </View>
                    <Text style={[
                      styles.categoryLabel,
                      { color: isSelected ? colors.primary : colors.text }
                    ]}>
                      {category.label}
                    </Text>
                    {isSelected && (
                      <View style={[styles.checkMark, { backgroundColor: colors.primary }]}>
                        <Ionicons name="checkmark" size={10} color="#FFFFFF" />
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>

            {errors.category && (
              <Text style={[styles.errorText, { color: colors.error }]}>{errors.category}</Text>
            )}
          </View>

          {/* Duration Selection Card */}
          <View style={[
            styles.card,
            {
              backgroundColor: isDark ? colors.surface : '#FFFFFF',
              borderColor: isDark ? colors.border : '#E5E7EB',
            }
          ]}>
            <View style={styles.cardHeader}>
              <View style={[styles.cardIcon, { backgroundColor: colors.warning + '15' }]}>
                <Ionicons name="timer" size={18} color={colors.warning} />
              </View>
              <Text style={[styles.cardTitle, { color: colors.text }]}>
                Deal Duration
              </Text>
            </View>

            <Text style={[styles.selectionLabel, { color: colors.textSecondary }]}>
              How long will this deal be active?
            </Text>

            <View style={styles.durationOptions}>
              {DURATIONS.map((duration) => {
                const isSelected = selectedDuration === duration.id;
                return (
                  <TouchableOpacity
                    key={duration.id}
                    style={[
                      styles.durationOption,
                      {
                        backgroundColor: isSelected
                          ? duration.color + '15'
                          : isDark ? colors.backgroundSecondary : '#F9FAFB',
                        borderColor: isSelected ? duration.color : (isDark ? colors.border : '#E5E7EB'),
                      }
                    ]}
                    onPress={() => {
                      setSelectedDuration(duration.id);
                      if (errors.duration) setErrors({ ...errors, duration: '' });
                    }}
                    activeOpacity={0.7}
                  >
                    <View style={[
                      styles.durationIconWrapper,
                      { backgroundColor: isSelected ? duration.color : colors.textTertiary + '20' }
                    ]}>
                      <Ionicons
                        name={duration.icon}
                        size={16}
                        color={isSelected ? '#FFFFFF' : colors.textTertiary}
                      />
                    </View>
                    <Text style={[
                      styles.durationLabel,
                      { color: isSelected ? duration.color : colors.text }
                    ]}>
                      {duration.label}
                    </Text>
                    <Text style={[styles.durationHint, { color: colors.textTertiary }]}>
                      {duration.id === '24h' ? 'Flash' : duration.id === '48h' ? 'Limited' : 'Extended'}
                    </Text>
                    {isSelected && (
                      <View style={[styles.durationCheckMark, { backgroundColor: duration.color }]}>
                        <Ionicons name="checkmark" size={10} color="#FFFFFF" />
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>

            {errors.duration && (
              <Text style={[styles.errorText, { color: colors.error }]}>{errors.duration}</Text>
            )}
          </View>

          {/* Basic Information Card */}
          <View style={[
            styles.card,
            {
              backgroundColor: isDark ? colors.surface : '#FFFFFF',
              borderColor: isDark ? colors.border : '#E5E7EB',
            }
          ]}>
            <View style={styles.cardHeader}>
              <View style={[styles.cardIcon, { backgroundColor: colors.info + '15' }]}>
                <Ionicons name="document-text" size={18} color={colors.info} />
              </View>
              <Text style={[styles.cardTitle, { color: colors.text }]}>
                Basic Information
              </Text>
            </View>

            <Input
              label="Deal Title"
              placeholder="e.g., 50% Off Premium Coffee"
              value={title}
              onChangeText={(text) => {
                setTitle(text);
                if (errors.title) setErrors({ ...errors, title: '' });
              }}
              error={errors.title}
              maxLength={100}
              leftIcon="create-outline"
            />

            <Input
              label="Description"
              placeholder="Describe the deal in detail..."
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={4}
              leftIcon="reader-outline"
            />

            <Input
              label="Merchant Name"
              placeholder="e.g., Café Premium"
              value={merchantName}
              onChangeText={(text) => {
                setMerchantName(text);
                if (errors.merchantName) setErrors({ ...errors, merchantName: '' });
              }}
              error={errors.merchantName}
              leftIcon="storefront-outline"
            />
          </View>

          {/* Pricing Card */}
          <View style={[
            styles.card,
            {
              backgroundColor: isDark ? colors.surface : '#FFFFFF',
              borderColor: isDark ? colors.border : '#E5E7EB',
            }
          ]}>
            <View style={styles.cardHeader}>
              <View style={[styles.cardIcon, { backgroundColor: colors.success + '15' }]}>
                <Ionicons name="cash" size={18} color={colors.success} />
              </View>
              <Text style={[styles.cardTitle, { color: colors.text }]}>
                Pricing
              </Text>
            </View>

            <View style={styles.priceRow}>
              <View style={styles.priceInputWrapper}>
                <Input
                  label="Original Price"
                  placeholder="100.00"
                  value={priceOriginal}
                  onChangeText={(text) => {
                    setPriceOriginal(text);
                    if (errors.priceOriginal) setErrors({ ...errors, priceOriginal: '' });
                  }}
                  error={errors.priceOriginal}
                  keyboardType="decimal-pad"
                  leftIcon="cash-outline"
                />
              </View>

              <View style={styles.priceInputWrapper}>
                <Input
                  label="Deal Price"
                  placeholder="50.00"
                  value={priceDeal}
                  onChangeText={(text) => {
                    setPriceDeal(text);
                    if (errors.priceDeal) setErrors({ ...errors, priceDeal: '' });
                  }}
                  error={errors.priceDeal}
                  keyboardType="decimal-pad"
                  leftIcon="pricetag-outline"
                />
              </View>
            </View>

            <Input
              label="Quantity Available"
              placeholder="100"
              value={quantityTotal}
              onChangeText={(text) => {
                setQuantityTotal(text);
                if (errors.quantityTotal) setErrors({ ...errors, quantityTotal: '' });
              }}
              error={errors.quantityTotal}
              keyboardType="number-pad"
              leftIcon="cube-outline"
            />
          </View>

          {/* Redemption Card */}
          <View style={[
            styles.card,
            {
              backgroundColor: isDark ? colors.surface : '#FFFFFF',
              borderColor: isDark ? colors.border : '#E5E7EB',
            }
          ]}>
            <View style={styles.cardHeader}>
              <View style={[styles.cardIcon, { backgroundColor: colors.info + '15' }]}>
                <Ionicons name="receipt" size={18} color={colors.info} />
              </View>
              <Text style={[styles.cardTitle, { color: colors.text }]}>
                How to Redeem
              </Text>
            </View>

            <Input
              label="Redemption Instructions"
              placeholder="e.g., Show this deal at checkout to receive your discount..."
              value={redemptionNotes}
              onChangeText={setRedemptionNotes}
              multiline
              numberOfLines={4}
              leftIcon="help-circle-outline"
            />

            <View style={[styles.infoNote, { backgroundColor: colors.info + '10' }]}>
              <Ionicons name="information-circle" size={18} color={colors.info} />
              <Text style={[styles.infoNoteText, { color: colors.info }]}>
                Provide clear instructions on how customers can claim this deal
              </Text>
            </View>
          </View>

          {/* Submit Button */}
          <View style={styles.buttonSection}>
            <TouchableOpacity
              style={styles.submitButtonWrapper}
              onPress={handleSubmit}
              disabled={isSubmitting}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={[colors.primary, colors.primaryLight]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.submitButton}
              >
                {isSubmitting ? (
                  <Text style={styles.submitButtonText}>Creating Deal...</Text>
                ) : (
                  <>
                    <Ionicons name="add-circle" size={22} color="#FFFFFF" />
                    <Text style={styles.submitButtonText}>Create Deal</Text>
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
              disabled={isSubmitting}
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

  // Header Section
  headerSection: {
    marginBottom: 16,
  },
  headerGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 12,
    paddingBottom: 50,
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
  headerSpacer: {
    width: 40,
  },

  // Hero Section
  heroWrapper: {
    alignItems: 'center',
    marginTop: -35,
  },
  heroIconContainer: {
    padding: 6,
    borderRadius: 40,
    borderWidth: 1,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  heroIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginTop: 12,
  },
  heroSubtitle: {
    fontSize: 14,
    marginTop: 4,
  },

  // Preview Card
  previewCard: {
    marginHorizontal: 20,
    marginBottom: 16,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  previewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  previewIcon: {
    width: 28,
    height: 28,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewLabel: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  previewContent: {
    gap: 10,
  },
  merchantBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
    gap: 5,
  },
  merchantBadgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  previewTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  previewPriceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  previewOriginalPrice: {
    fontSize: 14,
    textDecorationLine: 'line-through',
  },
  previewDealPrice: {
    fontSize: 22,
    fontWeight: '700',
  },
  discountBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  discountBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  savingsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 6,
  },
  savingsText: {
    fontSize: 13,
    fontWeight: '600',
  },
  previewTagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 8,
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
    gap: 5,
  },
  categoryBadgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  durationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
    gap: 5,
  },
  durationBadgeText: {
    fontSize: 12,
    fontWeight: '600',
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

  // Selection Label
  selectionLabel: {
    fontSize: 14,
    marginBottom: 16,
  },

  // Category Grid
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryOption: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1.5,
    gap: 8,
    position: 'relative',
  },
  categoryIconWrapper: {
    width: 28,
    height: 28,
    borderRadius: 7,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryLabel: {
    flex: 1,
    fontSize: 12,
    fontWeight: '600',
  },
  checkMark: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 16,
    height: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Duration Options
  durationOptions: {
    flexDirection: 'row',
    gap: 8,
  },
  durationOption: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 10,
    borderWidth: 1.5,
    gap: 4,
    position: 'relative',
  },
  durationIconWrapper: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  durationLabel: {
    fontSize: 12,
    fontWeight: '700',
  },
  durationHint: {
    fontSize: 10,
    fontWeight: '500',
  },
  durationCheckMark: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 16,
    height: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Error Text
  errorText: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 8,
  },

  // Price Row
  priceRow: {
    flexDirection: 'row',
    gap: 12,
  },
  priceInputWrapper: {
    flex: 1,
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

  // Buttons
  buttonSection: {
    paddingHorizontal: 20,
    gap: 12,
    marginTop: 8,
  },
  submitButtonWrapper: {
    borderRadius: 14,
    overflow: 'hidden',
    shadowColor: '#059669',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 8,
  },
  submitButtonText: {
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
