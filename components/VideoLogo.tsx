import React, { useRef, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Video, AVPlaybackStatus, ResizeMode } from 'expo-av';
import { useTheme } from '../utils/theme-context';

interface VideoLogoProps {
  style?: any;
  autoPlay?: boolean;
  loop?: boolean;
}

export function VideoLogo({ style, autoPlay = true, loop = true }: VideoLogoProps) {
  const { colorScheme } = useTheme();
  const video = useRef<Video>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const onPlaybackStatusUpdate = (status: AVPlaybackStatus) => {
    if (status.isLoaded && !isLoaded) {
      setIsLoaded(true);
    }
  };

  return (
    <View style={[styles.container, style]}>
      <Video
        ref={video}
        source={require('../assets/images/lifelink_loading_video.mp4')}
        style={styles.video}
        resizeMode={ResizeMode.CONTAIN}
        shouldPlay={autoPlay}
        isLooping={loop}
        isMuted={true}
        useNativeControls={false}
        onPlaybackStatusUpdate={onPlaybackStatusUpdate}
        videoStyle={{ backgroundColor: 'transparent' }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  video: {
    width: 120,
    height: 120,
  },
});
