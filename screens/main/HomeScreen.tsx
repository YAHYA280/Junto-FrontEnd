import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  Dimensions,
  TextInput,
  Animated,
  Keyboard,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuthStore } from '../../store/authStore';
import { Sidebar } from '../../components/ui';
import dealsApi from '../../services/api/deals.api';
import { HotDeal } from '../../shared/types/deal';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Deal Categories
type DealCategory = 'all' | 'food' | 'transport' | 'realestate' | 'shopping' | 'services';

interface CategoryItem {
  id: DealCategory;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
}

const CATEGORIES: CategoryItem[] = [
  { id: 'all', label: 'All', icon: 'apps', color: '#6B7280' },
  { id: 'food', label: 'Food', icon: 'restaurant', color: '#F59E0B' },
  { id: 'transport', label: 'Transport', icon: 'car', color: '#3B82F6' },
  { id: 'realestate', label: 'Housing', icon: 'home', color: '#8B5CF6' },
  { id: 'shopping', label: 'Shopping', icon: 'bag', color: '#EC4899' },
  { id: 'services', label: 'Services', icon: 'construct', color: '#14B8A6' },
];

// Time Filters
type TimeFilter = 'all' | '24h' | '48h' | '72h';

interface TimeFilterItem {
  id: TimeFilter;
  label: string;
  hours: number | null;
  color: string;
  bgColor: string;
}

const TIME_FILTERS: TimeFilterItem[] = [
  { id: 'all', label: 'All Deals', hours: null, color: '#6B7280', bgColor: '#6B728015' },
  { id: '24h', label: '24h', hours: 24, color: '#EF4444', bgColor: '#EF444415' },
  { id: '48h', label: '48h', hours: 48, color: '#F59E0B', bgColor: '#F59E0B15' },
  { id: '72h', label: '72h', hours: 72, color: '#22C55E', bgColor: '#22C55E15' },
];

// Mock data with images for testing
const MOCK_DEALS: HotDeal[] = [
  {
    id: 'mock-1',
    title: '50% Off Gourmet Burger Meal',
    description: 'Enjoy our signature burger with fries and a drink at half price',
    priceOriginal: '120.00',
    priceDeal: '60.00',
    currency: 'MAD',
    startsAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 18 * 60 * 60 * 1000).toISOString(), // 18h from now
    imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400',
    hot: { merchantName: 'Burger House', category: 'food' },
    sellerId: 'seller-1',
  },
  {
    id: 'mock-2',
    title: 'Luxury Car Rental - Weekend Special',
    description: 'Rent a Mercedes C-Class for the weekend at an amazing price',
    priceOriginal: '1500.00',
    priceDeal: '900.00',
    currency: 'MAD',
    startsAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 36 * 60 * 60 * 1000).toISOString(), // 36h from now
    imageUrl: 'https://images.unsplash.com/photo-1617469767053-d3b523a0b982?w=400',
    hot: { merchantName: 'Premium Cars', category: 'transport' },
    sellerId: 'seller-2',
  },
  {
    id: 'mock-3',
    title: 'Cozy Airbnb Studio - Marrakech',
    description: 'Beautiful studio apartment in the heart of Marrakech medina',
    priceOriginal: '800.00',
    priceDeal: '450.00',
    currency: 'MAD',
    startsAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 60 * 60 * 60 * 1000).toISOString(), // 60h from now
    imageUrl: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400',
    hot: { merchantName: 'Riad Stays', category: 'housing' },
    sellerId: 'seller-3',
  },
  {
    id: 'mock-4',
    title: 'Italian Restaurant - Family Dinner',
    description: 'Full Italian dinner for 4 people with appetizers and dessert',
    priceOriginal: '450.00',
    priceDeal: '280.00',
    currency: 'MAD',
    startsAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString(), // 12h from now
    imageUrl: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400',
    hot: { merchantName: 'La Piazza', category: 'food' },
    sellerId: 'seller-4',
  },
  {
    id: 'mock-5',
    title: 'Spa Day Package',
    description: 'Full day spa access with massage and facial treatment',
    priceOriginal: '600.00',
    priceDeal: '350.00',
    currency: 'MAD',
    startsAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(), // 48h from now
    imageUrl: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=400',
    hot: { merchantName: 'Zen Spa', category: 'services' },
    sellerId: 'seller-5',
  },
  {
    id: 'mock-6',
    title: 'Designer Sunglasses Sale',
    description: 'Authentic Ray-Ban and Oakley sunglasses at 40% off',
    priceOriginal: '1200.00',
    priceDeal: '720.00',
    currency: 'MAD',
    startsAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 72 * 60 * 60 * 1000).toISOString(), // 72h from now
    imageUrl: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400',
    hot: { merchantName: 'Optic Store', category: 'shopping' },
    sellerId: 'seller-6',
  },
];

