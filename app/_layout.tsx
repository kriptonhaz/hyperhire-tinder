import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import 'react-native-reanimated';
import Animated, { FadeOut } from 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { Image } from 'expo-image';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export const unstable_settings = {
  anchor: '(tabs)',
};

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
});

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [isSplashVisible, setSplashVisible] = useState(true);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Simulate asset loading or wait for other resources
    const prepare = async () => {
      try {
        // Artificially delay for a moment or load other resources here
        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (e) {
        console.warn(e);
      } finally {
        setIsReady(true);
        SplashScreen.hideAsync();
      }
    };

    prepare();
  }, []);

  useEffect(() => {
    if (isReady) {
      setSplashVisible(false);
    }
  }, [isReady]);

  if (!isReady) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
          </Stack>
          
          {isSplashVisible && (
            <Animated.View 
              exiting={FadeOut.duration(1000)}
              style={[
                StyleSheet.absoluteFill, 
                { 
                  backgroundColor: '#ffffff', 
                  justifyContent: 'center', 
                  alignItems: 'center',
                  zIndex: 99999 
                }
              ]}
            >
              <Image
                source={require('../assets/images/tinder-logo-transparent.png')}
                style={{ width: 200, height: 200 }}
                contentFit="contain"
              />
            </Animated.View>
          )}

          <StatusBar style="auto" />
        </ThemeProvider>
      </GestureHandlerRootView>
    </QueryClientProvider>
  );
}
