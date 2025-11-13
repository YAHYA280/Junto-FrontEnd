import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import { Card, AnimatedView } from '../../components/ui';
import { useAuthStore } from '../../store/authStore';
import dealsApi from '../../services/api/deals.api';
import { HotDeal } from '../../shared/types/deal';
import { responsive } from '../../utils/responsive/responsive';

export const DealDetailsScreen: React.FC = () => {
  const { colors } = useTheme();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user } = useAuthStore();

  const [deal, setDeal] = useState<HotDeal | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isSeller = user?.roles?.includes('SELLER' as any);
  const isOwner = deal?.sellerId === user?.id;

  useEffect(() => {
    loadDeal();
  }, [id]);

  const loadDeal = async () => {
    if (!id) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await dealsApi.getHotDeal(id as string);
      setDeal(response.deal);
    } catch (err: any) {
      console.error('[DealDetails] Error loading deal:', err);
      setError(err.message || 'Failed to load deal');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Deal',
      'Are you sure you want to delete this deal? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await dealsApi.deleteHotDeal(id as string);
              Alert.alert('Success', 'Deal deleted successfully');
              router.back();
            } catch (err: any) {
              Alert.alert('Error', err.message || 'Failed to delete deal');
            }
          },
        },
      ]
    );
  };

  const handleEdit = () => {
    router.push(`/deals/edit/${id}`);
  };

  const calculateDiscount = () => {
    if (!deal?.priceOriginal || !deal?.priceDeal) return null;
    const original = parseFloat(deal.priceOriginal);
    const dealPrice = parseFloat(deal.priceDeal);
    if (isNaN(original) || isNaN(dealPrice)) return null;
    return Math.round(((original - dealPrice) / original) * 100);
  };

  const formatPrice = (price?: string) => {
    if (!price) return 'N/A';
    return `${deal?.currency || '$'}${parseFloat(price).toFixed(2)}`;
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (isLoading) {
    return (
      <View style={[styles.container, styles.centered, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
          Loading deal...
        </Text>
      </View>
    );
  }

  if (error || !deal) {
    return (
      <View style={[styles.container, styles.centered, { backgroundColor: colors.background }]}>
        <Ionicons name="alert-circle-outline" size={64} color={colors.error} />
        <Text style={[styles.errorText, { color: colors.error }]}>
          {error || 'Deal not found'}
        </Text>
        <TouchableOpacity
          style={[styles.retryButton, { backgroundColor: colors.primary }]}
          onPress={loadDeal}
        >
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const discount = calculateDiscount();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.surface }]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Deal Details</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Card with Glassmorphism */}
        <AnimatedView animation="fade" duration={500}>
          <Card
            variant="glass"
            style={[
              styles.heroCard,
              {
                backgroundColor: colors.glassBackground,
                borderColor: colors.glassBorder,
                shadowColor: colors.shadow,
              },
            ]}
          >
            {/* Discount Badge */}
            {discount && (
              <View style={[styles.discountBadge, { backgroundColor: colors.error }]}>
                <Text style={styles.discountText}>-{discount}%</Text>
              </View>
            )}

            {/* Icon Placeholder */}
            <View
              style={[styles.iconContainer, { backgroundColor: colors.primary + '22' }]}
            >
              <Ionicons name="pricetag" size={64} color={colors.primary} />
            </View>

            {/* Title */}
            <Text style={[styles.title, { color: colors.text }]}>{deal.title}</Text>

            {/* Merchant */}
            {deal.hot?.merchantName && (
              <View style={styles.merchantRow}>
                <Ionicons name="storefront" size={20} color={colors.primary} />
                <Text style={[styles.merchantName, { color: colors.primary }]}>
                  {deal.hot.merchantName}
                </Text>
              </View>
            )}
          </Card>
        </AnimatedView>

        {/* Price Card */}
        <AnimatedView animation="slideUp" delay={100} duration={500}>
          <Card
            variant="elevated"
            style={[styles.priceCard, { shadowColor: colors.shadow }]}
          >
            <View style={styles.priceRow}>
              <View style={styles.priceColumn}>
                {deal.priceOriginal && (
                  <>
                    <Text style={[styles.priceLabel, { color: colors.textTertiary }]}>
                      Original Price
                    </Text>
                    <Text
                      style={[
                        styles.originalPrice,
                        { color: colors.textTertiary, textDecorationColor: colors.textTertiary },
                      ]}
                    >
                      {formatPrice(deal.priceOriginal)}
                    </Text>
                  </>
                )}
              </View>

              <View style={styles.priceColumn}>
                <Text style={[styles.priceLabel, { color: colors.textSecondary }]}>
                  Deal Price
                </Text>
                <Text style={[styles.dealPrice, { color: colors.primary }]}>
                  {formatPrice(deal.priceDeal)}
                </Text>
              </View>
            </View>

            {deal.priceOriginal && deal.priceDeal && (
              <View style={styles.savingsRow}>
                <Ionicons name="trending-down" size={20} color={colors.success} />
                <Text style={[styles.savingsText, { color: colors.success }]}>
                  You save{' '}
                  {formatPrice(
                    (parseFloat(deal.priceOriginal) - parseFloat(deal.priceDeal)).toString()
                  )}
                </Text>
              </View>
            )}
          </Card>
        </AnimatedView>

        {/* Description Card */}
        {deal.description && (
          <AnimatedView animation="slideUp" delay={200} duration={500}>
            <Card variant="elevated" style={[styles.section, { shadowColor: colors.shadow }]}>
              <View style={styles.sectionHeader}>
                <Ionicons name="document-text-outline" size={24} color={colors.primary} />
                <Text style={[styles.sectionTitle, { color: colors.text }]}>Description</Text>
              </View>
              <Text style={[styles.description, { color: colors.textSecondary }]}>
                {deal.description}
              </Text>
            </Card>
          </AnimatedView>
        )}

        {/* Details Card */}
        <AnimatedView animation="slideUp" delay={300} duration={500}>
          <Card variant="elevated" style={[styles.section, { shadowColor: colors.shadow }]}>
            <View style={styles.sectionHeader}>
              <Ionicons name="information-circle-outline" size={24} color={colors.primary} />
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Deal Information</Text>
            </View>

            <View style={styles.detailRow}>
              <Ionicons name="calendar-outline" size={20} color={colors.textTertiary} />
              <View style={styles.detailContent}>
                <Text style={[styles.detailLabel, { color: colors.textTertiary }]}>
                  Valid From
                </Text>
                <Text style={[styles.detailValue, { color: colors.text }]}>
                  {formatDate(deal.startsAt)}
                </Text>
              </View>
            </View>

            <View style={styles.detailRow}>
              <Ionicons name="calendar-outline" size={20} color={colors.textTertiary} />
              <View style={styles.detailContent}>
                <Text style={[styles.detailLabel, { color: colors.textTertiary }]}>
                  Expires On
                </Text>
                <Text style={[styles.detailValue, { color: colors.text }]}>
                  {formatDate(deal.expiresAt)}
                </Text>
              </View>
            </View>

            {deal.quantityTotal && (
              <View style={styles.detailRow}>
                <Ionicons name="cube-outline" size={20} color={colors.textTertiary} />
                <View style={styles.detailContent}>
                  <Text style={[styles.detailLabel, { color: colors.textTertiary }]}>
                    Available Quantity
                  </Text>
                  <Text style={[styles.detailValue, { color: colors.text }]}>
                    {deal.quantityTotal} items
                  </Text>
                </View>
              </View>
            )}
          </Card>
        </AnimatedView>

        {/* Redemption Notes */}
        {deal.hot?.redemptionNotes && (
          <AnimatedView animation="slideUp" delay={400} duration={500}>
            <Card
              variant="elevated"
              style={[
                styles.section,
                { backgroundColor: colors.info + '11', shadowColor: colors.shadow },
              ]}
            >
              <View style={styles.sectionHeader}>
                <Ionicons name="receipt-outline" size={24} color={colors.info} />
                <Text style={[styles.sectionTitle, { color: colors.text }]}>
                  How to Redeem
                </Text>
              </View>
              <Text style={[styles.redemptionNotes, { color: colors.textSecondary }]}>
                {deal.hot.redemptionNotes}
              </Text>
            </Card>
          </AnimatedView>
        )}

        {/* Action Buttons - Only for sellers who own the deal */}
        {isSeller && isOwner && (
          <AnimatedView animation="slideUp" delay={500} duration={500}>
            <View style={styles.actionsContainer}>
              <TouchableOpacity
                style={[styles.editButton, { backgroundColor: colors.primary }]}
                onPress={handleEdit}
                activeOpacity={0.7}
              >
                <Ionicons name="create-outline" size={20} color={colors.textInverse} />
                <Text style={[styles.editButtonText, { color: colors.textInverse }]}>
                  Edit Deal
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.deleteButton, { backgroundColor: colors.error }]}
                onPress={handleDelete}
                activeOpacity={0.7}
              >
                <Ionicons name="trash-outline" size={20} color={colors.textInverse} />
                <Text style={[styles.deleteButtonText, { color: colors.textInverse }]}>
                  Delete
                </Text>
              </TouchableOpacity>
            </View>
          </AnimatedView>
        )}

        {/* Get Deal Button - For buyers */}
        {!isOwner && (
          <AnimatedView animation="scale" delay={500} duration={500}>
            <TouchableOpacity
              style={[
                styles.getDealButton,
                {
                  backgroundColor: colors.primary,
                  shadowColor: colors.shadow,
                },
              ]}
              activeOpacity={0.8}
            >
              <Text style={[styles.getDealButtonText, { color: colors.textInverse }]}>
                Get This Deal
              </Text>
              <Ionicons name="arrow-forward" size={20} color={colors.textInverse} />
            </TouchableOpacity>
          </AnimatedView>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: responsive.spacing.md,
    paddingVertical: responsive.spacing.sm,
    paddingTop: responsive.spacing.xxl + responsive.spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  backButton: {
    padding: responsive.spacing.sm,
  },
  headerTitle: {
    fontSize: responsive.fontSize.lg,
    fontWeight: '600',
  },
  placeholder: {
    width: responsive.spacing.xl + responsive.spacing.sm,
  },
  scrollContent: {
    padding: responsive.spacing.md,
  },
  heroCard: {
    alignItems: 'center',
    padding: 24,
    marginBottom: 16,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  discountBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  discountText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 12,
  },
  merchantRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  merchantName: {
    fontSize: 16,
    fontWeight: '600',
  },
  priceCard: {
    padding: 20,
    marginBottom: 16,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  priceColumn: {
    alignItems: 'center',
  },
  priceLabel: {
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  originalPrice: {
    fontSize: 20,
    fontWeight: '600',
    textDecorationLine: 'line-through',
  },
  dealPrice: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  savingsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
  savingsText: {
    fontSize: 16,
    fontWeight: '600',
  },
  section: {
    padding: 20,
    marginBottom: 16,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  description: {
    fontSize: 15,
    lineHeight: 22,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 16,
  },
  detailContent: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  redemptionNotes: {
    fontSize: 15,
    lineHeight: 22,
  },
  actionsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  editButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
    borderRadius: 12,
  },
  editButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  deleteButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
    borderRadius: 12,
  },
  deleteButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  getDealButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    paddingVertical: 18,
    borderRadius: 16,
    marginBottom: 16,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6,
  },
  getDealButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
  errorText: {
    marginTop: 16,
    fontSize: 16,
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 20,
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
