import React, { useState, useEffect } from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import { Card, Header, AnimatedView } from '../../components/ui';
import { useAuthStore } from '../../store/authStore';
import { responsive } from '../../utils/responsive/responsive';
import dealsApi from '../../services/api/deals.api';
import { HotDeal } from '../../shared/types/deal';

type ViewMode = 'list' | 'grid';

export const HomeScreen: React.FC = () => {
  const { colors } = useTheme();
  const { user } = useAuthStore();

  const [deals, setDeals] = useState<HotDeal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [skip, setSkip] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const TAKE = 20;

  useEffect(() => {
    loadDeals();
  }, []);

  const loadDeals = async (refresh = false) => {
    console.log('[HomeScreen] Loading deals...', { refresh, skip });

    if (refresh) {
      setIsRefreshing(true);
      setSkip(0);
    }

    try {
      const response = await dealsApi.listHotDeals({
        skip: refresh ? 0 : skip,
        take: TAKE,
      });

      console.log('[HomeScreen] Deals loaded:', response.deals.length);

      if (refresh) {
        setDeals(response.deals);
        setSkip(TAKE);
      } else {
        setDeals((prev) => [...prev, ...response.deals]);
        setSkip((prev) => prev + TAKE);
      }

      setHasMore(response.deals.length === TAKE);
      setError(null);
    } catch (error: any) {
      console.error('[HomeScreen] Error loading deals:', error);
      setError(error.message || 'Failed to load deals');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
      setIsLoadingMore(false);
    }
  };

  const handleRefresh = () => {
    loadDeals(true);
  };

  const handleLoadMore = () => {
    if (!isLoadingMore && hasMore && deals.length > 0) {
      console.log('[HomeScreen] Loading more deals...');
      setIsLoadingMore(true);
      loadDeals(false);
    }
  };

  const toggleViewMode = () => {
    setViewMode((prev) => (prev === 'list' ? 'grid' : 'list'));
  };

  const formatPrice = (price?: string, currency?: string) => {
    if (!price) return 'N/A';
    return `${currency || '$'}${price}`;
  };

  const calculateDiscount = (original?: string, deal?: string) => {
    if (!original || !deal) return null;
    const originalNum = parseFloat(original);
    const dealNum = parseFloat(deal);
    if (isNaN(originalNum) || isNaN(dealNum)) return null;
    const discount = ((originalNum - dealNum) / originalNum) * 100;
    return Math.round(discount);
  };

  const renderDealCard = ({ item, index }: { item: HotDeal; index: number }) => {
    const discount = calculateDiscount(item.priceOriginal, item.priceDeal);

    if (viewMode === 'grid') {
      return (
        <AnimatedView
          animation="scale"
          delay={index * 50}
          duration={400}
          style={styles.gridItemWrapper}
        >
          <TouchableOpacity
            style={styles.gridCard}
            activeOpacity={0.7}
            onPress={() => console.log('[HomeScreen] Deal clicked:', item.id)}
          >
            <Card variant="elevated" style={styles.gridCardInner}>
              {/* Discount Badge */}
              {discount && (
                <View
                  style={[
                    styles.discountBadge,
                    { backgroundColor: colors.error },
                  ]}
                >
                  <Text style={styles.discountText}>-{discount}%</Text>
                </View>
              )}

              {/* Placeholder Image */}
              <View
                style={[
                  styles.gridImage,
                  { backgroundColor: colors.primary + '22' },
                ]}
              >
                <Ionicons name="pricetag" size={40} color={colors.primary} />
              </View>

              {/* Info */}
              <View style={styles.gridInfo}>
                <Text
                  style={[styles.gridTitle, { color: colors.text }]}
                  numberOfLines={2}
                >
                  {item.title}
                </Text>

                {/* Prices */}
                <View style={styles.gridPrices}>
                  {item.priceOriginal && (
                    <Text
                      style={[
                        styles.gridOriginalPrice,
                        { color: colors.textTertiary },
                      ]}
                    >
                      {formatPrice(item.priceOriginal, item.currency)}
                    </Text>
                  )}
                  <Text style={[styles.gridDealPrice, { color: colors.primary }]}>
                    {formatPrice(item.priceDeal, item.currency)}
                  </Text>
                </View>

                {/* Merchant */}
                {item.hot?.merchantName && (
                  <Text
                    style={[styles.gridMerchant, { color: colors.textSecondary }]}
                    numberOfLines={1}
                  >
                    {item.hot.merchantName}
                  </Text>
                )}
              </View>
            </Card>
          </TouchableOpacity>
        </AnimatedView>
      );
    }

    // List View
    return (
      <AnimatedView animation="slideUp" delay={index * 50} duration={400}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => console.log('[HomeScreen] Deal clicked:', item.id)}
        >
          <Card variant="elevated" style={styles.listCard}>
            <View style={styles.listContent}>
              {/* Image */}
              <View
                style={[
                  styles.listImage,
                  { backgroundColor: colors.primary + '22' },
                ]}
              >
                <Ionicons name="pricetag" size={32} color={colors.primary} />
              </View>

              {/* Info */}
              <View style={styles.listInfo}>
                <View style={styles.listHeader}>
                  <Text
                    style={[styles.listTitle, { color: colors.text }]}
                    numberOfLines={2}
                  >
                    {item.title}
                  </Text>
                  {discount && (
                    <View
                      style={[
                        styles.listDiscountBadge,
                        { backgroundColor: colors.error },
                      ]}
                    >
                      <Text style={styles.listDiscountText}>-{discount}%</Text>
                    </View>
                  )}
                </View>

                {item.description && (
                  <Text
                    style={[styles.listDescription, { color: colors.textSecondary }]}
                    numberOfLines={2}
                  >
                    {item.description}
                  </Text>
                )}

                {/* Merchant */}
                {item.hot?.merchantName && (
                  <View style={styles.listMerchantRow}>
                    <Ionicons
                      name="storefront-outline"
                      size={14}
                      color={colors.textTertiary}
                    />
                    <Text
                      style={[styles.listMerchant, { color: colors.textTertiary }]}
                    >
                      {item.hot.merchantName}
                    </Text>
                  </View>
                )}

                {/* Prices */}
                <View style={styles.listPrices}>
                  {item.priceOriginal && (
                    <Text
                      style={[
                        styles.listOriginalPrice,
                        { color: colors.textTertiary },
                      ]}
                    >
                      {formatPrice(item.priceOriginal, item.currency)}
                    </Text>
                  )}
                  <Text style={[styles.listDealPrice, { color: colors.primary }]}>
                    {formatPrice(item.priceDeal, item.currency)}
                  </Text>
                </View>
              </View>
            </View>
          </Card>
        </TouchableOpacity>
      </AnimatedView>
    );
  };

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      {/* Welcome */}
      <AnimatedView animation="fade" duration={500}>
        <View style={styles.welcomeSection}>
          <Text style={[styles.greeting, { color: colors.textSecondary }]}>
            Welcome back,
          </Text>
          <Text style={[styles.userName, { color: colors.text }]}>
            {user?.displayName}! 👋
          </Text>
        </View>
      </AnimatedView>

      {/* View Toggle */}
      <AnimatedView animation="scale" delay={100} duration={500}>
        <View style={styles.controls}>
          <Text style={[styles.dealsCount, { color: colors.textSecondary }]}>
            {deals.length} Hot Deals
          </Text>
          <TouchableOpacity
            style={[
              styles.viewToggle,
              { backgroundColor: colors.primary + '22' },
            ]}
            onPress={toggleViewMode}
            activeOpacity={0.7}
          >
            <Ionicons
              name={viewMode === 'list' ? 'grid-outline' : 'list-outline'}
              size={20}
              color={colors.primary}
            />
          </TouchableOpacity>
        </View>
      </AnimatedView>
    </View>
  );

  const renderEmpty = () => {
    if (isLoading) {
      return (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
            Loading hot deals...
          </Text>
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.centerContainer}>
          <Ionicons name="alert-circle-outline" size={64} color={colors.error} />
          <Text style={[styles.errorText, { color: colors.error }]}>{error}</Text>
          <TouchableOpacity
            style={[styles.retryButton, { backgroundColor: colors.primary }]}
            onPress={() => loadDeals(true)}
            activeOpacity={0.7}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <View style={styles.centerContainer}>
        <Ionicons name="pricetags-outline" size={64} color={colors.textTertiary} />
        <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
          No hot deals available
        </Text>
        <Text style={[styles.emptySubtext, { color: colors.textTertiary }]}>
          Check back later for amazing deals!
        </Text>
      </View>
    );
  };

  const renderFooter = () => {
    if (!isLoadingMore) return null;

    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color={colors.primary} />
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header title="Junto Go" />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Welcome Section */}
        <View style={styles.welcomeSection}>
          <Text style={[styles.greeting, { color: colors.textSecondary }]}>
            Welcome back,
          </Text>
          <Text style={[styles.userName, { color: colors.text }]}>
            {user?.firstName}! 👋
          </Text>
        </View>

        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          <Card variant="elevated" style={styles.statCard}>
            <Text style={[styles.statValue, { color: colors.primary }]}>24</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
              Total Events
            </Text>
          </Card>

          <Card variant="elevated" style={styles.statCard}>
            <Text style={[styles.statValue, { color: colors.accent }]}>12</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
              Upcoming
            </Text>
          </Card>
        </View>

        {/* Recent Activity Card */}
        <Card variant="elevated" style={styles.sectionCard}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Recent Activity
          </Text>

          <View style={styles.activityItem}>
            <View style={[styles.activityIcon, { backgroundColor: colors.primary + '22' }]}>
              <Text style={styles.activityEmoji}>🎉</Text>
            </View>
            <View style={styles.activityContent}>
              <Text style={[styles.activityTitle, { color: colors.text }]}>
                New Event Created
              </Text>
              <Text style={[styles.activityTime, { color: colors.textTertiary }]}>
                2 hours ago
              </Text>
            </View>
          </View>

          <View style={styles.activityItem}>
            <View style={[styles.activityIcon, { backgroundColor: colors.success + '22' }]}>
              <Text style={styles.activityEmoji}>✅</Text>
            </View>
            <View style={styles.activityContent}>
              <Text style={[styles.activityTitle, { color: colors.text }]}>
                Event Completed
              </Text>
              <Text style={[styles.activityTime, { color: colors.textTertiary }]}>
                5 hours ago
              </Text>
            </View>
          </View>

          <View style={styles.activityItem}>
            <View style={[styles.activityIcon, { backgroundColor: colors.info + '22' }]}>
              <Text style={styles.activityEmoji}>📢</Text>
            </View>
            <View style={styles.activityContent}>
              <Text style={[styles.activityTitle, { color: colors.text }]}>
                New Announcement
              </Text>
              <Text style={[styles.activityTime, { color: colors.textTertiary }]}>
                1 day ago
              </Text>
            </View>
          </View>
        </Card>

        {/* Quick Actions Card */}
        <Card variant="elevated" style={styles.sectionCard}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Quick Actions
          </Text>

          <View style={styles.quickActionsGrid}>
            <View style={[styles.quickAction, { backgroundColor: colors.primary + '22' }]}>
              <Text style={styles.quickActionIcon}>➕</Text>
              <Text style={[styles.quickActionLabel, { color: colors.text }]}>
                Create Event
              </Text>
            </View>

            <View style={[styles.quickAction, { backgroundColor: colors.accent + '22' }]}>
              <Text style={styles.quickActionIcon}>📅</Text>
              <Text style={[styles.quickActionLabel, { color: colors.text }]}>
                View Calendar
              </Text>
            </View>

            <View style={[styles.quickAction, { backgroundColor: colors.success + '22' }]}>
              <Text style={styles.quickActionIcon}>👥</Text>
              <Text style={[styles.quickActionLabel, { color: colors.text }]}>
                Invite Friends
              </Text>
            </View>

            <View style={[styles.quickAction, { backgroundColor: colors.info + '22' }]}>
              <Text style={styles.quickActionIcon}>📊</Text>
              <Text style={[styles.quickActionLabel, { color: colors.text }]}>
                View Stats
              </Text>
            </View>
          </View>
        </Card>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  welcomeSection: {
    marginBottom: 24,
  },
  greeting: {
    fontSize: 16,
    marginBottom: 4,
  },
  userName: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
  },
  statValue: {
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  statLabel: {
    fontSize: 14,
  },
  sectionCard: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  activityIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  activityEmoji: {
    fontSize: 24,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  activityTime: {
    fontSize: 12,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  quickAction: {
    width: '48%',
    aspectRatio: 1.5,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  quickActionIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  quickActionLabel: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
});
