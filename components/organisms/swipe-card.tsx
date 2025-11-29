import { IconSymbol } from '@/components/atoms/icon-symbol';
import type { Profile } from '@/types/profile';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { forwardRef, useImperativeHandle, useState } from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View
} from 'react-native';
import { PanGestureHandler } from 'react-native-gesture-handler';
import Animated, {
  Extrapolate,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  type SharedValue,
} from 'react-native-reanimated';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const CARD_WIDTH = SCREEN_WIDTH;
const CARD_HEIGHT = SCREEN_HEIGHT * 0.7;
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.25;

interface SwipeCardProps {
  profile: Profile;
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
  stackIndex: number;
  activeOffsetX?: SharedValue<number>;
  animatedText?: boolean;
}

export interface SwipeCardRef {
  swipeLeft: () => void;
  swipeRight: () => void;
}

export const SwipeCard = forwardRef<SwipeCardRef, SwipeCardProps>(
  ({ profile, onSwipeLeft, onSwipeRight, stackIndex, activeOffsetX, animatedText = true }, ref) => {
    const internalX = useSharedValue(0);
    const translateX = (stackIndex === 0 && activeOffsetX) ? activeOffsetX : internalX;
    const translateY = useSharedValue(0);
    const startX = useSharedValue(0);
    const startY = useSharedValue(0);
    const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

    const handleCardTap = (event: any) => {
      const { locationX } = event.nativeEvent;
      const cardMiddle = CARD_WIDTH / 2;
      
      if (locationX > cardMiddle) {
        // Tapped right side - next photo
        setCurrentPhotoIndex((prev) => 
          prev < profile.images.length - 1 ? prev + 1 : prev
        );
      } else {
        // Tapped left side - previous photo
        setCurrentPhotoIndex((prev) => prev > 0 ? prev - 1 : prev);
      }
    };

    useImperativeHandle(ref, () => ({
      swipeLeft: () => {
        // Start animation first with timing for controlled speed
        translateX.value = withTiming(
          -SCREEN_WIDTH * 1.5,
          { duration: 400 } // 400ms animation
        );
        // Call callback after a tiny delay to let animation start
        setTimeout(() => {
          onSwipeLeft();
        }, 50);
      },
      swipeRight: () => {
        // Start animation first with timing for controlled speed
        translateX.value = withTiming(
          SCREEN_WIDTH * 1.5,
          { duration: 400 } // 400ms animation
        );
        // Call callback after a tiny delay to let animation start
        setTimeout(() => {
          onSwipeRight();
        }, 50);
      },
    }));

    const onGestureEvent = (event: any) => {
      'worklet';
      if (event.nativeEvent.state === 4) { // ACTIVE (not 2!)
        translateX.value = startX.value + event.nativeEvent.translationX;
        translateY.value = startY.value + event.nativeEvent.translationY;
      }
    };

    const onHandlerStateChange = (event: any) => {
      'worklet';
      if (event.nativeEvent.oldState === 4) { // Was ACTIVE, now ending
        if (Math.abs(translateX.value) > SWIPE_THRESHOLD) {
          const direction = translateX.value > 0 ? 1 : -1;
          
          // Call callback immediately
          if (direction > 0) {
            runOnJS(onSwipeRight)();
          } else {
            runOnJS(onSwipeLeft)();
          }
          
          // Then animate off screen
          translateX.value = withSpring(
            direction * SCREEN_WIDTH * 1.5,
            { damping: 20, stiffness: 90 }
          );
        } else {
          translateX.value = withSpring(0);
          translateY.value = withSpring(0);
        }
      } else if (event.nativeEvent.state === 2) { // BEGAN
        startX.value = translateX.value;
        startY.value = translateY.value;
      }
    };

    const cardStyle = useAnimatedStyle(() => {
      const rotate = interpolate(
        translateX.value,
        [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
        [-15, 0, 15],
        Extrapolate.CLAMP
      );

      const scale = 1 - stackIndex * 0.05;
      const translateYOffset = stackIndex * 24;

      return {
        transform: [
          { translateX: translateX.value },
          { translateY: translateY.value + translateYOffset },
          { rotate: `${rotate}deg` },
          { scale },
        ],
      };
    });

    const likeOpacityStyle = useAnimatedStyle(() => ({
      opacity: interpolate(
        translateX.value,
        [0, SWIPE_THRESHOLD],
        [0, 1],
        Extrapolate.CLAMP
      ),
    }));

    const nopeOpacityStyle = useAnimatedStyle(() => ({
      opacity: interpolate(
        translateX.value,
        [-SWIPE_THRESHOLD, 0],
        [1, 0],
        Extrapolate.CLAMP
      ),
    }));

    const overlayStyle = useAnimatedStyle(() => {
      if (!activeOffsetX) return { opacity: 1 };
      
      return {
        opacity: interpolate(
          Math.abs(activeOffsetX.value),
          [0, SWIPE_THRESHOLD],
          [1, 0],
          Extrapolate.CLAMP
        ),
      };
    });

    return (
      <PanGestureHandler
        onGestureEvent={onGestureEvent}
        onHandlerStateChange={onHandlerStateChange}
        enabled={stackIndex === 0}>
        <Animated.View style={[styles.card, cardStyle, { zIndex: 100 - stackIndex }]}>
          <TouchableWithoutFeedback onPress={handleCardTap}>
            <View style={styles.cardContent}>
              {/* Photo Indicator Bars */}
              <View style={styles.photoIndicatorContainer}>
                {profile.images.map((_, index) => (
                  <View
                    key={index}
                    style={[
                      styles.photoIndicatorBar,
                      {
                        flex: 1,
                        backgroundColor: index === currentPhotoIndex 
                          ? 'rgba(255, 255, 255, 0.9)' 
                          : 'rgba(255, 255, 255, 0.3)',
                      },
                    ]}
                  />
                ))}
              </View>

              <Image
                source={{ uri: profile.images[currentPhotoIndex] }}
                style={styles.image}
                contentFit="cover"
              />
            </View>
          </TouchableWithoutFeedback>
          

          {
            animatedText && 
            <Animated.View style={[styles.likeOverlay, likeOpacityStyle]}>
              <Text style={styles.likeText}>LIKE</Text>
            </Animated.View>
          }
          
          {
            animatedText && 
            <Animated.View style={[styles.nopeOverlay, nopeOpacityStyle]}>
              <Text style={styles.nopeText}>NOPE</Text>
            </Animated.View>
          }

          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.9)']}
            style={styles.infoContainer}
          >
            <View style={styles.nameRow}>
              <Text style={styles.name}>
                {profile.name} {profile.age}
              </Text>
              {profile.verified && (
                <View style={styles.verifiedBadge}>
                  <IconSymbol name="checkmark.seal.fill" size={20} color="#2196F3" />
                </View>
              )}
            </View>
            
            <View style={styles.locationRow}>
              <IconSymbol name="location-pin" size={16} color="#fff" forceMaterialIcon iconLibrary='SimpleLineIcons'/>
              <Text style={styles.location}>
                {profile.distance}km away
              </Text>
            </View>

            {profile.bio && (
              <Text style={styles.bio} numberOfLines={2}>
                {profile.bio}
              </Text>
            )}
          </LinearGradient>

          {stackIndex > 0 && (
            <Animated.View style={[styles.nextCardOverlay, overlayStyle]} />
          )}
        </Animated.View>
      </PanGestureHandler>
    );
  }
);

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: 16,
    position: 'absolute',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    overflow: 'hidden',
  },
  cardContent: {
    width: '100%',
    height: '100%',
  },
  photoIndicatorContainer: {
    position: 'absolute',
    top: 8,
    left: 8,
    right: 8,
    flexDirection: 'row',
    gap: 4,
    zIndex: 10,
  },
  photoIndicatorBar: {
    height: 3,
    borderRadius: 2,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  likeOverlay: {
    position: 'absolute',
    top: 50,
    left: 30,
    borderWidth: 4,
    borderColor: '#4CAF50',
    borderRadius: 8,
    padding: 8,
    transform: [{ rotate: '-20deg' }],
  },
  likeText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#4CAF50',
    letterSpacing: 2,
  },
  nopeOverlay: {
    position: 'absolute',
    top: 50,
    right: 30,
    borderWidth: 4,
    borderColor: '#F44336',
    borderRadius: 8,
    padding: 8,
    transform: [{ rotate: '20deg' }],
  },
  nopeText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#F44336',
    letterSpacing: 2,
  },
  infoContainer: {
    position: 'absolute',
    bottom: 0,
    height: 180,
    left: 0,
    right: 0,
    padding: 20,
    paddingTop: 40,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  name: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginRight: 8,
  },
  verifiedBadge: {
    marginLeft: 4,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  location: {
    fontSize: 16,
    color: '#fff',
    marginLeft: 4,
  },
  bio: {
    fontSize: 14,
    color: '#fff',
    marginTop: 4,
  },
  nextCardOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgb(208,215,232)',
    borderRadius: 16,
  },
});

