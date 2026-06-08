import { Stack } from 'expo-router';
import { useFonts } from 'expo-font';
import * as Splash from 'expo-splash-screen';
import { useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  Geist_100Thin,
  Geist_200ExtraLight,
  Geist_300Light,
  Geist_400Regular,
  Geist_500Medium,
  Geist_600SemiBold,
  Geist_700Bold,
  Geist_800ExtraBold,
  Geist_900Black,
} from '@expo-google-fonts/geist';
import {
  GeistMono_400Regular,
  GeistMono_500Medium,
  GeistMono_600SemiBold,
  GeistMono_700Bold,
} from '@expo-google-fonts/geist-mono';

const queryClient = new QueryClient();

import '../global.css';
import { GluestackUIProvider } from '@/components/ui/gluestack-ui-provider';
import { useColorScheme } from '@/hooks/useColorScheme';

export { ErrorBoundary } from 'expo-router';

export const unstable_settings = {
  initialRouteName: 'index',
};

Splash.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    Geist_100Thin,
    Geist_200ExtraLight,
    Geist_300Light,
    Geist_400Regular,
    Geist_500Medium,
    Geist_600SemiBold,
    Geist_700Bold,
    Geist_800ExtraBold,
    Geist_900Black,
    GeistMono_400Regular,
    GeistMono_500Medium,
    GeistMono_600SemiBold,
    GeistMono_700Bold,
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) Splash.hideAsync();
  }, [loaded]);

  return (
    <QueryClientProvider client={queryClient}>
      <RootLayoutNav />
    </QueryClientProvider>
  );
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();

  return (
    <GluestackUIProvider mode={(colorScheme ?? 'light') as 'light' | 'dark'}>
      <Stack screenOptions={{ headerShown: false, animation: 'fade' }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="onboarding" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="role-select" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="login" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="sign-up" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="verify-otp" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="onboarding/tenant/basic-info" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="onboarding/tenant/nin" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="onboarding/tenant/employment" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="onboarding/tenant/preferences" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="onboarding/landlord/profile" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="onboarding/landlord/nin" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="onboarding/landlord/documents" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="onboarding/landlord/bank" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="onboarding/complete" options={{ animation: 'fade' }} />
        <Stack.Screen name="(tenant)" options={{ animation: 'fade' }} />
        <Stack.Screen name="(landlord)" options={{ animation: 'fade' }} />
      </Stack>
    </GluestackUIProvider>
  );
}
