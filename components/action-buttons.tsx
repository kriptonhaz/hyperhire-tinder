import { IconSymbol } from '@/components/ui/icon-symbol';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

interface ActionButtonsProps {
  onRewind?: () => void;
  onDislike: () => void;
  onStar?: () => void;
  onLike: () => void;
  onBoost?: () => void;
}

export function ActionButtons({
  onRewind,
  onDislike,
  onStar,
  onLike,
  onBoost,
}: ActionButtonsProps) {
  return (
    <View style={styles.container}>
      {/* Rewind Button */}
      <TouchableOpacity
        style={[styles.button, styles.smallButton, styles.rewindButton]}
        onPress={onRewind}
        activeOpacity={0.7}>
        <IconSymbol name="arrow.uturn.backward" size={24} color="#FFC107" />
      </TouchableOpacity>

      {/* Dislike Button */}
      <TouchableOpacity
        style={[styles.button, styles.largeButton, styles.dislikeButton]}
        onPress={onDislike}
        activeOpacity={0.7}>
        <IconSymbol name="xmark" size={32} color="#F44336" />
      </TouchableOpacity>

      {/* Star Button */}
      <TouchableOpacity
        style={[styles.button, styles.smallButton, styles.starButton]}
        onPress={onStar}
        activeOpacity={0.7}>
        <IconSymbol name="star.fill" size={24} color="#2196F3" />
      </TouchableOpacity>

      {/* Like Button */}
      <TouchableOpacity
        style={[styles.button, styles.largeButton, styles.likeButton]}
        onPress={onLike}
        activeOpacity={0.7}>
        <IconSymbol name="heart.fill" size={32} color="#4CAF50" />
      </TouchableOpacity>

      {/* Boost Button */}
      <TouchableOpacity
        style={[styles.button, styles.smallButton, styles.boostButton]}
        onPress={onBoost}
        activeOpacity={0.7}>
        <IconSymbol name="bolt.fill" size={24} color="#9C27B0" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
    gap: 16,
    zIndex: 1000, // Ensure buttons are clickable above cards
  },
  button: {
    backgroundColor: '#fff',
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  smallButton: {
    width: 56,
    height: 56,
  },
  largeButton: {
    width: 68,
    height: 68,
  },
  rewindButton: {
    backgroundColor: '#fff',
  },
  dislikeButton: {
    backgroundColor: '#fff',
  },
  starButton: {
    backgroundColor: '#fff',
  },
  likeButton: {
    backgroundColor: '#fff',
  },
  boostButton: {
    backgroundColor: '#fff',
  },
});
