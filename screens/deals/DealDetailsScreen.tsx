import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Dimensions,
  Share,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuthStore } from '../../store/authStore';
import dealsApi from '../../services/api/deals.api';
import { HotDeal } from '../../shared/types/deal';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const IMAGE_HEIGHT = SCREEN_WIDTH * 0.65;

export const DealDetailsScreen: React.FC = () => {
  const { colors, isDark } = useTheme();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user } = useAuthStore();
  const insets = useSafeAreaInsets();

  const [deal, setDeal] = useState<HotDeal | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);

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
      const dealData = await dealsApi.getHotDeal(id as string);
      setDeal(dealData);
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

  const handleGetDeal = () => {
    if (deal?.externalLink) {
      Alert.alert('Get Deal', 'This will redirect you to the merchant website.');
    } else {
      Alert.alert('Deal Claimed', 'You have successfully claimed this deal!');
    }
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out this deal: ${deal?.title} - Save ${calculateDiscount()}%!`,
        title: deal?.title,
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const handleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  const calculateDiscount = () => {
    if (!deal?.priceOriginal || !deal?.priceDeal) return null;
    const original = parseFloat(deal.priceOriginal);
    const dealPrice = parseFloat(deal.priceDeal);
    if (isNaN(original) || isNaN(dealPrice) || original === 0) return null;
    return Math.round(((original - dealPrice) / original) * 100);
  };

  const formatPrice = (price?: string) => {
    if (!price) return 'N/A';
    const currency = deal?.currency || 'MAD';
    return `${currency} ${parseFloat(price).toFixed(2)}`;
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getSavings = () => {
    if (!deal?.priceOriginal || !deal?.priceDeal) return null;
    const original = parseFloat(deal.priceOriginal);
    const dealPrice = parseFloat(deal.priceDeal);
    if (isNaN(original) || isNaN(dealPrice)) return null;
    return (original - dealPrice).toFixed(2);
  };

  const getHoursRemaining = () => {
    if (!deal?.expiresAt) return null;
    const now = new Date();
    const expiry = new Date(deal.expiresAt);
    const diffMs = expiry.getTime() - now.getTime();
    if (diffMs <= 0) return 0;
    return Math.ceil(diffMs / (1000 * 60 * 60));
  };

  const getUrgencyInfo = () => {
    const hours = getHoursRemaining();
    if (hours === null) return null;
    if (hours <= 0) return { label: 'Expired', color: '#6B7280', bg: '#6B728015' };
    if (hours <= 24) return { label: `${hours}h left`, color: '#EF4444', bg: '#EF444415' };
    if (hours <= 48) return { label: `${hours}h left`, color: '#F59E0B', bg: '#F59E0B15' };
    if (hours <= 72) return { label: `${Math.floor(hours / 24)}d ${hours % 24}h left`, color: '#22C55E', bg: '#22C55E15' };
    return null;
  };

  // Loading State
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

  // Error State
  if (error || !deal) {
    return (
      <View style={[styles.container, styles.centered, { backgroundColor: colors.background }]}>
        <View style={[styles.errorIcon, { backgroundColor: colors.error + '15' }]}>
          <Ionicons name="alert-circle" size={48} color={colors.error} />
        </View>
        <Text style={[styles.errorTitle, { color: colors.text }]}>
          Oops! Something went wrong
        </Text>
        <Text style={[styles.errorText, { color: colors.textSecondary }]}>
          {error || 'Deal not found'}
        </Text>
        <TouchableOpacity
          style={[styles.retryButton, { backgroundColor: colors.primary }]}
          onPress={loadDeal}
        >
          <Text style={styles.retryButtonText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const discount = calculateDiscount();
  const savings = getSavings();
  const urgency = getUrgencyInfo();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Hero Image Section */}
        <View style={[styles.imageSection, { paddingTop: insets.top }]}>
          <View style={[
            styles.imagePlaceholder,
            { backgroundColor: isDark ? colors.surface : '#F3F4F6' }
          ]}>
            <Ionicons name="image-outline" size={48} color={colors.textTertiary} />
            <Text style={[styles.imagePlaceholderText, { color: colors.textTertiary }]}>
              Deal Image
            </Text>
          </View>

          {/* Top Actions Row */}
          <View style={[styles.topActions, { top: insets.top + 12 }]}>
            {/* Back Button */}
            <TouchableOpacity
              style={[
                styles.actionButton,
                {
                  backgroundColor: isDark ? colors.surface : '#FFFFFF',
                  borderColor: isDark ? colors.border : '#E5E7EB',
                }
              ]}
              onPress={() => router.back()}
              activeOpacity={0.7}
            >
              <Ionicons name="arrow-back" size={20} color={colors.text} />
            </TouchableOpacity>

            {/* Right Actions */}
            <View style={styles.rightActions}>
              <TouchableOpacity
                style={[
                  styles.actionButton,
                  {
                    backgroundColor: isDark ? colors.surface : '#FFFFFF',
                    borderColor: isDark ? colors.border : '#E5E7EB',
                  }
                ]}
                onPress={handleShare}
                activeOpacity={0.7}
              >
                <Ionicons name="share-outline" size={20} color={colors.text} />
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.actionButton,
                  {
                    backgroundColor: isFavorite ? colors.error + '15' : (isDark ? colors.surface : '#FFFFFF'),
                    borderColor: isFavorite ? colors.error : (isDark ? colors.border : '#E5E7EB'),
                  }
                ]}
                onPress={handleFavorite}
                activeOpacity={0.7}
              >
                <Ionicons
                  name={isFavorite ? 'heart' : 'heart-outline'}
                  size={20}
                  color={isFavorite ? colors.error : colors.text}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Discount Badge */}
          {discount && discount > 0 && (
            <View style={[styles.discountBadge, { backgroundColor: colors.error }]}>
              <Text style={styles.discountText}>-{discount}%</Text>
            </View>
          )}
        </View>

        {/* Content Section */}
        <View style={[
          styles.contentSection,
          {
            backgroundColor: isDark ? colors.surface : '#FFFFFF',
            borderColor: isDark ? colors.border : '#E5E7EB',
          }
        ]}>
          {/* Top Tags Row */}
          <View style={styles.tagsRow}>
            {/* Merchant Tag */}
            {deal.hot?.merchantName && (
              <View style={[styles.merchantTag, { backgroundColor: colors.primary + '15' }]}>
                <Ionicons name="storefront" size={14} color={colors.primary} />
                <Text style={[styles.merchantName, { color: colors.primary }]}>
                  {deal.hot.merchantName}
                </Text>
              </View>
            )}

            {/* Urgency Tag */}
            {urgency && (
              <View style={[styles.urgencyTag, { backgroundColor: urgency.bg }]}>
                <Ionicons name="time" size={14} color={urgency.color} />
                <Text style={[styles.urgencyText, { color: urgency.color }]}>
                  {urgency.label}
                </Text>
              </View>
            )}
          </View>

          {/* Title */}
          <Text style={[styles.title, { color: colors.text }]}>
            {deal.title}
          </Text>

          {/* Price Card */}
          <View style={[
            styles.priceCard,
            {
              backgroundColor: isDark ? colors.backgroundSecondary : '#F9FAFB',
              borderColor: isDark ? colors.border : '#E5E7EB',
            }
          ]}>
            <View style={styles.priceRow}>
              {deal.priceOriginal && (
                <View style={styles.priceBox}>
                  <Text style={[styles.priceLabel, { color: colors.textTertiary }]}>WAS</Text>
                  <Text style={[styles.originalPrice, { color: colors.textTertiary }]}>
                    {formatPrice(deal.priceOriginal)}
                  </Text>
                </View>
              )}

              {deal.priceOriginal && (
                <View style={styles.priceArrow}>
                  <Ionicons name="arrow-forward" size={20} color={colors.textTertiary} />
                </View>
              )}

              <View style={styles.priceBox}>
                <Text style={[styles.priceLabel, { color: colors.primary }]}>NOW</Text>
                <Text style={[styles.dealPrice, { color: colors.primary }]}>
                  {formatPrice(deal.priceDeal)}
                </Text>
              </View>
            </View>

            {savings && parseFloat(savings) > 0 && (
              <View style={[styles.savingsBadge, { backgroundColor: colors.success + '15' }]}>
                <Ionicons name="trending-down" size={16} color={colors.success} />
                <Text style={[styles.savingsText, { color: colors.success }]}>
                  Save {formatPrice(savings)}
                </Text>
              </View>
            )}
          </View>

          {/* Divider */}
          <View style={[styles.divider, { backgroundColor: isDark ? colors.border : '#E5E7EB' }]} />

          {/* Description */}
          {deal.description && (
            <>
              <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>
                  About this deal
                </Text>
                <Text style={[styles.description, { color: colors.textSecondary }]}>
                  {deal.description}
                </Text>
              </View>
              <View style={[styles.divider, { backgroundColor: isDark ? colors.border : '#E5E7EB' }]} />
            </>
          )}

          {/* Deal Details Grid */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Deal Details
            </Text>

            <View style={styles.detailsGrid}>
              <View style={[
                styles.detailItem,
                {
                  backgroundColor: isDark ? colors.backgroundSecondary : '#F9FAFB',
                  borderColor: isDark ? colors.border : '#E5E7EB',
                }
              ]}>
                <View style={[styles.detailIcon, { backgroundColor: colors.primary + '15' }]}>
                  <Ionicons name="calendar" size={18} color={colors.primary} />
                </View>
                <Text style={[styles.detailLabel, { color: colors.textTertiary }]}>Starts</Text>
                <Text style={[styles.detailValue, { color: colors.text }]}>
                  {formatDate(deal.startsAt)}
                </Text>
              </View>

              <View style={[
                styles.detailItem,
                {
                  backgroundColor: isDark ? colors.backgroundSecondary : '#F9FAFB',
                  borderColor: isDark ? colors.border : '#E5E7EB',
                }
              ]}>
                <View style={[styles.detailIcon, { backgroundColor: colors.warning + '15' }]}>
                  <Ionicons name="time" size={18} color={colors.warning} />
                </View>
                <Text style={[styles.detailLabel, { color: colors.textTertiary }]}>Expires</Text>
                <Text style={[styles.detailValue, { color: colors.text }]}>
                  {formatDate(deal.expiresAt)}
                </Text>
              </View>

              {deal.quantityTotal && (
                <View style={[
                  styles.detailItem,
                  {
                    backgroundColor: isDark ? colors.backgroundSecondary : '#F9FAFB',
                    borderColor: isDark ? colors.border : '#E5E7EB',
                  }
                ]}>
                  <View style={[styles.detailIcon, { backgroundColor: colors.info + '15' }]}>
                    <Ionicons name="cube" size={18} color={colors.info} />
                  </View>
                  <Text style={[styles.detailLabel, { color: colors.textTertiary }]}>Available</Text>
                  <Text style={[styles.detailValue, { color: colors.text }]}>
                    {deal.quantityTotal} left
                  </Text>
                </View>
              )}
            </View>
          </View>

          {/* Redemption Notes */}
          {deal.hot?.redemptionNotes && (
            <View style={styles.section}>
              <View style={[
                styles.redemptionCard,
                {
                  backgroundColor: colors.info + '08',
                  borderColor: colors.info + '25',
                }
              ]}>
                <View style={styles.redemptionHeader}>
                  <View style={[styles.redemptionIcon, { backgroundColor: colors.info + '15' }]}>
                    <Ionicons name="receipt" size={18} color={colors.info} />
                  </View>
                  <Text style={[styles.redemptionTitle, { color: colors.text }]}>
                    How to Redeem
                  </Text>
                </View>
                <Text style={[styles.redemptionText, { color: colors.textSecondary }]}>
                  {deal.hot.redemptionNotes}
                </Text>
              </View>
            </View>
          )}

          {/* Seller Info */}
          {deal.seller && (
            <View style={styles.section}>
              <View style={[
                styles.sellerCard,
                {
                  backgroundColor: isDark ? colors.backgroundSecondary : '#F9FAFB',
                  borderColor: isDark ? colors.border : '#E5E7EB',
                }
              ]}>
                <View style={[styles.sellerAvatar, { backgroundColor: colors.primary }]}>
                  <Text style={styles.sellerAvatarText}>
                    {deal.seller.displayName?.charAt(0).toUpperCase() || 'S'}
                  </Text>
                </View>
                <View style={styles.sellerInfo}>
                  <Text style={[styles.sellerName, { color: colors.text }]}>
                    {deal.seller.displayName}
                  </Text>
                  <Text style={[styles.sellerLabel, { color: colors.textTertiary }]}>
                    Deal Provider
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color={colors.textTertiary} />
              </View>
            </View>
          )}

          {/* Seller Actions */}
          {isSeller && isOwner && (
            <View style={styles.section}>
              <View style={styles.sellerActions}>
                <TouchableOpacity
                  style={[
                    styles.editButton,
                    { borderColor: colors.primary }
                  ]}
                  onPress={handleEdit}
                  activeOpacity={0.7}
                >
                  <Ionicons name="create-outline" size={18} color={colors.primary} />
                  <Text style={[styles.editButtonText, { color: colors.primary }]}>
                    Edit Deal
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.deleteButton,
                    { backgroundColor: colors.error + '10', borderColor: colors.error }
                  ]}
                  onPress={handleDelete}
                  activeOpacity={0.7}
                >
                  <Ionicons name="trash-outline" size={18} color={colors.error} />
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>

        {/* Bottom Spacer */}
        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Fixed CTA Button */}
      {!isOwner && (
        <View style={[
          styles.ctaContainer,
          {
            backgroundColor: isDark ? colors.surface : '#FFFFFF',
            borderTopColor: isDark ? colors.border : '#E5E7EB',
            paddingBottom: insets.bottom + 16,
          }
        ]}>
          <TouchableOpacity
            style={styles.ctaButtonWrapper}
            onPress={handleGetDeal}
            activeOpacity={0.9}
          >
            <LinearGradient
              colors={[colors.primary, colors.primaryLight]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.ctaButton}
            >
              <Text style={styles.ctaButtonText}>Get This Deal</Text>
              <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
            </LinearGradient>
          </TouchableOpacity>
        </View>
      )}
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
    padding: 24,
  },
  scrollContent: {
    paddingBottom: 24,
  },

  // Image Section
  imageSection: {
    position: 'relative',
    width: '100%',
    height: IMAGE_HEIGHT,
  },
  imagePlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  imagePlaceholderText: {
    fontSize: 14,
  },
  topActions: {
    position: 'absolute',
    left: 16,
    right: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 10,
  },
  rightActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  discountBadge: {
    position: 'absolute',
    bottom: 40,
    right: 16,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
  },
  discountText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },

  // Content Section
  contentSection: {
    marginTop: -24,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 16,
    borderWidth: 1,
    borderBottomWidth: 0,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  merchantTag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 6,
  },
  merchantName: {
    fontSize: 13,
    fontWeight: '600',
  },
  urgencyTag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 6,
  },
  urgencyText: {
    fontSize: 13,
    fontWeight: '600',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    lineHeight: 30,
    marginBottom: 16,
  },

  // Price Card
  priceCard: {
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 8,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  priceBox: {
    alignItems: 'flex-start',
  },
  priceLabel: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  priceArrow: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  originalPrice: {
    fontSize: 16,
    fontWeight: '500',
    textDecorationLine: 'line-through',
  },
  dealPrice: {
    fontSize: 32,
    fontWeight: '800',
  },
  savingsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    gap: 6,
    marginTop: 16,
  },
  savingsText: {
    fontSize: 14,
    fontWeight: '600',
  },

  // Divider
  divider: {
    height: 1,
    marginVertical: 20,
  },

  // Section
  section: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  description: {
    fontSize: 15,
    lineHeight: 24,
  },

  // Details Grid
  detailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  detailItem: {
    flex: 1,
    minWidth: '30%',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    gap: 8,
  },
  detailIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 11,
    fontWeight: '500',
    textTransform: 'uppercase',
  },
  detailValue: {
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
  },

  // Redemption Card
  redemptionCard: {
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
  },
  redemptionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },
  redemptionIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  redemptionTitle: {
    fontSize: 15,
    fontWeight: '600',
  },
  redemptionText: {
    fontSize: 14,
    lineHeight: 22,
  },

  // Seller Card
  sellerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    gap: 12,
  },
  sellerAvatar: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sellerAvatarText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  sellerInfo: {
    flex: 1,
  },
  sellerName: {
    fontSize: 15,
    fontWeight: '600',
  },
  sellerLabel: {
    fontSize: 12,
    marginTop: 2,
  },

  // Seller Actions
  sellerActions: {
    flexDirection: 'row',
    gap: 10,
  },
  editButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1.5,
  },
  editButtonText: {
    fontSize: 15,
    fontWeight: '600',
  },
  deleteButton: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1.5,
  },

  // CTA Container
  ctaContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingTop: 16,
    borderTopWidth: 1,
  },
  ctaButtonWrapper: {
    borderRadius: 14,
    overflow: 'hidden',
    shadowColor: '#059669',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  ctaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 16,
  },
  ctaButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
  },

  // Loading & Error States
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
  errorIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
  },
  errorText: {
    fontSize: 15,
    textAlign: 'center',
    marginBottom: 24,
  },
  retryButton: {
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 12,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
