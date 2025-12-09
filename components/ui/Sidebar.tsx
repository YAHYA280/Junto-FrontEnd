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
import { Ionicons } from '@expo/vector-icons';
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
    { label: 'Home', icon: 'home', route: '/(tabs)' },
    { label: 'My Deals', icon: 'briefcase', route: '/(tabs)/explore', showForSeller: true },
    { label: 'Profile', icon: 'person', route: '/(tabs)/profile' },
    { label: 'Edit Profile', icon: 'create', route: '/(tabs)/edit-profile' },
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
            <View style={[
              styles.sidebar,
              {
                backgroundColor: isDark ? colors.surface : '#FFFFFF',
                borderRightWidth: 1,
                borderRightColor: isDark ? colors.border : '#E5E7EB',
              }
            ]}>
              {/* User Profile Section */}
              <View style={[styles.profileSection, { borderBottomColor: isDark ? colors.border : '#E5E7EB' }]}>
                <View style={[
                  styles.avatar,
                  {
                    backgroundColor: colors.primary,
                    borderWidth: 2,
                    borderColor: isDark ? colors.primaryLight : colors.primaryDark,
                    shadowColor: colors.primary,
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.3,
                    shadowRadius: 6,
                    elevation: 4,
                  }
                ]}>
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
                      {
                        backgroundColor: colors.primary,
                        borderWidth: 1,
                        borderColor: isDark ? colors.primaryLight : colors.primaryDark,
                        shadowColor: colors.primary,
                        shadowOffset: { width: 0, height: 3 },
                        shadowOpacity: 0.35,
                        shadowRadius: 6,
                        elevation: 5,
                      },
                    ]}
                    onPress={() => handleNavigation('/deals/create')}
                    activeOpacity={0.7}
                  >
                    <Ionicons name="add-circle" size={20} color="#FFFFFF" />
                    <Text style={styles.createDealText}>Create Deal</Text>
                  </TouchableOpacity>
                )}

                {/* Regular Menu Items */}
                {menuItems
                  .filter((item: any) => !item.showForSeller || isSeller)
                  .map((item, index) => {
                    return (
                      <TouchableOpacity
                        key={index}
                        style={[
                          styles.menuItem,
                          {
                            backgroundColor: isDark ? colors.backgroundSecondary : '#F9FAFB',
                            borderWidth: 1,
                            borderColor: isDark ? colors.border : '#E5E7EB',
                            shadowColor: '#000000',
                            shadowOffset: { width: 0, height: 1 },
                            shadowOpacity: isDark ? 0.2 : 0.06,
                            shadowRadius: 3,
                            elevation: 2,
                          },
                        ]}
                        onPress={() => handleNavigation(item.route)}
                        activeOpacity={0.7}
                      >
                        <View style={styles.menuIconContainer}>
                          <Ionicons name={item.icon as any} size={24} color={colors.textSecondary} />
                        </View>
                        <Text style={[styles.menuLabel, { color: colors.text }]}>
                          {item.label}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
              </View>

              {/* Logout Button */}
              <View style={styles.bottomSection}>
                <TouchableOpacity
                  style={[
                    styles.logoutButton,
                    {
                      backgroundColor: isDark ? colors.error + '22' : '#FEF2F2',
                      borderColor: colors.error,
                      shadowColor: colors.error,
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: 0.15,
                      shadowRadius: 4,
                      elevation: 2,
                    },
                  ]}
                  onPress={handleLogout}
                  activeOpacity={0.7}
                >
                  <Ionicons name="log-out" size={20} color={colors.error} />
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
    shadowColor: '#000000',
    shadowOffset: { width: 4, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 20,
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
    gap: 8,
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginBottom: 16,
    borderRadius: 12,
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
  menuIconContainer: {
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
    gap: 8,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 1,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
