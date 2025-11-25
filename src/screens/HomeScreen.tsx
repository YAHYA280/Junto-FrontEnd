import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  RefreshControl,
  Platform,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
  GlassHeader,
  CategoryTabs,
  DealCard,
  DealCategory,
  SectionHeader,
} from '../components';
import { useDeals } from '../context';
import { colors, spacing } from '../theme';

export const HomeScreen: React.FC = () => {
  const { deals, loading, activeCategory, setActiveCategory, fetchDeals, refreshDeals } = useDeals();
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchDeals();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await refreshDeals();
    setRefreshing(false);
  };

  const handleCategoryChange = (category: DealCategory) => {
    setActiveCategory(category);
  };

  const renderHeader = () => (
    <View style={styles.listHeader}>
      <SectionHeader
        title="Browse Deals"
        subtitle="View All"
        onPress={() => console.log('View all deals')}
      />
      <CategoryTabs
        activeCategory={activeCategory}
        onCategoryChange={handleCategoryChange}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Background Gradient */}
      <LinearGradient
        colors={colors.gradients.background}
        style={styles.background}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />

      {/* Glass Header */}
      <GlassHeader
        title="NexTrip Deals"
        showSearch={false}
      />

      {/* Deals List */}
      <FlatList
        data={deals}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <DealCard
            deal={item}
            onPress={() => console.log('Deal pressed:', item.id)}
          />
        )}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={colors.lightBlue}
            colors={[colors.lightBlue, colors.primaryBlue]}
          />
        }
      />
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
  listContent: {
    paddingTop: Platform.OS === 'ios' ? 140 : 120,
    paddingBottom: 120,
  },
  listHeader: {
    marginBottom: spacing.md,
  },
});
