import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { Platform, StyleSheet, View } from "react-native";
import { useThemeColors } from "../../hooks/useTheme";
import { AuthGuard } from "../../shared/components/auth/AuthGuard";
import ConditionalComponent from "../../shared/components/conditionalComponent/conditionalComponent";

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
            height: 80,
            backgroundColor: colors.tabBarBackground,
            borderTopWidth: 0,
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
            paddingBottom: Platform.OS === 'ios' ? 24 : 12,
            paddingTop: 12,
            ...Platform.select({
              ios: {
                shadowColor: colors.shadow,
                shadowOffset: {
                  width: 0,
                  height: -4,
                },
                shadowOpacity: 0.15,
                shadowRadius: 12,
              },
              android: {
                elevation: 12,
              },
            }),
          },
          tabBarShowLabel: false,
          tabBarItemStyle: {
            height: 56,
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            tabBarIcon: ({ focused }) => (
              <View style={[styles.tabIcon, focused && styles.activeTab]}>
                <ConditionalComponent isValid={focused}>
                  <Ionicons name="home" size={27} color="#fff" />
                </ConditionalComponent>
                <ConditionalComponent isValid={!focused}>
                  <Ionicons name="home-outline" size={27} color={colors.icon} />
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
                  <Ionicons name="briefcase" size={27} color="#fff" />
                </ConditionalComponent>
                <ConditionalComponent isValid={!focused}>
                  <Ionicons name="briefcase-outline" size={27} color={colors.icon} />
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
                  <Ionicons name="person-outline" size={27} color={colors.icon} />
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
