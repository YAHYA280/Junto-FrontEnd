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
import { useTheme } from '../../contexts/ThemeContext';
import { Card, Input, Button, AnimatedView } from '../../components/ui';
import dealsApi from '../../services/api/deals.api';
import { CreateHotDealInput } from '../../shared/types/deal';

export const CreateDealScreen: React.FC = () => {
  const { colors } = useTheme();
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priceOriginal, setPriceOriginal] = useState('');
  const [priceDeal, setPriceDeal] = useState('');
  const [currency, setCurrency] = useState('MAD');
  const [quantityTotal, setQuantityTotal] = useState('');
  const [merchantName, setMerchantName] = useState('');
  const [redemptionNotes, setRedemptionNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!priceDeal.trim()) {
      newErrors.priceDeal = 'Deal price is required';
    } else if (isNaN(parseFloat(priceDeal))) {
      newErrors.priceDeal = 'Must be a valid number';
    }

    if (!currency.trim()) {
      newErrors.currency = 'Currency is required';
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
      const dealData: CreateHotDealInput = {
        title: title.trim(),
        description: description.trim() || undefined,
        currency: currency.trim(),
        priceOriginal: priceOriginal ? priceOriginal.trim() : undefined,
        priceDeal: priceDeal.trim(),
        quantityTotal: quantityTotal ? parseInt(quantityTotal) : undefined,
        hot: {
          merchantName: merchantName.trim(),
          redemptionNotes: redemptionNotes.trim() || undefined,
        },
      };

      const response = await dealsApi.createHotDeal(dealData);

      Alert.alert(
        'Success',
        'Deal created successfully!',
        [
          {
            text: 'OK',
            onPress: () => router.push(`/deals/${response.deal.id}`),
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

  const discount = calculateDiscount();

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.surface }]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <Ionicons name="close" size={28} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Create Deal</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Hero Card */}
        <AnimatedView animation="fade" duration={500}>
          <Card
            variant="glass"
            style={[
              styles.heroCard,
              {
                backgroundColor: colors.glassBackground,
                borderColor: colors.glassBorder,
              },
            ]}
          >
            <View
              style={[styles.iconContainer, { backgroundColor: colors.primary + '22' }]}
            >
              <Ionicons name="add-circle" size={48} color={colors.primary} />
            </View>
            <Text style={[styles.heroTitle, { color: colors.text }]}>
              Post a New Hot Deal
            </Text>
            <Text style={[styles.heroSubtitle, { color: colors.textSecondary }]}>
              Share amazing deals with the community
            </Text>
          </Card>
        </AnimatedView>

        {/* Basic Information */}
        <AnimatedView animation="slideUp" delay={100} duration={500}>
          <Card variant="elevated" style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="information-circle" size={24} color={colors.primary} />
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                Basic Information
              </Text>
            </View>

            <Input
              label="Deal Title *"
              placeholder="e.g., 50% Off Premium Coffee"
              value={title}
              onChangeText={(text) => {
                setTitle(text);
                if (errors.title) setErrors({ ...errors, title: '' });
              }}
              error={errors.title}
              maxLength={100}
            />

            <Input
              label="Description"
              placeholder="Describe the deal in detail..."
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={4}
              style={styles.textArea}
            />

            <Input
              label="Merchant Name *"
              placeholder="e.g., Café Premium"
              value={merchantName}
              onChangeText={(text) => {
                setMerchantName(text);
                if (errors.merchantName) setErrors({ ...errors, merchantName: '' });
              }}
              error={errors.merchantName}
              leftIcon="storefront-outline"
            />
          </Card>
        </AnimatedView>

        {/* Pricing */}
        <AnimatedView animation="slideUp" delay={200} duration={500}>
          <Card variant="elevated" style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="pricetag" size={24} color={colors.primary} />
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Pricing</Text>
            </View>

            {/* Discount Preview */}
            {discount !== null && discount > 0 && (
              <View
                style={[
                  styles.discountPreview,
                  { backgroundColor: colors.success + '22', borderColor: colors.success },
                ]}
              >
                <Ionicons name="trending-down" size={24} color={colors.success} />
                <Text style={[styles.discountPreviewText, { color: colors.success }]}>
                  {discount}% OFF
                </Text>
              </View>
            )}

            <View style={styles.row}>
              <View style={styles.priceInput}>
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

              <View style={styles.priceInput}>
                <Input
                  label="Deal Price *"
                  placeholder="50.00"
                  value={priceDeal}
                  onChangeText={(text) => {
                    setPriceDeal(text);
                    if (errors.priceDeal) setErrors({ ...errors, priceDeal: '' });
                  }}
                  error={errors.priceDeal}
                  keyboardType="decimal-pad"
                  leftIcon="cash-outline"
                />
              </View>
            </View>

            <View style={styles.row}>
              <View style={styles.currencyInput}>
                <Input
                  label="Currency *"
                  placeholder="MAD"
                  value={currency}
                  onChangeText={(text) => {
                    setCurrency(text.toUpperCase());
                    if (errors.currency) setErrors({ ...errors, currency: '' });
                  }}
                  error={errors.currency}
                  maxLength={3}
                  autoCapitalize="characters"
                />
              </View>

              <View style={styles.quantityInput}>
                <Input
                  label="Quantity"
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
            </View>
          </Card>
        </AnimatedView>

        {/* Redemption Details */}
        <AnimatedView animation="slideUp" delay={300} duration={500}>
          <Card variant="elevated" style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="receipt" size={24} color={colors.primary} />
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                Redemption Details
              </Text>
            </View>

            <Input
              label="How to Redeem"
              placeholder="e.g., Show this deal at checkout to receive your discount..."
              value={redemptionNotes}
              onChangeText={setRedemptionNotes}
              multiline
              numberOfLines={4}
              style={styles.textArea}
              leftIcon="help-circle-outline"
            />

            <View
              style={[
                styles.infoBox,
                { backgroundColor: colors.info + '11', borderColor: colors.info + '44' },
              ]}
            >
              <Ionicons name="information-circle" size={20} color={colors.info} />
              <Text style={[styles.infoText, { color: colors.textSecondary }]}>
                Provide clear instructions on how customers can claim this deal
              </Text>
            </View>
          </Card>
        </AnimatedView>

        {/* Submit Button */}
        <AnimatedView animation="scale" delay={400} duration={500}>
          <Button
            title={isSubmitting ? 'Creating Deal...' : 'Create Deal'}
            onPress={handleSubmit}
            loading={isSubmitting}
            disabled={isSubmitting}
            variant="primary"
            size="large"
            style={[
              styles.submitButton,
              {
                backgroundColor: colors.primary,
                shadowColor: colors.shadow,
              },
            ]}
          />
        </AnimatedView>

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingTop: 48,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  placeholder: {
    width: 44,
  },
  scrollContent: {
    padding: 16,
  },
  heroCard: {
    alignItems: 'center',
    padding: 32,
    marginBottom: 20,
    borderWidth: 1,
  },
  iconContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  heroSubtitle: {
    fontSize: 14,
    textAlign: 'center',
  },
  section: {
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  priceInput: {
    flex: 1,
  },
  currencyInput: {
    flex: 1,
  },
  quantityInput: {
    flex: 1,
  },
  discountPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    marginBottom: 16,
  },
  discountPreviewText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginTop: 12,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },
  submitButton: {
    marginTop: 8,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6,
  },
  bottomSpacer: {
    height: 40,
  },
});
