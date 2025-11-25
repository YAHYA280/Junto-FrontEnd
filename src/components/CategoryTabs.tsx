import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { BlurView } from 'expo-blur';
import { colors, typography, spacing } from '../theme';

export type DealCategory = 'HOT' | 'TRANSPORT' | 'REAL_ESTATE';

interface CategoryTab {
  id: DealCategory;
  label: string;
  emoji: string;
}

const categories: CategoryTab[] = [
  { id: 'HOT', label: 'Hot Deals', emoji: '🔥' },
  { id: 'TRANSPORT', label: 'Transport', emoji: '🚗' },
  { id: 'REAL_ESTATE', label: 'Immobilier', emoji: '🏠' },
];

const getCategoryColor = (categoryId: DealCategory): string => {
  switch (categoryId) {
    case 'HOT':
      return 'rgba(244, 67, 54, 0.8)';
    case 'TRANSPORT':
      return 'rgba(33, 150, 243, 0.8)';
    case 'REAL_ESTATE':
      return 'rgba(76, 175, 80, 0.8)';
    default:
      return 'rgba(71, 181, 255, 0.5)';
  }
};

interface CategoryTabsProps {
  activeCategory: DealCategory;
  onCategoryChange: (category: DealCategory) => void;
}

export const CategoryTabs: React.FC<CategoryTabsProps> = ({
  activeCategory,
  onCategoryChange,
}) => {
  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {categories.map((category) => (
          <CategoryTabItem
            key={category.id}
            category={category}
            isActive={activeCategory === category.id}
            onPress={() => onCategoryChange(category.id)}
          />
        ))}
      </ScrollView>
    </View>
  );
};

interface CategoryTabItemProps {
  category: CategoryTab;
  isActive: boolean;
  onPress: () => void;
}

const CategoryTabItem: React.FC<CategoryTabItemProps> = ({
  category,
  isActive,
  onPress,
}) => {
  const categoryColor = getCategoryColor(category.id);
  const borderColor = isActive ? categoryColor : 'rgba(71, 181, 255, 0.5)';

  return (
    <View style={styles.tabWrapper}>
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.7}
      >
        <BlurView
          intensity={isActive ? 60 : 30}
          tint={isActive ? 'light' : 'dark'}
          style={[
            styles.tab,
            isActive && styles.activeTab,
            { borderColor },
          ]}
        >
          <Text style={styles.emoji}>{category.emoji}</Text>
          <Text style={[styles.label, isActive && styles.activeLabel]}>
            {category.label}
          </Text>
          {isActive && (
            <View style={[styles.indicator, { backgroundColor: categoryColor }]} />
          )}
        </BlurView>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: spacing.md,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
  },
  tabWrapper: {
    marginHorizontal: spacing.xs,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: 20,
    borderWidth: 2,
    overflow: 'hidden',
  },
  activeTab: {
    borderWidth: 2.5,
  },
  emoji: {
    fontSize: typography.sizes.lg,
    marginRight: spacing.sm,
  },
  label: {
    fontSize: typography.sizes.md,
    fontWeight: typography.fontWeights.medium,
    color: colors.text.tertiary,
  },
  activeLabel: {
    color: colors.text.primary,
    fontWeight: typography.fontWeights.bold,
  },
  indicator: {
    position: 'absolute',
    bottom: 0,
    left: spacing.lg,
    right: spacing.lg,
    height: 3,
    borderRadius: 2,
  },
});
