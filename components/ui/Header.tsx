import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { BlurView } from 'expo-blur';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuthStore } from '../../store/authStore';
import { Sidebar } from './Sidebar';

interface HeaderProps {
  title?: string;
  showBackButton?: boolean;
  onBackPress?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  title = 'Home',
  showBackButton = false,
  onBackPress,
}) => {
  const { colors, isDark } = useTheme();
  const { user } = useAuthStore();
  const [sidebarVisible, setSidebarVisible] = useState(false);

  return (
    <>
      <View style={[styles.container, { borderBottomColor: colors.glassBorder }]}>
        <BlurView
          intensity={isDark ? 50 : 40}
          tint={isDark ? 'dark' : 'light'}
          style={styles.blurContainer}
        >
          <View style={[styles.content, { backgroundColor: colors.glassBackground }]}>
            {/* Left Side - Menu Button */}
            <TouchableOpacity
              style={[styles.iconButton, { backgroundColor: colors.glassBackgroundLight }]}
              onPress={() => setSidebarVisible(true)}
              activeOpacity={0.7}
            >
              <View style={styles.menuIcon}>
                <View style={[styles.menuLine, { backgroundColor: colors.text }]} />
                <View style={[styles.menuLine, { backgroundColor: colors.text }]} />
                <View style={[styles.menuLine, { backgroundColor: colors.text }]} />
              </View>
            </TouchableOpacity>

            {/* Center - Title */}
            <Text style={[styles.title, { color: colors.text }]} numberOfLines={1}>
              {title}
            </Text>

            {/* Right Side - User Avatar */}
            <TouchableOpacity
              style={[styles.iconButton, { backgroundColor: colors.primary }]}
              onPress={() => setSidebarVisible(true)}
              activeOpacity={0.7}
            >
              <Text style={styles.avatarText}>
                {user?.firstName?.[0]?.toUpperCase() || 'U'}
              </Text>
            </TouchableOpacity>
          </View>
        </BlurView>
      </View>

      {/* Sidebar */}
      <Sidebar visible={sidebarVisible} onClose={() => setSidebarVisible(false)} />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderBottomWidth: 1,
  },
  blurContainer: {
    overflow: 'hidden',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 12,
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  menuIcon: {
    width: 20,
    height: 16,
    justifyContent: 'space-between',
  },
  menuLine: {
    height: 2,
    borderRadius: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 16,
  },
  avatarText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});
