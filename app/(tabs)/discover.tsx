import { SwipeCard, type SwipeCardRef } from '@/components/organisms/swipe-card';
import { likedProfilesState } from '@/store/liked-profiles';
import { Image } from 'expo-image';
import { useAtomValue } from 'jotai';
import { useEffect, useRef, useState } from 'react';
import { Platform, SafeAreaView, StatusBar, StyleSheet, Text, View } from 'react-native';
import { useSharedValue } from 'react-native-reanimated';

export default function DiscoverScreen() {
  const likedProfiles = useAtomValue(likedProfilesState);
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

  const visibleProfiles = likedProfiles.slice(currentIndex, currentIndex + 2);

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
            <Text style={styles.emptyText}>No liked profiles yet</Text>
            <Text style={styles.emptySubtext}>Go back to home and like some profiles!</Text>
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
              animatedText={false}
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
