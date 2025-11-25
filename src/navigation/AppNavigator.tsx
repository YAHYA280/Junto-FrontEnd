import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { HomeScreen, CategoriesScreen, AddDealScreen, ProfileScreen } from '../screens';
import { BottomNav, NavRoute } from '../components';

export const AppNavigator: React.FC = () => {
  const [activeRoute, setActiveRoute] = useState<NavRoute>('Home');

  const renderScreen = () => {
    switch (activeRoute) {
      case 'Home':
        return <HomeScreen />;
      case 'Categories':
        return <CategoriesScreen />;
      case 'AddDeal':
        return <AddDealScreen />;
      case 'Profile':
        return <ProfileScreen />;
      default:
        return <HomeScreen />;
    }
  };

  return (
    <View style={styles.container}>
      {renderScreen()}
      <BottomNav activeRoute={activeRoute} onRouteChange={setActiveRoute} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