// Toggle this to use mock data
const USE_MOCK_DATA = true;

type ViewMode = 'list' | 'grid';

export const HomeScreen: React.FC = () => {
  const { colors, isDark } = useTheme();
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

  // Filters
  const [selectedCategory, setSelectedCategory] = useState<DealCategory>('all');
  const [selectedTimeFilter, setSelectedTimeFilter] = useState<TimeFilter>('all');

  // Sidebar and Search
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [searchVisible, setSearchVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef<TextInput>(null);
  const searchAnimation = useRef(new Animated.Value(0)).current;

  const TAKE = 20;

  useEffect(() => {
    loadDeals();
  }, []);

  const loadDeals = async (refresh = false) => {
    if (refresh) {
      setIsRefreshing(true);
      setSkip(0);
    }

    try {
      // Use mock data if enabled
      if (USE_MOCK_DATA) {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 500));
        setDeals(MOCK_DEALS);
        setHasMore(false);
        setError(null);
      } else {
        const response = await dealsApi.listHotDeals({
          skip: refresh ? 0 : skip,
          take: TAKE,
        });

        if (refresh) {
          setDeals(response.deals);
          setSkip(TAKE);
        } else {
          setDeals((prev) => [...prev, ...response.deals]);
          setSkip((prev) => prev + TAKE);
        }

        setHasMore(response.deals.length === TAKE);
        setError(null);
      }
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
      setIsLoadingMore(true);
      loadDeals(false);
    }
  };

  const toggleViewMode = () => {
    setViewMode((prev) => (prev === 'list' ? 'grid' : 'list'));
  };

  const toggleSearch = () => {
    if (searchVisible) {
      // Close search
      Keyboard.dismiss();
      Animated.timing(searchAnimation, {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
      }).start(() => {
        setSearchVisible(false);
        setSearchQuery('');
      });
    } else {
      // Open search
      setSearchVisible(true);
      Animated.timing(searchAnimation, {
        toValue: 1,
        duration: 200,
        useNativeDriver: false,
      }).start(() => {
        searchInputRef.current?.focus();
      });
    }
  };

  // Calculate hours remaining until expiry
  const getHoursRemaining = (expiresAt?: string): number | null => {
    if (!expiresAt) return null;
    const now = new Date();
    const expiry = new Date(expiresAt);
    const diffMs = expiry.getTime() - now.getTime();
    if (diffMs <= 0) return 0;
    return Math.ceil(diffMs / (1000 * 60 * 60));
  };

  // Get urgency level based on hours remaining
  const getUrgencyLevel = (hoursRemaining: number | null): '24h' | '48h' | '72h' | 'normal' => {
    if (hoursRemaining === null) return 'normal';
    if (hoursRemaining <= 24) return '24h';
    if (hoursRemaining <= 48) return '48h';
    if (hoursRemaining <= 72) return '72h';
    return 'normal';
  };

  // Get urgency colors
  const getUrgencyColors = (urgency: '24h' | '48h' | '72h' | 'normal') => {
    switch (urgency) {
      case '24h':
        return { bg: '#EF4444', text: '#FFFFFF', light: '#EF444420' };
      case '48h':
        return { bg: '#F59E0B', text: '#FFFFFF', light: '#F59E0B20' };
      case '72h':
        return { bg: '#22C55E', text: '#FFFFFF', light: '#22C55E20' };
      default:
        return { bg: colors.primary, text: '#FFFFFF', light: colors.primary + '20' };
    }
  };

  // Filter deals based on selected filters
  const filteredDeals = useMemo(() => {
    let result = [...deals];

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter(deal => {
        const text = `${deal.title} ${deal.description || ''} ${deal.hot?.merchantName || ''}`.toLowerCase();
        return text.includes(query);
      });
    }

    // Filter by time
    if (selectedTimeFilter !== 'all') {
      const filterHours = TIME_FILTERS.find(f => f.id === selectedTimeFilter)?.hours;
      if (filterHours) {
        result = result.filter(deal => {
          const hours = getHoursRemaining(deal.expiresAt);
          return hours !== null && hours <= filterHours;
        });
      }
    }

    // Filter by category (placeholder - would need category field in deal)
    // For now, we'll simulate based on title/description keywords
    if (selectedCategory !== 'all') {
      result = result.filter(deal => {
        const text = `${deal.title} ${deal.description || ''} ${deal.hot?.merchantName || ''}`.toLowerCase();
        switch (selectedCategory) {
          case 'food':
            return /restaurant|food|café|coffee|pizza|burger|sushi|meal|lunch|dinner|breakfast/i.test(text);
          case 'transport':
            return /car|transport|ride|taxi|bus|train|flight|trip|voyage/i.test(text);
          case 'realestate':
            return /house|apartment|room|rent|airbnb|hotel|stay|accommodation|studio/i.test(text);
          case 'shopping':
            return /shop|store|mall|buy|sale|discount|clothes|fashion|electronics/i.test(text);
          case 'services':
            return /service|spa|gym|beauty|salon|repair|clean|maintenance/i.test(text);
          default:
            return true;
        }
      });
    }

    return result;
  }, [deals, selectedCategory, selectedTimeFilter, searchQuery]);

  const formatPrice = (price?: string, currency?: string) => {
    if (!price) return 'N/A';
    return `${currency || 'MAD'} ${price}`;
  };

  const calculateDiscount = (original?: string, deal?: string) => {
    if (!original || !deal) return null;
    const originalNum = parseFloat(original);
    const dealNum = parseFloat(deal);
    if (isNaN(originalNum) || isNaN(dealNum)) return null;
    const discount = ((originalNum - dealNum) / originalNum) * 100;
    return Math.round(discount);
  };

  const formatTimeRemaining = (hours: number | null): string => {
    if (hours === null) return '';
    if (hours <= 0) return 'Expired';
    if (hours < 24) return `${hours}h left`;
    const days = Math.floor(hours / 24);
    const remainingHours = hours % 24;
    if (days === 1) return remainingHours > 0 ? `1d ${remainingHours}h` : '1 day';
    return `${days} days`;
  };

  const renderCategoryFilters = () => (
    <View style={styles.categorySection}>
      <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>Categories</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoryScroll}
      >
        {CATEGORIES.map((category) => {
          const isSelected = selectedCategory === category.id;
          return (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.categoryChip,
                {
                  backgroundColor: isSelected
                    ? category.color
                    : isDark ? colors.surface : '#FFFFFF',
                  borderColor: isSelected
                    ? category.color
                    : isDark ? colors.border : '#E5E7EB',
                }
              ]}
              onPress={() => setSelectedCategory(category.id)}
              activeOpacity={0.7}
            >
              <Ionicons
                name={category.icon}
                size={18}
                color={isSelected ? '#FFFFFF' : category.color}
              />
              <Text style={[
                styles.categoryLabel,
                { color: isSelected ? '#FFFFFF' : colors.text }
              ]}>
                {category.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );

  const renderTimeFilters = () => (
    <View style={styles.timeFilterSection}>
      <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>Deal Duration</Text>
      <View style={styles.timeFilterRow}>
        {TIME_FILTERS.map((filter) => {
          const isSelected = selectedTimeFilter === filter.id;
          return (
            <TouchableOpacity
              key={filter.id}
              style={[
                styles.timeFilterChip,
                {
                  backgroundColor: isSelected ? filter.color : filter.bgColor,
                  borderColor: filter.color,
                  borderWidth: isSelected ? 0 : 1,
                }
              ]}
              onPress={() => setSelectedTimeFilter(filter.id)}
              activeOpacity={0.7}
            >
              {filter.id !== 'all' && (
                <Ionicons
                  name="time"
                  size={14}
                  color={isSelected ? '#FFFFFF' : filter.color}
                />
              )}
              <Text style={[
                styles.timeFilterLabel,
                { color: isSelected ? '#FFFFFF' : filter.color }
              ]}>
                {filter.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );

  const renderDealCard = ({ item, index }: { item: HotDeal; index: number }) => {
    const discount = calculateDiscount(item.priceOriginal, item.priceDeal);
    const savings = item.priceOriginal && item.priceDeal
      ? (parseFloat(item.priceOriginal) - parseFloat(item.priceDeal)).toFixed(2)
      : null;
    const hoursRemaining = getHoursRemaining(item.expiresAt);
    const urgency = getUrgencyLevel(hoursRemaining);
    const urgencyColors = getUrgencyColors(urgency);

    if (viewMode === 'grid') {
      return (
        <TouchableOpacity
          style={[
            styles.gridCard,
            {
              backgroundColor: isDark ? colors.surface : '#FFFFFF',
              borderColor: isDark ? colors.border : '#E5E7EB',
            }
          ]}
          activeOpacity={0.8}
          onPress={() => router.push(`/deals/${item.id}`)}
        >
          {/* Image Section */}
          <View style={styles.gridImageContainer}>
            {item.imageUrl ? (
              <Image
                source={{ uri: item.imageUrl }}
                style={styles.gridImage}
                resizeMode="cover"
              />
            ) : (
              <View style={[
                styles.gridImagePlaceholder,
                { backgroundColor: isDark ? colors.backgroundSecondary : '#F3F4F6' }
              ]}>
                <Ionicons name="image-outline" size={32} color={colors.textTertiary} />
              </View>
            )}

            {/* Overlay Gradient */}
            <LinearGradient
              colors={['transparent', 'rgba(0,0,0,0.4)']}
              style={styles.gridImageOverlay}
            />

            {/* Urgency Badge */}
            {urgency !== 'normal' && (
              <View style={[styles.urgencyBadge, { backgroundColor: urgencyColors.bg }]}>
                <Ionicons name="flash" size={10} color="#FFFFFF" />
                <Text style={styles.urgencyBadgeText}>
                  {formatTimeRemaining(hoursRemaining)}
                </Text>
              </View>
            )}

            {/* Discount Badge */}
            {discount && discount > 0 && (
              <View style={[styles.discountBadge, { backgroundColor: colors.error }]}>
                <Text style={styles.discountText}>-{discount}%</Text>
              </View>
            )}

            {/* Price on Image */}
            <View style={styles.gridPriceOnImage}>
              <Text style={styles.gridDealPriceOnImage}>
                {formatPrice(item.priceDeal, item.currency)}
              </Text>
            </View>
          </View>

          {/* Content */}
          <View style={styles.gridContent}>
            {/* Merchant Tag */}
            {item.hot?.merchantName && (
              <View style={[styles.merchantTag, { backgroundColor: colors.primary + '15' }]}>
                <Ionicons name="storefront" size={10} color={colors.primary} />
                <Text style={[styles.merchantTagText, { color: colors.primary }]} numberOfLines={1}>
                  {item.hot.merchantName}
                </Text>
              </View>
            )}

            {/* Title */}
            <Text style={[styles.gridTitle, { color: colors.text }]} numberOfLines={2}>
              {item.title}
            </Text>

            {/* Original Price */}
            {item.priceOriginal && (
              <Text style={[styles.gridOriginalPrice, { color: colors.textTertiary }]}>
                Was {formatPrice(item.priceOriginal, item.currency)}
              </Text>
            )}
          </View>
        </TouchableOpacity>
      );
    }

    // List View - Card Style
    return (
      <TouchableOpacity
        style={[
          styles.listCard,
          {
            backgroundColor: isDark ? colors.surface : '#FFFFFF',
            borderColor: isDark ? colors.border : '#E5E7EB',
          }
        ]}
        activeOpacity={0.8}
        onPress={() => router.push(`/deals/${item.id}`)}
      >
        {/* Image Section */}
        <View style={styles.listImageContainer}>
          {item.imageUrl ? (
            <Image
              source={{ uri: item.imageUrl }}
              style={styles.listImage}
              resizeMode="cover"
            />
          ) : (
            <View style={[
              styles.listImagePlaceholder,
              { backgroundColor: isDark ? colors.backgroundSecondary : '#F3F4F6' }
            ]}>
              <Ionicons name="image-outline" size={28} color={colors.textTertiary} />
            </View>
          )}

          {/* Discount Badge */}
          {discount && discount > 0 && (
            <View style={[styles.listDiscountBadge, { backgroundColor: colors.error }]}>
              <Text style={styles.listDiscountText}>-{discount}%</Text>
            </View>
          )}

          {/* Urgency Indicator Bar */}
          {urgency !== 'normal' && (
            <View style={[styles.urgencyBar, { backgroundColor: urgencyColors.bg }]} />
          )}
        </View>

        {/* Content Section */}
        <View style={styles.listContent}>
          {/* Top Row: Merchant + Time */}
          <View style={styles.listTopRow}>
            {item.hot?.merchantName && (
              <View style={[styles.merchantTag, { backgroundColor: colors.primary + '15' }]}>
                <Ionicons name="storefront" size={10} color={colors.primary} />
                <Text style={[styles.merchantTagText, { color: colors.primary }]} numberOfLines={1}>
                  {item.hot.merchantName}
                </Text>
              </View>
            )}

            {/* Time Badge */}
            {urgency !== 'normal' && (
              <View style={[styles.timeBadge, { backgroundColor: urgencyColors.light }]}>
                <Ionicons name="flash" size={11} color={urgencyColors.bg} />
                <Text style={[styles.timeBadgeText, { color: urgencyColors.bg }]}>
                  {formatTimeRemaining(hoursRemaining)}
                </Text>
              </View>
            )}
          </View>

          {/* Title */}
          <Text style={[styles.listTitle, { color: colors.text }]} numberOfLines={2}>
            {item.title}
          </Text>

          {/* Description */}
          {item.description && (
            <Text style={[styles.listDescription, { color: colors.textSecondary }]} numberOfLines={1}>
              {item.description}
            </Text>
          )}

          {/* Price Section */}
          <View style={styles.listPriceSection}>
            <View style={styles.listPriceRow}>
              <Text style={[styles.listDealPrice, { color: colors.primary }]}>
                {formatPrice(item.priceDeal, item.currency)}
              </Text>
              {item.priceOriginal && (
                <Text style={[styles.listOriginalPrice, { color: colors.textTertiary }]}>
                  {formatPrice(item.priceOriginal, item.currency)}
                </Text>
              )}
            </View>

            {/* Savings Badge */}
            {savings && parseFloat(savings) > 0 && (
              <View style={[styles.savingsBadge, { backgroundColor: colors.success + '15' }]}>
                <Ionicons name="arrow-down" size={10} color={colors.success} />
                <Text style={[styles.savingsText, { color: colors.success }]}>
                  Save {item.currency || 'MAD'} {savings}
                </Text>
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      {/* Category Filters */}
      {renderCategoryFilters()}

      {/* Time Filters */}
      {renderTimeFilters()}

      {/* Results Row */}
      <View style={styles.resultsRow}>
        <View style={styles.resultsLeft}>
          <Text style={[styles.resultsCount, { color: colors.text }]}>
            {filteredDeals.length} {filteredDeals.length === 1 ? 'Deal' : 'Deals'}
          </Text>
          {searchQuery && (
            <Text style={[styles.searchingFor, { color: colors.textSecondary }]}>
              {' '}for "{searchQuery}"
            </Text>
          )}
        </View>
        <View style={styles.resultsRight}>
          {(selectedCategory !== 'all' || selectedTimeFilter !== 'all' || searchQuery) && (
            <TouchableOpacity
              onPress={() => {
                setSelectedCategory('all');
                setSelectedTimeFilter('all');
                setSearchQuery('');
              }}
              activeOpacity={0.7}
            >
              <Text style={[styles.clearFilters, { color: colors.primary }]}>
                Clear
              </Text>
            </TouchableOpacity>
          )}
          {/* View Toggle */}
          <TouchableOpacity
            style={[
              styles.viewToggle,
              { backgroundColor: isDark ? colors.surface : '#FFFFFF', borderColor: isDark ? colors.border : '#E5E7EB' }
            ]}
            onPress={toggleViewMode}
            activeOpacity={0.7}
          >
            <Ionicons
              name={viewMode === 'list' ? 'grid-outline' : 'list-outline'}
              size={18}
              color={colors.primary}
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const renderEmpty = () => {
    if (isLoading) {
      return (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
            Loading deals...
          </Text>
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.centerContainer}>
          <View style={[styles.errorIconWrapper, { backgroundColor: colors.error + '15' }]}>
            <Ionicons name="alert-circle" size={48} color={colors.error} />
          </View>
          <Text style={[styles.errorTitle, { color: colors.text }]}>Oops!</Text>
          <Text style={[styles.errorText, { color: colors.textSecondary }]}>{error}</Text>
          <TouchableOpacity
            style={[styles.retryButton, { backgroundColor: colors.primary }]}
            onPress={() => loadDeals(true)}
            activeOpacity={0.7}
          >
            <Ionicons name="refresh" size={18} color="#FFFFFF" />
            <Text style={styles.retryButtonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <View style={styles.centerContainer}>
        <View style={[styles.emptyIconWrapper, { backgroundColor: colors.primary + '15' }]}>
          <Ionicons name="pricetags" size={48} color={colors.primary} />
        </View>
        <Text style={[styles.emptyTitle, { color: colors.text }]}>No Deals Found</Text>
        <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
          {selectedCategory !== 'all' || selectedTimeFilter !== 'all'
            ? 'Try adjusting your filters to find more deals'
            : 'Check back later for amazing deals!'}
        </Text>
        {(selectedCategory !== 'all' || selectedTimeFilter !== 'all') && (
          <TouchableOpacity
            style={[styles.clearFiltersButton, { borderColor: colors.primary }]}
            onPress={() => {
              setSelectedCategory('all');
              setSelectedTimeFilter('all');
            }}
            activeOpacity={0.7}
          >
            <Text style={[styles.clearFiltersButtonText, { color: colors.primary }]}>
              Clear Filters
            </Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  const renderFooter = () => {
    if (!isLoadingMore) return <View style={{ height: 100 }} />;

    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color={colors.primary} />
        <Text style={[styles.loadingMoreText, { color: colors.textSecondary }]}>
          Loading more deals...
        </Text>
      </View>
    );
  };

  const searchInputWidth = searchAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, SCREEN_WIDTH - 160],
  });

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      {/* Sidebar */}
      <Sidebar visible={sidebarVisible} onClose={() => setSidebarVisible(false)} />

      {/* Header */}
      <View style={[
        styles.topHeader,
        {
          backgroundColor: isDark ? colors.surface : '#FFFFFF',
          borderBottomColor: isDark ? colors.border : '#E5E7EB',
        }
      ]}>
        {/* Left: Menu Button */}
        <TouchableOpacity
          style={[styles.headerButton, { backgroundColor: isDark ? colors.backgroundSecondary : '#F3F4F6' }]}
          onPress={() => setSidebarVisible(true)}
          activeOpacity={0.7}
        >
          <Ionicons name="menu" size={22} color={colors.text} />
        </TouchableOpacity>

        {/* Center: Logo or Search Input */}
        {searchVisible ? (
          <Animated.View style={[
            styles.searchInputContainer,
            {
              width: searchInputWidth,
              backgroundColor: isDark ? colors.backgroundSecondary : '#F3F4F6',
              borderColor: isDark ? colors.border : '#E5E7EB',
            }
          ]}>
            <Ionicons name="search" size={18} color={colors.textTertiary} />
            <TextInput
              ref={searchInputRef}
              style={[styles.searchInput, { color: colors.text }]}
              placeholder="Search deals..."
              placeholderTextColor={colors.textTertiary}
              value={searchQuery}
              onChangeText={setSearchQuery}
              returnKeyType="search"
              autoCapitalize="none"
              autoCorrect={false}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')} activeOpacity={0.7}>
                <Ionicons name="close-circle" size={18} color={colors.textTertiary} />
              </TouchableOpacity>
            )}
          </Animated.View>
        ) : (
          <View style={styles.logoSection}>
            <LinearGradient
              colors={[colors.primary, colors.primaryLight]}
              style={styles.logoIcon}
            >
              <Ionicons name="flash" size={18} color="#FFFFFF" />
            </LinearGradient>
            <Text style={[styles.logoText, { color: colors.text }]}>Junto Go</Text>
          </View>
        )}

        {/* Right: Search & Notifications */}
        <View style={styles.headerRight}>
          <TouchableOpacity
            style={[
              styles.headerButton,
              {
                backgroundColor: searchVisible
                  ? colors.primary
                  : isDark ? colors.backgroundSecondary : '#F3F4F6'
              }
            ]}
            onPress={toggleSearch}
            activeOpacity={0.7}
          >
            <Ionicons
              name={searchVisible ? 'close' : 'search'}
              size={20}
              color={searchVisible ? '#FFFFFF' : colors.text}
            />
          </TouchableOpacity>

          {!searchVisible && (
            <TouchableOpacity
              style={[styles.headerButton, { backgroundColor: isDark ? colors.backgroundSecondary : '#F3F4F6' }]}
              activeOpacity={0.7}
            >
              <Ionicons name="notifications-outline" size={20} color={colors.text} />
              <View style={[styles.notificationDot, { backgroundColor: colors.error }]} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <FlatList
        data={filteredDeals}
        renderItem={renderDealCard}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmpty}
        ListFooterComponent={renderFooter}
        contentContainerStyle={[
          styles.flatListContent,
          filteredDeals.length === 0 && styles.emptyFlatListContent,
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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  // Top Header
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    gap: 12,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logoSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
    justifyContent: 'center',
  },
  logoIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoText: {
    fontSize: 18,
    fontWeight: '700',
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    height: 40,
    borderRadius: 12,
    paddingHorizontal: 12,
    borderWidth: 1,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    height: '100%',
  },
  notificationDot: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
  },

  // FlatList
  flatListContent: {
    padding: 20,
    paddingTop: 0,
  },
  emptyFlatListContent: {
    flexGrow: 1,
  },
  gridRow: {
    justifyContent: 'space-between',
  },

  // Header Container
  headerContainer: {
    paddingTop: 16,
    paddingBottom: 12,
  },
  viewToggle: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },

  // Category Section
  categorySection: {
    marginBottom: 16,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  categoryScroll: {
    gap: 10,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    gap: 8,
  },
  categoryLabel: {
    fontSize: 13,
    fontWeight: '600',
  },

  // Time Filter Section
  timeFilterSection: {
    marginBottom: 20,
  },
  timeFilterRow: {
    flexDirection: 'row',
    gap: 10,
  },
  timeFilterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
    gap: 6,
  },
  timeFilterLabel: {
    fontSize: 13,
    fontWeight: '600',
  },

  // Results Row
  resultsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  resultsLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  resultsRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  resultsCount: {
    fontSize: 15,
    fontWeight: '600',
  },
  searchingFor: {
    fontSize: 14,
  },
  clearFilters: {
    fontSize: 13,
    fontWeight: '600',
  },

  // Grid Card
  gridCard: {
    width: (SCREEN_WIDTH - 50) / 2,
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
    marginBottom: 12,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  gridImageContainer: {
    width: '100%',
    height: 120,
    position: 'relative',
  },
  gridImage: {
    width: '100%',
    height: '100%',
  },
  gridImagePlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  gridImageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 50,
  },
  gridPriceOnImage: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  gridDealPriceOnImage: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  gridContent: {
    padding: 12,
  },
  gridTitle: {
    fontSize: 13,
    fontWeight: '600',
    lineHeight: 18,
    marginTop: 6,
    marginBottom: 4,
    minHeight: 36,
  },
  gridOriginalPrice: {
    fontSize: 11,
    textDecorationLine: 'line-through',
  },

  // Urgency Badge
  urgencyBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
    zIndex: 2,
  },
  urgencyBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },

  // Discount Badge
  discountBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    zIndex: 2,
  },
  discountText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },

  // List Card
  listCard: {
    flexDirection: 'row',
    marginBottom: 12,
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  listImageContainer: {
    position: 'relative',
    width: 110,
    height: 130,
  },
  listImage: {
    width: '100%',
    height: '100%',
  },
  listImagePlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  listDiscountBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
  },
  listDiscountText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
  urgencyBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 3,
  },
  listContent: {
    flex: 1,
    padding: 12,
    justifyContent: 'space-between',
  },
  listTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
    flexWrap: 'wrap',
    gap: 6,
  },
  listTitle: {
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 20,
    marginBottom: 2,
  },
  listDescription: {
    fontSize: 12,
    lineHeight: 16,
    marginBottom: 6,
  },
  listPriceSection: {
    gap: 4,
  },
  listPriceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  listDealPrice: {
    fontSize: 18,
    fontWeight: '700',
  },
  listOriginalPrice: {
    fontSize: 12,
    textDecorationLine: 'line-through',
  },

  // Merchant Tag
  merchantTag: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    gap: 4,
  },
  merchantTagText: {
    fontSize: 11,
    fontWeight: '600',
    maxWidth: 80,
  },

  // Time Badge
  timeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    gap: 4,
  },
  timeBadgeText: {
    fontSize: 11,
    fontWeight: '600',
  },

  // Savings Badge
  savingsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  savingsText: {
    fontSize: 11,
    fontWeight: '600',
  },

  // Empty & Loading States
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingVertical: 60,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 15,
  },
  errorIconWrapper: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 8,
  },
  errorText: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
  emptyIconWrapper: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
  },
  clearFiltersButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1.5,
  },
  clearFiltersButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  footerLoader: {
    paddingVertical: 20,
    alignItems: 'center',
    gap: 8,
  },
  loadingMoreText: {
    fontSize: 13,
  },
});
