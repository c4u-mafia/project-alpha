import { Stack } from 'expo-router';
import { useFonts } from 'expo-font';
import * as Splash from 'expo-splash-screen';
import { useEffect } from 'react';

import '../global.css';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export const prevConfig = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: 'index',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
Splash.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    // We can add custom fonts here if needed, 
    // but NativeWind uses system/CSS fonts by default.
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      Splash.hideAsync();
    }
  }, [loaded]);

  // Loading indicator or empty view while fonts load
  // if (!loaded) return null;

  return <RootStack />;
}

function RootStack() {
  return (
    <Stack screenOptions={{ headerShown: false, animation: 'fade' }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="onboarding" />
      <Stack.Screen name="login" />
    </Stack>
  );
}
