import { DarkTheme, ThemeProvider } from '@react-navigation/native';
import { QueryClientProvider } from '@tanstack/react-query';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { AppSettingsProvider } from '@/context/AppSettingsContext';
import { AuthProvider } from '@/context/AuthContext';
import { NetworkProvider, OfflineBanner } from '@/context/NetworkContext';
import { ToastProvider } from '@/context/ToastContext';
import { queryClient } from '@/lib/queryClient';

export { ErrorBoundary } from 'expo-router';

export const unstable_settings = {
  initialRouteName: 'index',
};

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <NetworkProvider>
        <ToastProvider>
          <AppSettingsProvider>
            <AuthProvider>
              <ThemeProvider value={DarkTheme}>
                <StatusBar style="light" />
                <OfflineBanner />
                <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: '#080B10' } }}>
                  <Stack.Screen name="index" />
                  <Stack.Screen name="onboarding" />
                  <Stack.Screen name="login" />
                  <Stack.Screen name="register" />
                  <Stack.Screen name="forgot-password" />
                  <Stack.Screen name="verify-reset-otp" />
                  <Stack.Screen name="reset-password" />
                  <Stack.Screen name="(tabs)" />
                  <Stack.Screen name="workout/[id]" />
                  <Stack.Screen name="workout/[id]/edit" />
                  <Stack.Screen name="profile/edit" />
                  <Stack.Screen name="settings" />
                </Stack>
              </ThemeProvider>
            </AuthProvider>
          </AppSettingsProvider>
        </ToastProvider>
      </NetworkProvider>
    </QueryClientProvider>
  );
}
