import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import { PaperProvider } from 'react-native-paper';

import { useColorScheme } from '@/components/useColorScheme';
// Import i18n to ensure it's initialized
import '@/utils/i18n';
import { delight } from '@/utils/delight';
import { CelebrationProvider } from '@/contexts/CelebrationContext';
import {
  syncWaterNudgeSchedule,
  registerWaterNudgeAppStateResync,
} from '@/utils/waterNudgeScheduler';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  initialRouteName: 'index',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });
  const [showApp, setShowApp] = useState(false);

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) {
      console.error('Font loading error:', error);
      // Don't throw, just log - allow app to continue
      setShowApp(true);
    }
  }, [error]);

  useEffect(() => {
    if (loaded) {
      // Hide splash screen after fonts load
      SplashScreen.hideAsync().catch(err => {
        console.log('Splash screen hide error:', err);
      });
      setShowApp(true);
    } else {
      // Timeout: show app after 2 seconds even if fonts fail
      const timeout = setTimeout(() => {
        setShowApp(true);
        SplashScreen.hideAsync().catch(() => {});
      }, 2000);
      
      return () => clearTimeout(timeout);
    }
  }, [loaded]);

  // Show app after timeout or when fonts load
  if (!showApp) {
    return null;
  }

  // Always show app - fonts are optional
  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();

  useEffect(() => {
    void delight.initialize();
    void syncWaterNudgeSchedule();
    const removeAppState = registerWaterNudgeAppStateResync();
    return () => {
      removeAppState();
      delight.dispose();
    };
  }, []);

  return (
    <PaperProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <CelebrationProvider>
          <Stack>
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name="onboarding" options={{ headerShown: false }} />
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
          </Stack>
        </CelebrationProvider>
      </ThemeProvider>
    </PaperProvider>
  );
}
