import { ActionButtons } from '@/components/action-buttons';
import { SwipeCard, type SwipeCardRef } from '@/components/swipe-card';
import { mockProfiles, type Profile } from '@/types/profile';
import { Image } from 'expo-image';
import React, { useRef, useState } from 'react';
import { Platform, SafeAreaView, StatusBar, StyleSheet, Text, View } from 'react-native';

export default function HomeScreen() {
  const [profiles, setProfiles] = useState<Profile[]>(mockProfiles);
  const [currentIndex, setCurrentIndex] = useState(0);
  const swipeCardRef = useRef<SwipeCardRef>(null);

  const handleSwipeLeft = () => {
    setCurrentIndex((prev) => prev + 1);
  };

  const handleSwipeRight = () => {
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
    console.log('Super liked:', profiles[currentIndex]?.name);
    swipeCardRef.current?.swipeRight();
  };

  const handleBoost = () => {
    console.log('Boost activated');
  };

  const visibleProfiles = profiles.slice(currentIndex, currentIndex + 3);

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
            />
          ))
        )}
      </View>

      {/* Action Buttons */}
      {visibleProfiles.length > 0 && (
        <ActionButtons
          onRewind={handleRewind}
          onDislike={handleDislike}
          onStar={handleStar}
          onLike={handleLike}
          onBoost={handleBoost}
        />
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
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 20,
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
});

