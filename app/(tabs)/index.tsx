import { ActionButtons } from '@/components/organisms/action-buttons';
import { SwipeCard, type SwipeCardRef } from '@/components/organisms/swipe-card';
import { useProfiles } from '@/hooks/useProfiles';
import { likedProfilesState } from '@/store/liked-profiles';
import { Image } from 'expo-image';
import { useSetAtom } from 'jotai';
import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Platform, SafeAreaView, StatusBar, StyleSheet, Text, View } from 'react-native';
import { useSharedValue } from 'react-native-reanimated';

export default function HomeScreen() {
  const { data: profiles, isLoading, error } = useProfiles();
  const [currentIndex, setCurrentIndex] = useState(0);
  const swipeCardRef = useRef<SwipeCardRef>(null);
  const activeOffsetX = useSharedValue(0);
  const setLikedProfiles = useSetAtom(likedProfilesState);

  useEffect(() => {
    activeOffsetX.value = 0;
  }, [currentIndex]);

  const handleSwipeLeft = () => {
    setCurrentIndex((prev) => prev + 1);
  };

  const handleSwipeRight = () => {
    if (profiles && profiles[currentIndex]) {
      setLikedProfiles((prev) => [...prev, profiles[currentIndex]]);
    }
    setCurrentIndex((prev) => prev + 1);
  };

  const handleDislike = () => {
    swipeCardRef.current?.swipeLeft();
  };

  const handleLike = () => {
    swipeCardRef.current?.swipeRight();
  };

  const handleRewind = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleStar = () => {
    console.log('Super liked:', profiles?.[currentIndex]?.name);
    swipeCardRef.current?.swipeRight();
  };

  const handleBoost = () => {
    console.log('Boost activated');
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

      {/* Action Buttons */}
      {visibleProfiles.length > 0 && (
        <View style={styles.actionButtonsContainer}>
          <ActionButtons
            onRewind={handleRewind}
            onDislike={handleDislike}
            onStar={handleStar}
            onLike={handleLike}
            onBoost={handleBoost}
          />
        </View>
      )}
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
    paddingBottom: 60, // Space for action buttons
  },
  actionButtonsContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingBottom: 20,
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

