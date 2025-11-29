import { SwipeCard, type SwipeCardRef } from '@/components/organisms/swipe-card';
import { useProfiles } from '@/hooks/useProfiles';
import { Image } from 'expo-image';
import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Platform, SafeAreaView, StatusBar, StyleSheet, Text, View } from 'react-native';
import { useSharedValue } from 'react-native-reanimated';

export default function DiscoverScreen() {
  const { data: profiles, isLoading, error } = useProfiles();
  const [currentIndex, setCurrentIndex] = useState(0);
  const swipeCardRef = useRef<SwipeCardRef>(null);
  const activeOffsetX = useSharedValue(0);

  useEffect(() => {
    activeOffsetX.value = 0;
  }, [currentIndex]);

  const handleSwipeLeft = () => {
    setCurrentIndex((prev) => prev + 1);
  };

  const handleSwipeRight = () => {
    setCurrentIndex((prev) => prev + 1);
  };

  const visibleProfiles = profiles?.slice(currentIndex, currentIndex + 2) || [];

  // Loading state
  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <View style={styles.header}>
          <Image
            source={require('@/assets/images/tinder-logo-with-text.svg')}
            style={styles.logo}
            contentFit="contain"
          />
        </View>
        <View style={[styles.cardsContainer, styles.centerContent]}>
          <ActivityIndicator size="large" color="#FE3C72" />
          <Text style={styles.loadingText}>Loading profiles...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Error state
  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <View style={styles.header}>
          <Image
            source={require('@/assets/images/tinder-logo-with-text.svg')}
            style={styles.logo}
            contentFit="contain"
          />
        </View>
        <View style={[styles.cardsContainer, styles.centerContent]}>
          <Text style={styles.errorText}>Failed to load profiles</Text>
          <Text style={styles.emptySubtext}>Please try again later</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <Image
          source={require('@/assets/images/tinder-logo-with-text.svg')}
          style={styles.logo}
          contentFit="contain"
        />
      </View>

      {/* Cards Container */}
      <View style={styles.cardsContainer}>
        {visibleProfiles.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No more profiles</Text>
            <Text style={styles.emptySubtext}>Check back later for new matches!</Text>
          </View>
        ) : (
          visibleProfiles.map((profile, index) => (
            <SwipeCard
              key={`${currentIndex + index}-${profile.id}`}
              ref={index === 0 ? swipeCardRef : null}
              profile={profile}
              onSwipeLeft={handleSwipeLeft}
              onSwipeRight={handleSwipeRight}
              stackIndex={index}
              activeOffsetX={activeOffsetX}
            />
          ))
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fafafa',
  },
  header: {
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: Platform.OS === 'ios' ? 0 : StatusBar.currentHeight,
  },
  logo: {
    width: 120,
    height: undefined,
    aspectRatio: 1,
  },
  cardsContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 20, // Reduced padding since no action buttons
  },
  emptyState: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 16,
    color: '#666',
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
    marginTop: 16,
  },
  errorText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#F44336',
    marginBottom: 8,
  },
});
