import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { Dimensions, Platform, StyleSheet, View } from "react-native";
import Svg, { Path } from "react-native-svg";
import { useThemeColors } from "../../hooks/useTheme";
import { AuthGuard } from "../../shared/components/auth/AuthGuard";
import ConditionalComponent from "../../shared/components/conditionalComponent/conditionalComponent";

const { width } = Dimensions.get("window");

const CurvedTabBarBackground = () => {
  const colors = useThemeColors();
  const tabBarHeight = 88;
  const curveRadius = 55;
  const curveDepth = 33;

  const centerX = width / 2;

  const pathData = `
    M 0 24
    Q 0 0 24 0
    L ${centerX - curveRadius - 35} 0
    Q ${centerX - curveRadius - 5} 0 ${centerX - curveRadius + 5} ${
    curveDepth * 0.4
  }
    Q ${centerX - curveRadius * 0.6} ${curveDepth * 1.2} ${
    centerX - curveRadius * 0.3
  } ${curveDepth * 1.4}
    Q ${centerX - 12} ${curveDepth * 1.55} ${centerX} ${curveDepth * 1.55}
    Q ${centerX + 12} ${curveDepth * 1.55} ${centerX + curveRadius * 0.3} ${
    curveDepth * 1.4
  }
    Q ${centerX + curveRadius * 0.6} ${curveDepth * 1.2} ${
    centerX + curveRadius - 5
  } ${curveDepth * 0.4}
    Q ${centerX + curveRadius + 5} 0 ${centerX + curveRadius + 30} 0
    L ${width - 24} 0
    Q ${width} 0 ${width} 24
    L ${width} ${tabBarHeight}
    L 0 ${tabBarHeight}
    Z
  `;

  const styles = StyleSheet.create({
    tabBarBackground: {
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
      height: 88,
      ...Platform.select({
        ios: {
          shadowColor: colors.shadow,
          shadowOffset: {
            width: 0,
            height: -4,
          },
          shadowOpacity: colors.isDark ? 0.3 : 0.08,
          shadowRadius: 12,
        },
        android: {
          elevation: 8,
        },
        web: {
          filter: colors.isDark
            ? "drop-shadow(0 -4px 12px rgba(0, 0, 0, 0.3))"
            : "drop-shadow(0 -4px 12px rgba(0, 0, 0, 0.08))",
        },
      }),
    },
  });

  return (
    <View style={styles.tabBarBackground}>
      <Svg
        width={width}
        height={tabBarHeight}
        style={StyleSheet.absoluteFillObject}
      >
        <Path d={pathData} fill={colors.tabBarBackground} stroke="none" />
      </Svg>
    </View>
  );
};

export default function TabLayout() {
  const colors = useThemeColors();

  const styles = StyleSheet.create({
    tabIcon: {
      alignItems: "center",
      justifyContent: "center",
      width: 48,
      height: 48,
      borderRadius: 24,
    },
    homeTab: {
      width: 70,
      height: 70,
      borderRadius: 40,
      marginTop: -50,
      backgroundColor: colors.surface,
      borderWidth: 2,
      borderColor: colors.tabBarBackground,
      zIndex: 10,
      ...Platform.select({
        ios: {
          shadowColor: colors.primary,
          shadowOffset: {
            width: 0,
            height: 8,
          },
          shadowOpacity: 0.3,
          shadowRadius: 20,
        },
        android: {
          elevation: 15,
        },
      }),
    },
    activeTab: {
      backgroundColor: colors.primary,
      ...Platform.select({
        ios: {
          shadowColor: colors.primary,
          shadowOffset: {
            width: 0,
            height: 4,
          },
          shadowOpacity: 0.3,
          shadowRadius: 8,
        },
        android: {
          elevation: 6,
        },
      }),
    },
    activeHomeTab: {
      backgroundColor: colors.primary,
      borderColor: colors.tabBarBackground,
      ...Platform.select({
        ios: {
          shadowColor: colors.primary,
          shadowOffset: {
            width: 0,
            height: 8,
          },
          shadowOpacity: 0.4,
          shadowRadius: 16,
        },
        android: {
          elevation: 12,
        },
        web: {
          boxShadow: `0 8px 16px ${colors.primary}66`,
        },
      }),
    },
  });

  return (
    <AuthGuard requireDriver={true}>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: 88,
            backgroundColor: "transparent",
            borderTopWidth: 0,
            elevation: 0,
            shadowOpacity: 0,
            paddingBottom: 0,
          },
          tabBarBackground: () => <CurvedTabBarBackground />,
          tabBarShowLabel: false,
          tabBarItemStyle: {
            height: 88,
            paddingTop: 12,
            paddingBottom: 20,
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            tabBarIcon: ({ focused }) => (
              <View
                style={[
                  styles.tabIcon,
                  styles.homeTab,
                  focused && styles.activeHomeTab,
                ]}
              >
                <ConditionalComponent isValid={focused}>
                  <Ionicons name="home" size={30} color="#fff" />
                </ConditionalComponent>
                <ConditionalComponent isValid={!focused}>
                  <Ionicons name="home" size={30} color={colors.icon} />
                </ConditionalComponent>
              </View>
            ),
          }}
        />

        <Tabs.Screen
          name="explore"
          options={{
            tabBarIcon: ({ focused }) => (
              <View style={[styles.tabIcon, focused && styles.activeTab]}>
                <ConditionalComponent isValid={focused}>
                  <Ionicons name="settings" size={27} color="#fff" />
                </ConditionalComponent>
                <ConditionalComponent isValid={!focused}>
                  <Ionicons name="settings" size={27} color={colors.icon} />
                </ConditionalComponent>
              </View>
            ),
          }}
        />

        <Tabs.Screen
          name="profile"
          options={{
            tabBarIcon: ({ focused }) => (
              <View style={[styles.tabIcon, focused && styles.activeTab]}>
                <ConditionalComponent isValid={focused}>
                  <Ionicons name="person" size={27} color="#fff" />
                </ConditionalComponent>
                <ConditionalComponent isValid={!focused}>
                  <Ionicons name="person" size={27} color={colors.icon} />
                </ConditionalComponent>
              </View>
            ),
          }}
        />

        <Tabs.Screen
          name="edit-profile"
          options={{
            href: null, // Hide from tab bar
          }}
        />
      </Tabs>
    </AuthGuard>
  );
}
