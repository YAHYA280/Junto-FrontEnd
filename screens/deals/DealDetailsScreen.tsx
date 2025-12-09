import React, { useEffect, useState, useRef } from 'react';
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
  Image,
  Animated,
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
const IMAGE_HEIGHT = SCREEN_WIDTH * 0.7;

// Category mapping
const CATEGORY_INFO: Record<string, { label: string; icon: keyof typeof Ionicons.glyphMap; color: string }> = {
  food: { label: 'Food & Dining', icon: 'restaurant', color: '#F59E0B' },
  transport: { label: 'Transport', icon: 'car', color: '#3B82F6' },
  housing: { label: 'Housing', icon: 'home', color: '#8B5CF6' },
  shopping: { label: 'Shopping', icon: 'bag', color: '#EC4899' },
  services: { label: 'Services', icon: 'construct', color: '#14B8A6' },
};

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
  const [countdown, setCountdown] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const pulseAnim = useRef(new Animated.Value(1)).current;

  const isSeller = user?.roles?.includes('SELLER' as any);
  const isOwner = deal?.sellerId === user?.id;

  // Countdown timer effect
  useEffect(() => {
    if (!deal?.expiresAt) return;

    const updateCountdown = () => {
      const now = new Date();
      const expiry = new Date(deal.expiresAt!);
      const diffMs = expiry.getTime() - now.getTime();

      if (diffMs <= 0) {
        setCountdown({ hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const hours = Math.floor(diffMs / (1000 * 60 * 60));
      const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);

      setCountdown({ hours, minutes, seconds });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, [deal?.expiresAt]);

  // Pulse animation for urgent deals
  useEffect(() => {
    if (countdown.hours <= 24 && countdown.hours > 0) {
      const pulse = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.05,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
        ])
      );
      pulse.start();
      return () => pulse.stop();
    }
  }, [countdown.hours]);

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

  const getCategoryInfo = () => {
    const category = deal?.hot?.category;
    if (!category || !CATEGORY_INFO[category]) return null;
    return CATEGORY_INFO[category];
  };

  const getAvailabilityPercentage = () => {
    if (!deal?.quantityTotal) return null;
    const claimed = deal.quantityClaimed || 0;
    const total = deal.quantityTotal;
    const remaining = total - claimed;
    return {
      percentage: Math.max(0, Math.min(100, (remaining / total) * 100)),
      remaining,
      total,
    };
  };

  const formatCountdown = () => {
    const { hours, minutes, seconds } = countdown;
    if (hours >= 24) {
      const days = Math.floor(hours / 24);
      const remainingHours = hours % 24;
      return `${days}d ${remainingHours}h ${minutes}m`;
    }
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
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
  const categoryInfo = getCategoryInfo();
  const availability = getAvailabilityPercentage();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Hero Image Section with Gradient Overlay */}
        <View style={[styles.imageSection, { paddingTop: insets.top }]}>
          {deal.imageUrl ? (
            <Image
              source={{ uri: deal.imageUrl }}
              style={styles.heroImage}
              resizeMode="cover"
            />
          ) : (
            <View style={[
              styles.imagePlaceholder,
              { backgroundColor: isDark ? colors.surface : '#F3F4F6' }
            ]}>
              <Ionicons name="image-outline" size={48} color={colors.textTertiary} />
              <Text style={[styles.imagePlaceholderText, { color: colors.textTertiary }]}>
                Deal Image
              </Text>
            </View>
          )}

          {/* Gradient Overlay */}
          <LinearGradient
            colors={['rgba(0,0,0,0.4)', 'transparent', 'rgba(0,0,0,0.6)']}
            locations={[0, 0.4, 1]}
            style={styles.imageOverlay}
          />

          {/* Top Actions Row */}
          <View style={[styles.topActions, { top: insets.top + 12 }]}>
            {/* Back Button */}
            <TouchableOpacity
              style={styles.actionButtonGlass}
              onPress={() => router.back()}
              activeOpacity={0.7}
            >
              <Ionicons name="arrow-back" size={22} color="#FFFFFF" />
            </TouchableOpacity>

            {/* Right Actions */}
            <View style={styles.rightActions}>
              <TouchableOpacity
                style={styles.actionButtonGlass}
                onPress={handleShare}
                activeOpacity={0.7}
              >
                <Ionicons name="share-outline" size={22} color="#FFFFFF" />
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.actionButtonGlass,
                  isFavorite && { backgroundColor: colors.error }
                ]}
                onPress={handleFavorite}
                activeOpacity={0.7}
              >
                <Ionicons
                  name={isFavorite ? 'heart' : 'heart-outline'}
                  size={22}
                  color="#FFFFFF"
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Discount Badge - Right side */}
          {discount && discount > 0 && (
            <View style={[styles.discountBadgeLarge, { backgroundColor: colors.error }]}>
              <Text style={styles.discountTextLarge}>-{discount}%</Text>
              <Text style={styles.discountLabel}>OFF</Text>
            </View>
          )}

          {/* Bottom Image Info - Category only */}
          <View style={styles.imageBottomInfo}>
            {categoryInfo && (
              <View style={[styles.categoryBadge, { backgroundColor: categoryInfo.color }]}>
                <Ionicons name={categoryInfo.icon} size={14} color="#FFFFFF" />
                <Text style={styles.categoryText}>{categoryInfo.label}</Text>
              </View>
            )}
          </View>
        </View>

        {/* Content Section */}
        <View style={[
          styles.contentSection,
          {
            backgroundColor: isDark ? colors.surface : '#FFFFFF',
            borderColor: isDark ? colors.border : '#E5E7EB',
          }
        ]}>
          {/* Highlight Cards Row - Only Time Left and Items Left */}
          <View style={styles.highlightsRow}>
            {/* Countdown Card */}
            {urgency && countdown.hours >= 0 && (
              <Animated.View style={[
                styles.highlightCard,
                {
                  backgroundColor: urgency.bg,
                  borderColor: urgency.color + '30',
                  transform: [{ scale: countdown.hours <= 24 ? pulseAnim : 1 }],
                  flex: 1,
                }
              ]}>
                <Ionicons name="time" size={20} color={urgency.color} />
                <Text style={[styles.highlightValue, { color: urgency.color }]}>
                  {formatCountdown()}
                </Text>
                <Text style={[styles.highlightLabel, { color: urgency.color }]}>
                  {countdown.hours <= 0 ? 'Expired' : 'Time Left'}
                </Text>
              </Animated.View>
            )}

            {/* Availability Card */}
            {availability && (
              <View style={[
                styles.highlightCard,
                {
                  backgroundColor: colors.info + '15',
                  borderColor: colors.info + '30',
                  flex: 1,
                }
              ]}>
                <Ionicons name="cube" size={20} color={colors.info} />
                <Text style={[styles.highlightValue, { color: colors.info }]}>
                  {availability.remaining}
                </Text>
                <Text style={[styles.highlightLabel, { color: colors.info }]}>
                  Items Left
                </Text>
              </View>
            )}
          </View>

          {/* Merchant Tag */}
          {deal.hot?.merchantName && (
            <View style={[styles.merchantRow, { borderBottomColor: isDark ? colors.border : '#E5E7EB' }]}>
              <View style={[styles.merchantAvatar, { backgroundColor: colors.primary }]}>
                <Ionicons name="storefront" size={16} color="#FFFFFF" />
              </View>
              <Text style={[styles.merchantName, { color: colors.text }]}>
                {deal.hot.merchantName}
              </Text>
              <View style={[styles.verifiedBadge, { backgroundColor: colors.primary + '15' }]}>
                <Ionicons name="checkmark-circle" size={14} color={colors.primary} />
                <Text style={[styles.verifiedText, { color: colors.primary }]}>Verified</Text>
              </View>
            </View>
          )}

          {/* Title */}
          <Text style={[styles.title, { color: colors.text }]}>
            {deal.title}
          </Text>

          {/* Price Section - Simplified */}
          <View style={[
            styles.priceSection,
            {
              backgroundColor: isDark ? colors.backgroundSecondary : '#F9FAFB',
              borderColor: isDark ? colors.border : '#E5E7EB',
            }
          ]}>
            <View style={styles.priceMain}>
              <Text style={[styles.dealPriceLarge, { color: colors.primary }]}>
                {formatPrice(deal.priceDeal)}
              </Text>
              {deal.priceOriginal && (
                <Text style={[styles.originalPriceLarge, { color: colors.textTertiary }]}>
                  {formatPrice(deal.priceOriginal)}
                </Text>
              )}
            </View>

            {/* You Save - Below Price */}
            {savings && parseFloat(savings) > 0 && (
              <View style={[styles.savingsRow, { backgroundColor: colors.success + '15' }]}>
                <Ionicons name="arrow-down-circle" size={18} color={colors.success} />
                <Text style={[styles.savingsText, { color: colors.success }]}>
                  You save {formatPrice(savings)}
                </Text>
              </View>
            )}
          </View>

          {/* Availability Progress Bar */}
          {availability && (
            <View style={styles.availabilitySection}>
              <View style={styles.availabilityHeader}>
                <Text style={[styles.availabilityTitle, { color: colors.text }]}>
                  Availability
                </Text>
                <Text style={[styles.availabilityCount, { color: colors.textSecondary }]}>
                  {availability.remaining} of {availability.total} left
                </Text>
              </View>
              <View style={[styles.progressBarBg, { backgroundColor: isDark ? colors.border : '#E5E7EB' }]}>
                <View
                  style={[
                    styles.progressBarFill,
                    {
                      width: `${availability.percentage}%`,
                      backgroundColor: availability.percentage > 50
                        ? colors.success
                        : availability.percentage > 20
                          ? colors.warning
                          : colors.error,
                    }
                  ]}
                />
              </View>
              {availability.percentage <= 20 && (
                <Text style={[styles.lowStockWarning, { color: colors.error }]}>
                  Hurry! Almost sold out
                </Text>
              )}
            </View>
          )}

          {/* Divider */}
          <View style={[styles.divider, { backgroundColor: isDark ? colors.border : '#E5E7EB' }]} />

          {/* Description */}
          {deal.description && (
            <>
              <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>
                  Description
                </Text>
                <Text style={[styles.description, { color: colors.textSecondary }]}>
                  {deal.description}
                </Text>
              </View>
              <View style={[styles.divider, { backgroundColor: isDark ? colors.border : '#E5E7EB' }]} />
            </>
          )}

          {/* Deal Details - Simplified */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Deal Details
            </Text>

            <View style={styles.detailsList}>
              <View style={styles.detailRow}>
                <View style={[styles.detailIconSmall, { backgroundColor: colors.primary + '15' }]}>
                  <Ionicons name="calendar-outline" size={16} color={colors.primary} />
                </View>
                <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Starts</Text>
                <Text style={[styles.detailValue, { color: colors.text }]}>
                  {formatDate(deal.startsAt)}
                </Text>
              </View>

              <View style={styles.detailRow}>
                <View style={[styles.detailIconSmall, { backgroundColor: colors.warning + '15' }]}>
                  <Ionicons name="alarm-outline" size={16} color={colors.warning} />
                </View>
                <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Expires</Text>
                <Text style={[styles.detailValue, { color: colors.text }]}>
                  {formatDate(deal.expiresAt)}
                </Text>
              </View>

              {categoryInfo && (
                <View style={styles.detailRow}>
                  <View style={[styles.detailIconSmall, { backgroundColor: categoryInfo.color + '15' }]}>
                    <Ionicons name={categoryInfo.icon} size={16} color={categoryInfo.color} />
                  </View>
                  <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Category</Text>
                  <Text style={[styles.detailValue, { color: colors.text }]}>
                    {categoryInfo.label}
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
  heroImage: {
    width: '100%',
    height: '100%',
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
  imageOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
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
    gap: 10,
  },
  actionButtonGlass: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  imageBottomInfo: {
    position: 'absolute',
    bottom: 40,
    left: 16,
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  categoryText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  discountBadgeLarge: {
    position: 'absolute',
    right: 16,
    bottom: 40,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 14,
    alignItems: 'center',
    zIndex: 10,
  },
  discountTextLarge: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '800',
  },
  discountLabel: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 10,
    fontWeight: '600',
  },

  // Content Section
  contentSection: {
    marginTop: -24,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    borderWidth: 1,
    borderBottomWidth: 0,
  },

  // Highlight Cards
  highlightsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  highlightCard: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
  },
  highlightValue: {
    fontSize: 18,
    fontWeight: '800',
    marginTop: 6,
  },
  highlightLabel: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2,
    textTransform: 'uppercase',
  },

  // Merchant Row
  merchantRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 16,
    marginBottom: 12,
    borderBottomWidth: 1,
    gap: 10,
  },
  merchantAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  merchantName: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  verifiedText: {
    fontSize: 11,
    fontWeight: '600',
  },

  title: {
    fontSize: 24,
    fontWeight: '700',
    lineHeight: 32,
    marginBottom: 16,
  },

  // Price Section
  priceSection: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 16,
  },
  priceMain: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 12,
  },
  dealPriceLarge: {
    fontSize: 36,
    fontWeight: '800',
  },
  originalPriceLarge: {
    fontSize: 18,
    fontWeight: '500',
    textDecorationLine: 'line-through',
  },
  savingsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    alignSelf: 'flex-start',
  },
  savingsText: {
    fontSize: 14,
    fontWeight: '600',
  },

  // Availability Section
  availabilitySection: {
    marginBottom: 8,
  },
  availabilityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  availabilityTitle: {
    fontSize: 14,
    fontWeight: '600',
  },
  availabilityCount: {
    fontSize: 13,
  },
  progressBarBg: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  lowStockWarning: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 6,
  },

  // Divider
  divider: {
    height: 1,
    marginVertical: 20,
  },

  // Section
  section: {
    marginTop: 4,
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

  // Details List
  detailsList: {
    gap: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  detailIconSmall: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  detailLabel: {
    flex: 1,
    fontSize: 14,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
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
