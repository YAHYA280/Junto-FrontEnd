import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  RefreshControl,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import { Card, Header, AnimatedView } from '../../components/ui';
import { useAuthStore } from '../../store/authStore';
import dealsApi from '../../services/api/deals.api';
import { HotDeal } from '../../shared/types/deal';

const { width } = Dimensions.get('window');

export const MyDealsScreen: React.FC = () => {
  const { colors } = useTheme();
  const router = useRouter();
  const { user } = useAuthStore();

  const [deals, setDeals] = useState<HotDeal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isSeller = user?.roles?.includes('SELLER' as any);

  useEffect(() => {
    loadDeals();
  }, []);

  const loadDeals = async (refresh = false) => {
    if (refresh) {
      setIsRefreshing(true);
    }

    try {
      // Fetch all deals (since backend doesn't have /my endpoint yet)
      const response = await dealsApi.listHotDeals({ skip: 0, take: 100 });

      // Filter by current user's ID
      const myDeals = response.deals.filter((deal) => deal.sellerId === user?.id);

      setDeals(myDeals);
      setError(null);
    } catch (err: any) {
      console.error('[MyDeals] Error loading deals:', err);
      setError(err.message || 'Failed to load deals');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const handleDelete = (id: string, title: string) => {
    Alert.alert(
      'Delete Deal',
      `Are you sure you want to delete "${title}"? This action cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await dealsApi.deleteHotDeal(id);
              Alert.alert('Success', 'Deal deleted successfully');
              loadDeals();
            } catch (err: any) {
              Alert.alert('Error', err.message || 'Failed to delete deal');
            }
          },
        },
      ]
    );
  };

  const calculateDiscount = (original?: string, deal?: string) => {
    if (!original || !deal) return null;
    const originalNum = parseFloat(original);
    const dealNum = parseFloat(deal);
    if (isNaN(originalNum) || isNaN(dealNum)) return null;
    const discount = ((originalNum - dealNum) / originalNum) * 100;
    return Math.round(discount);
  };

  const formatPrice = (price?: string, currency?: string) => {
    if (!price) return 'N/A';
    return `${currency || '$'}${parseFloat(price).toFixed(2)}`;
  };

  const renderDealCard = ({ item, index }: { item: HotDeal; index: number }) => {
    const discount = calculateDiscount(item.priceOriginal, item.priceDeal);

    return (
      <AnimatedView animation="slideUp" delay={index * 50} duration={400}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => router.push(`/deals/${item.id}`)}
        >
          <Card
            variant="elevated"
            style={[styles.dealCard, { shadowColor: colors.shadow }]}
          >
            <View style={styles.cardContent}>
              {/* Deal Icon */}
              <View
                style={[
                  styles.dealIcon,
                  { backgroundColor: colors.primary + '22' },
                ]}
              >
                <Ionicons name="pricetag" size={32} color={colors.primary} />
              </View>

              {/* Deal Info */}
              <View style={styles.dealInfo}>
                <View style={styles.dealHeader}>
                  <Text
                    style={[styles.dealTitle, { color: colors.text }]}
                    numberOfLines={2}
                  >
                    {item.title}
                  </Text>
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
                </View>

                {item.hot?.merchantName && (
                  <View style={styles.merchantRow}>
                    <Ionicons
                      name="storefront-outline"
                      size={14}
                      color={colors.textTertiary}
                    />
                    <Text
                      style={[styles.merchantText, { color: colors.textTertiary }]}
                    >
                      {item.hot.merchantName}
                    </Text>
                  </View>
                )}

                {/* Prices */}
                <View style={styles.priceRow}>
                  {item.priceOriginal && (
                    <Text
                      style={[
                        styles.originalPrice,
                        { color: colors.textTertiary },
                      ]}
                    >
                      {formatPrice(item.priceOriginal, item.currency)}
                    </Text>
                  )}
                  <Text style={[styles.dealPrice, { color: colors.primary }]}>
                    {formatPrice(item.priceDeal, item.currency)}
                  </Text>
                </View>
              </View>
            </View>

            {/* Action Buttons */}
            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={[
                  styles.actionButton,
                  { backgroundColor: colors.primary + '22' },
                ]}
                onPress={() => router.push(`/deals/edit/${item.id}`)}
                activeOpacity={0.7}
              >
                <Ionicons name="create-outline" size={18} color={colors.primary} />
                <Text style={[styles.actionButtonText, { color: colors.primary }]}>
                  Edit
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.actionButton,
                  { backgroundColor: colors.error + '22' },
                ]}
                onPress={() => handleDelete(item.id, item.title)}
                activeOpacity={0.7}
              >
                <Ionicons name="trash-outline" size={18} color={colors.error} />
                <Text style={[styles.actionButtonText, { color: colors.error }]}>
                  Delete
                </Text>
              </TouchableOpacity>
            </View>
          </Card>
        </TouchableOpacity>
      </AnimatedView>
    );
  };

  const renderEmpty = () => {
    if (isLoading) {
      return (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
            Loading your deals...
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
        <AnimatedView animation="scale" duration={500}>
          <View
            style={[
              styles.emptyIcon,
              { backgroundColor: colors.primary + '22' },
            ]}
          >
            <Ionicons name="add-circle-outline" size={64} color={colors.primary} />
          </View>
        </AnimatedView>
        <Text style={[styles.emptyTitle, { color: colors.text }]}>
          No Deals Yet
        </Text>
        <Text style={[styles.emptySubtext, { color: colors.textSecondary }]}>
          Create your first deal to get started!
        </Text>
        <TouchableOpacity
          style={[
            styles.createButton,
            {
              backgroundColor: colors.primary,
              shadowColor: colors.shadow,
            },
          ]}
          onPress={() => router.push('/deals/create')}
          activeOpacity={0.8}
        >
          <Ionicons name="add" size={24} color={colors.textInverse} />
          <Text style={[styles.createButtonText, { color: colors.textInverse }]}>
            Create Deal
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  if (!isSeller) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Header title="My Deals" />
        <View style={styles.centerContainer}>
          <Ionicons name="lock-closed-outline" size={64} color={colors.textTertiary} />
          <Text style={[styles.emptyTitle, { color: colors.text }]}>
            Sellers Only
          </Text>
          <Text style={[styles.emptySubtext, { color: colors.textSecondary }]}>
            Become a seller to create and manage deals
          </Text>
          <TouchableOpacity
            style={[styles.createButton, { backgroundColor: colors.primary }]}
            onPress={() => router.push('/(tabs)/edit-profile')}
            activeOpacity={0.8}
          >
            <Text style={[styles.createButtonText, { color: colors.textInverse }]}>
              Become a Seller
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header title="My Deals" />

      {deals.length > 0 && (
        <View style={styles.headerActions}>
          <TouchableOpacity
            style={[
              styles.createDealButton,
              {
                backgroundColor: colors.primary,
                shadowColor: colors.shadow,
              },
            ]}
            onPress={() => router.push('/deals/create')}
            activeOpacity={0.8}
          >
            <Ionicons name="add" size={20} color={colors.textInverse} />
            <Text style={[styles.createDealButtonText, { color: colors.textInverse }]}>
              Create New Deal
            </Text>
          </TouchableOpacity>
        </View>
      )}

      <FlatList
        data={deals}
        renderItem={renderDealCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[
          styles.listContent,
          deals.length === 0 && styles.emptyListContent,
        ]}
        ListEmptyComponent={renderEmpty}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={() => loadDeals(true)}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerActions: {
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  createDealButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  createDealButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  listContent: {
    padding: 16,
    paddingBottom: 100,
  },
  emptyListContent: {
    flexGrow: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
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
  emptyIcon: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 32,
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6,
  },
  createButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  dealCard: {
    padding: 16,
    marginBottom: 16,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  cardContent: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  dealIcon: {
    width: 80,
    height: 80,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  dealInfo: {
    flex: 1,
  },
  dealHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  dealTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
  discountBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  discountText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  merchantRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  merchantText: {
    fontSize: 13,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  originalPrice: {
    fontSize: 14,
    textDecorationLine: 'line-through',
  },
  dealPrice: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 8,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
});
