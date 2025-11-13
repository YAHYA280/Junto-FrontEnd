import React from 'react';
import {
  Dimensions,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Animated,
  Pressable,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuthStore } from '../../store/authStore';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');
const SIDEBAR_WIDTH = width * 0.75;

interface SidebarProps {
  visible: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ visible, onClose }) => {
  const { colors, isDark } = useTheme();
  const { user, logout } = useAuthStore();
  const router = useRouter();
  const slideAnim = React.useRef(new Animated.Value(-SIDEBAR_WIDTH)).current;

  React.useEffect(() => {
    if (visible) {
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 65,
        friction: 11,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: -SIDEBAR_WIDTH,
        duration: 250,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  const handleNavigation = (route: string) => {
    onClose();
    setTimeout(() => {
      router.push(route as any);
    }, 300);
  };

  const handleLogout = () => {
    onClose();
    setTimeout(() => {
      logout();
      router.replace('/(auth)');
    }, 300);
  };

  const isSeller = user?.roles?.includes('SELLER' as any);

  const menuItems = [
    { label: 'Home', icon: '🏠', route: '/(tabs)' },
    { label: 'My Deals', icon: '💼', route: '/(tabs)/explore', showForSeller: true },
    { label: 'Profile', icon: '👤', route: '/(tabs)/profile' },
    { label: 'Edit Profile', icon: '✏️', route: '/(tabs)/edit-profile' },
  ];

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View style={styles.modalContainer}>
        <Pressable style={styles.overlay} onPress={onClose}>
          <View style={[styles.overlayBackground, { backgroundColor: colors.shadow }]} />
        </Pressable>

        <Animated.View
          style={[
            styles.sidebarContainer,
            {
              transform: [{ translateX: slideAnim }],
            },
          ]}
        >
          <BlurView
            intensity={isDark ? 80 : 60}
            tint={isDark ? 'dark' : 'light'}
            style={styles.blurContainer}
          >
            <View style={[styles.sidebar, { backgroundColor: colors.glassBackground }]}>
              {/* User Profile Section */}
              <View style={[styles.profileSection, { borderBottomColor: colors.border }]}>
                <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
                  <Text style={styles.avatarText}>
                    {user?.displayName?.[0]?.toUpperCase() || 'U'}
                  </Text>
                </View>
                <Text style={[styles.userName, { color: colors.text }]}>
                  {user?.displayName || 'User'}
                </Text>
                <Text style={[styles.userEmail, { color: colors.textSecondary }]}>
                  {user?.email || user?.phoneE164 || ''}
                </Text>
              </View>

              {/* Menu Items */}
              <View style={styles.menuSection}>
                {/* Create Deal Button for Sellers */}
                {isSeller && (
                  <TouchableOpacity
                    style={[
                      styles.createDealButton,
                      { backgroundColor: colors.primary },
                    ]}
                    onPress={() => handleNavigation('/deals/create')}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.createDealIcon}>➕</Text>
                    <Text style={styles.createDealText}>Create Deal</Text>
                  </TouchableOpacity>
                )}

                {/* Regular Menu Items */}
                {menuItems
                  .filter((item: any) => !item.showForSeller || isSeller)
                  .map((item, index) => (
                    <TouchableOpacity
                      key={index}
                      style={[
                        styles.menuItem,
                        { backgroundColor: colors.glassBackgroundLight },
                      ]}
                      onPress={() => handleNavigation(item.route)}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.menuIcon}>{item.icon}</Text>
                      <Text style={[styles.menuLabel, { color: colors.text }]}>
                        {item.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
              </View>

              {/* Logout Button */}
              <View style={styles.bottomSection}>
                <TouchableOpacity
                  style={[
                    styles.logoutButton,
                    {
                      backgroundColor: colors.error + '22',
                      borderColor: colors.error + '44',
                    },
                  ]}
                  onPress={handleLogout}
                  activeOpacity={0.7}
                >
                  <Text style={styles.logoutIcon}>🚪</Text>
                  <Text style={[styles.logoutText, { color: colors.error }]}>
                    Logout
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </BlurView>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
  },
  overlayBackground: {
    flex: 1,
    opacity: 0.5,
  },
  sidebarContainer: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: SIDEBAR_WIDTH,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 16,
  },
  blurContainer: {
    flex: 1,
  },
  sidebar: {
    flex: 1,
    paddingTop: 60,
  },
  profileSection: {
    padding: 24,
    borderBottomWidth: 1,
    alignItems: 'center',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  userName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
  },
  menuSection: {
    flex: 1,
    paddingTop: 16,
    paddingHorizontal: 16,
  },
  createDealButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginBottom: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  createDealIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  createDealText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginBottom: 8,
    borderRadius: 12,
  },
  menuIcon: {
    fontSize: 24,
    marginRight: 16,
  },
  menuLabel: {
    fontSize: 16,
    fontWeight: '500',
  },
  bottomSection: {
    padding: 16,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 1,
  },
  logoutIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
