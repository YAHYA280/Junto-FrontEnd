import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { GlassCard } from '../components';
import { colors, typography, spacing } from '../theme';

export const CategoriesScreen: React.FC = () => {
  const categories = [
    {
      id: 'HOT',
      title: 'Hot Deals',
      emoji: '🔥',
      description: '24-hour flash deals and limited offers',
      color: colors.status.hot,
    },
    {
      id: 'TRANSPORT',
      title: 'Transport',
      emoji: '🚗',
      description: 'Rides, carpools, and travel deals',
      color: colors.status.transport,
    },
    {
      id: 'REAL_ESTATE',
      title: 'Immobilier',
      emoji: '🏠',
      description: 'Rental properties and accommodations',
      color: colors.status.realEstate,
    },
  ];

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={colors.gradients.background}
        style={styles.background}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>All Categories</Text>

        {categories.map((category) => (
          <GlassCard key={category.id} style={styles.card}>
            <View style={styles.cardContent}>
              <Text style={styles.emoji}>{category.emoji}</Text>
              <View style={styles.cardText}>
                <Text style={styles.categoryTitle}>{category.title}</Text>
                <Text style={styles.description}>{category.description}</Text>
              </View>
            </View>
          </GlassCard>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  content: {
    padding: spacing.lg,
    paddingTop: spacing.xxxl,
  },
  title: {
    fontSize: typography.sizes.xxxl,
    fontWeight: typography.fontWeights.bold,
    color: colors.text.primary,
    marginBottom: spacing.xl,
  },
  card: {
    marginBottom: spacing.base,
    padding: spacing.lg,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  emoji: {
    fontSize: 48,
    marginRight: spacing.base,
  },
  cardText: {
    flex: 1,
  },
  categoryTitle: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.fontWeights.bold,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  description: {
    fontSize: typography.sizes.sm,
    color: colors.text.tertiary,
  },
});
