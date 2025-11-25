import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesome5 } from '@expo/vector-icons';
import { useAuthStore } from '../../shared/store/authStore';
import { spacing, borderRadius, fontSize, fontWeight, shadows } from '../../shared/constants/theme';
import { GlassCard } from '../../shared/components';
import { useAppTheme } from '../../shared/hooks/useAppTheme';

export default function HomeScreen() {
  const theme = useAppTheme();
  const { user } = useAuthStore();

  const categories = [
    { id: '1', name: 'Electronics', icon: 'laptop', color: '#6C5DD3' },
    { id: '2', name: 'Fashion', icon: 'tshirt', color: '#FF6B9D' },
    { id: '3', name: 'Food', icon: 'utensils', color: '#FFC837' },
    { id: '4', name: 'Travel', icon: 'plane', color: '#10B981' },
  ];

  const featuredDeals = [
    {
      id: '1',
      title: 'Premium Headphones',
      merchant: 'TechStore',
      discount: '40%',
      price: '$89.99',
      originalPrice: '$149.99',
      image: 'https://via.placeholder.com/300x200/6C5DD3/FFFFFF?text=Headphones',
    },
    {
      id: '2',
      title: 'Summer Collection',
      merchant: 'FashionHub',
      discount: '50%',
      price: '$49.99',
      originalPrice: '$99.99',
      image: 'https://via.placeholder.com/300x200/FF6B9D/FFFFFF?text=Fashion',
    },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={[styles.greeting, { color: theme.colors.text }]}>Hello, {user?.name || 'Guest'}!</Text>
            <Text style={[styles.headerSubtitle, { color: theme.colors.textSecondary }]}>Find amazing deals today</Text>
          </View>
          <TouchableOpacity style={[styles.notificationButton, { backgroundColor: theme.colors.backgroundSecondary }]}>
            <FontAwesome5 name="bell" size={20} color={theme.colors.text} />
            <View style={[styles.notificationBadge, { backgroundColor: theme.colors.error }]} />
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={[styles.searchBar, { backgroundColor: theme.colors.backgroundSecondary }]}>
            <FontAwesome5 name="search" size={16} color={theme.colors.textTertiary} />
            <TextInput
              style={[styles.searchInput, { color: theme.colors.text }]}
              placeholder="Search for deals..."
              placeholderTextColor={theme.colors.textTertiary}
            />
          </View>
          <TouchableOpacity style={[styles.filterButton, { backgroundColor: theme.colors.primary }]}>
            <FontAwesome5 name="sliders-h" size={18} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* Categories */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Categories</Text>
            <TouchableOpacity>
              <Text style={[styles.seeAll, { color: theme.colors.primary }]}>See All</Text>
            </TouchableOpacity>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesScroll}>
            {categories.map((category) => (
              <GlassCard
                key={category.id}
                onPress={() => {}}
                style={styles.categoryCard}
              >
                <View style={[styles.categoryIcon, { backgroundColor: category.color + '20' }]}>
                  <FontAwesome5 name={category.icon as any} size={24} color={category.color} />
                </View>
                <Text style={[styles.categoryName, { color: theme.colors.text }]}>{category.name}</Text>
              </GlassCard>
            ))}
          </ScrollView>
        </View>

        {/* Featured Deals */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Featured Deals</Text>
            <TouchableOpacity>
              <Text style={[styles.seeAll, { color: theme.colors.primary }]}>See All</Text>
            </TouchableOpacity>
          </View>

          {featuredDeals.map((deal) => (
            <GlassCard
              key={deal.id}
              onPress={() => {}}
              style={[styles.dealCard, { backgroundColor: theme.colors.background, borderColor: theme.colors.border }]}
              variant="elevated"
            >
              <View style={[styles.dealImageContainer, { backgroundColor: theme.colors.backgroundSecondary }]}>
                <View style={[styles.discountBadge, { backgroundColor: theme.colors.error }]}>
                  <FontAwesome5 name="tag" size={12} color="#FFFFFF" />
                  <Text style={styles.discountText}>{deal.discount} OFF</Text>
                </View>
              </View>

              <View style={styles.dealContent}>
                <Text style={[styles.dealTitle, { color: theme.colors.text }]}>{deal.title}</Text>
                <View style={styles.merchantContainer}>
                  <FontAwesome5 name="store" size={12} color={theme.colors.textSecondary} />
                  <Text style={[styles.merchantName, { color: theme.colors.textSecondary }]}>{deal.merchant}</Text>
                </View>

                <View style={styles.priceContainer}>
                  <View>
                    <Text style={[styles.price, { color: theme.colors.primary }]}>{deal.price}</Text>
                    <Text style={[styles.originalPrice, { color: theme.colors.textTertiary }]}>{deal.originalPrice}</Text>
                  </View>

                  <TouchableOpacity style={[styles.favoriteButton, { backgroundColor: theme.colors.backgroundSecondary }]}>
                    <FontAwesome5 name="heart" size={18} color={theme.colors.textTertiary} />
                  </TouchableOpacity>
                </View>
              </View>
            </GlassCard>
          ))}
        </View>

        {/* Quick Stats */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Your Activity</Text>

          <View style={styles.statsContainer}>
            <GlassCard style={[styles.statCard, { backgroundColor: theme.colors.background, borderColor: theme.colors.border }]}>
              <View style={[styles.statIcon, { backgroundColor: '#6C5DD320' }]}>
                <FontAwesome5 name="shopping-bag" size={20} color={theme.colors.primary} />
              </View>
              <Text style={[styles.statValue, { color: theme.colors.text }]}>24</Text>
              <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>Saved Deals</Text>
            </GlassCard>

            <GlassCard style={[styles.statCard, { backgroundColor: theme.colors.background, borderColor: theme.colors.border }]}>
              <View style={[styles.statIcon, { backgroundColor: '#10B98120' }]}>
                <FontAwesome5 name="dollar-sign" size={20} color={theme.colors.success} />
              </View>
              <Text style={[styles.statValue, { color: theme.colors.text }]}>$432</Text>
              <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>Total Saved</Text>
            </GlassCard>

            <GlassCard style={[styles.statCard, { backgroundColor: theme.colors.background, borderColor: theme.colors.border }]}>
              <View style={[styles.statIcon, { backgroundColor: '#FFC83720' }]}>
                <FontAwesome5 name="star" size={20} color={theme.colors.accent} />
              </View>
              <Text style={[styles.statValue, { color: theme.colors.text }]}>15</Text>
              <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>Reviews</Text>
            </GlassCard>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
  },
  greeting: {
    fontSize: fontSize['2xl'],
    fontWeight: fontWeight.bold,
  },
  headerSubtitle: {
    fontSize: fontSize.sm,
    marginTop: spacing.xs,
  },
  notificationButton: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.lg,
    gap: spacing.sm,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    height: 50,
    gap: spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: fontSize.base,
  },
  filterButton: {
    width: 50,
    height: 50,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.md,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
  },
  seeAll: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
  },
  categoriesScroll: {
    paddingLeft: spacing.lg,
  },
  categoryCard: {
    alignItems: 'center',
    marginRight: spacing.md,
    width: 80,
  },
  categoryIcon: {
    width: 64,
    height: 64,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  categoryName: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
    textAlign: 'center',
  },
  dealCard: {
    borderRadius: borderRadius.xl,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
    ...shadows.md,
    overflow: 'hidden',
    borderWidth: 1,
  },
  dealImageContainer: {
    height: 160,
    position: 'relative',
  },
  discountBadge: {
    position: 'absolute',
    top: spacing.md,
    right: spacing.md,
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  discountText: {
    color: '#FFFFFF',
    fontSize: fontSize.xs,
    fontWeight: fontWeight.bold,
  },
  dealContent: {
    padding: spacing.md,
  },
  dealTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    marginBottom: spacing.sm,
  },
  merchantContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginBottom: spacing.md,
  },
  merchantName: {
    fontSize: fontSize.sm,
  },
  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  price: {
    fontSize: fontSize['2xl'],
    fontWeight: fontWeight.bold,
  },
  originalPrice: {
    fontSize: fontSize.sm,
    textDecorationLine: 'line-through',
  },
  favoriteButton: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
  },
  statCard: {
    flex: 1,
    borderRadius: borderRadius.xl,
    padding: spacing.md,
    alignItems: 'center',
    ...shadows.sm,
    borderWidth: 1,
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  statValue: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    marginBottom: spacing.xs,
  },
  statLabel: {
    fontSize: fontSize.xs,
    textAlign: 'center',
  },
});
