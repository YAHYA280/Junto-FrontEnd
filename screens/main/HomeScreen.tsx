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
import { useRouter } from 'expo-router';
import { useTheme } from '../../contexts/ThemeContext';
import { Card, Header, AnimatedView } from '../../components/ui';
import { useAuthStore } from '../../store/authStore';
import { responsive } from '../../utils/responsive/responsive';
import dealsApi from '../../services/api/deals.api';
import { HotDeal } from '../../shared/types/deal';

type ViewMode = 'list' | 'grid';

export const HomeScreen: React.FC = () => {
  const { colors } = useTheme();
  const router = useRouter();
  const { user } = useAuthStore();

  const [deals, setDeals] = useState<HotDeal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [skip, setSkip] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isSeller = user?.roles?.includes('SELLER' as any);

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
            onPress={() => router.push(`/deals/${item.id}`)}
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
          onPress={() => router.push(`/deals/${item.id}`)}
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

      <FlatList
        data={deals}
        renderItem={renderDealCard}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmpty}
        ListFooterComponent={renderFooter}
        contentContainerStyle={[
          styles.flatListContent,
          deals.length === 0 && styles.emptyFlatListContent,
        ]}
        key={viewMode}
        numColumns={viewMode === 'grid' ? 2 : 1}
        columnWrapperStyle={viewMode === 'grid' ? styles.gridRow : undefined}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  flatListContent: {
    padding: 16,
    paddingBottom: 100,
  },
  emptyFlatListContent: {
    flexGrow: 1,
  },
  gridRow: {
    justifyContent: 'space-between',
  },
  headerContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  welcomeSection: {
    marginBottom: 16,
  },
  greeting: {
    fontSize: 16,
    marginBottom: 4,
  },
  userName: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dealsCount: {
    fontSize: 14,
    fontWeight: '500',
  },
  viewToggle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gridItemWrapper: {
    width: '48%',
    marginBottom: 16,
  },
  gridCard: {
    width: '100%',
  },
  gridCardInner: {
    padding: 12,
  },
  gridImage: {
    width: '100%',
    height: 120,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  gridInfo: {
    width: '100%',
  },
  gridTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    minHeight: 40,
  },
  gridPrices: {
    marginBottom: 8,
  },
  gridOriginalPrice: {
    fontSize: 12,
    textDecorationLine: 'line-through',
    marginBottom: 4,
  },
  gridDealPrice: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  gridMerchant: {
    fontSize: 12,
  },
  listCard: {
    marginBottom: 12,
  },
  listContent: {
    flexDirection: 'row',
    padding: 12,
  },
  listImage: {
    width: 100,
    height: 100,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  listInfo: {
    flex: 1,
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  listTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
  listDiscountBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  listDiscountText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  listDescription: {
    fontSize: 14,
    marginBottom: 8,
  },
  listMerchantRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  listMerchant: {
    fontSize: 13,
  },
  listPrices: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  listOriginalPrice: {
    fontSize: 14,
    textDecorationLine: 'line-through',
  },
  listDealPrice: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  discountBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
  },
  discountText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    textAlign: 'center',
  },
  errorText: {
    marginTop: 16,
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 8,
  },
  retryButton: {
    marginTop: 16,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    textAlign: 'center',
  },
  footerLoader: {
    paddingVertical: 20,
    alignItems: 'center',
  },
});
