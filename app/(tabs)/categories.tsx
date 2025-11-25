import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesome5 } from '@expo/vector-icons';
import { spacing, borderRadius, fontSize, fontWeight, shadows } from '../../shared/constants/theme';
import { GlassCard } from '../../shared/components';
import { useAppTheme } from '../../shared/hooks/useAppTheme';

export default function CategoriesScreen() {
  const theme = useAppTheme();

  const categories = [
    { id: '1', name: 'Electronics', icon: 'laptop', color: '#6C5DD3', dealsCount: 234 },
    { id: '2', name: 'Fashion', icon: 'tshirt', color: '#FF6B9D', dealsCount: 567 },
    { id: '3', name: 'Food & Dining', icon: 'utensils', color: '#FFC837', dealsCount: 432 },
    { id: '4', name: 'Travel', icon: 'plane', color: '#10B981', dealsCount: 189 },
    { id: '5', name: 'Home & Garden', icon: 'home', color: '#8B7DE8', dealsCount: 345 },
    { id: '6', name: 'Sports', icon: 'basketball-ball', color: '#F59E0B', dealsCount: 278 },
    { id: '7', name: 'Beauty', icon: 'spa', color: '#EC4899', dealsCount: 412 },
    { id: '8', name: 'Automotive', icon: 'car', color: '#06B6D4', dealsCount: 156 },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Categories</Text>
        <Text style={[styles.headerSubtitle, { color: theme.colors.textSecondary }]}>Explore deals by category</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.content}>
        {categories.map((category) => (
          <GlassCard
            key={category.id}
            onPress={() => {}}
            style={[styles.categoryCard, { backgroundColor: theme.colors.background, borderColor: theme.colors.border }]}
          >
            <View style={[styles.iconContainer, { backgroundColor: category.color + '20' }]}>
              <FontAwesome5 name={category.icon as any} size={28} color={category.color} />
            </View>

            <View style={styles.categoryInfo}>
              <Text style={[styles.categoryName, { color: theme.colors.text }]}>{category.name}</Text>
              <Text style={[styles.dealsCount, { color: theme.colors.textSecondary }]}>{category.dealsCount} active deals</Text>
            </View>

            <FontAwesome5 name="chevron-right" size={16} color={theme.colors.textTertiary} />
          </GlassCard>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
  },
  headerTitle: {
    fontSize: fontSize['3xl'],
    fontWeight: fontWeight.bold,
    marginBottom: spacing.xs,
  },
  headerSubtitle: {
    fontSize: fontSize.base,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },
  categoryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: borderRadius.xl,
    padding: spacing.md,
    marginBottom: spacing.md,
    ...shadows.sm,
    borderWidth: 1,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  categoryInfo: {
    flex: 1,
  },
  categoryName: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
    marginBottom: spacing.xs,
  },
  dealsCount: {
    fontSize: fontSize.sm,
  },
});
