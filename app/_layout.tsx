import { Stack } from 'expo-router';
import 'react-native-reanimated';
import { useEffect } from 'react';
import { useRouter, useSegments } from 'expo-router';

import { useAuthStore } from '../store/authStore';
import { ThemeProvider } from '../contexts/ThemeContext';

export const unstable_settings = {
  initialRouteName: '(auth)',
};

function useProtectedRoute() {
  const segments = useSegments();
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    const inAuthGroup = segments[0] === '(auth)';

    if (!isAuthenticated && !inAuthGroup) {
      router.replace('/(auth)');
    } else if (isAuthenticated && inAuthGroup) {
      router.replace('/(tabs)');
    }
  }, [isAuthenticated, segments]);
}

export default function RootLayout() {
  useProtectedRoute();

  return (
    <ThemeProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
      </Stack>
    </ThemeProvider>
  );
}
