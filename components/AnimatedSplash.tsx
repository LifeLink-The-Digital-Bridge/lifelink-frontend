import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import * as SplashScreen from 'expo-splash-screen';

SplashScreen.preventAutoHideAsync();

interface AnimatedSplashProps {
  onFinish: () => void;
}

export default function AnimatedSplash({ onFinish }: AnimatedSplashProps) {
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (videoLoaded) {
      SplashScreen.hideAsync();
    }
  }, [videoLoaded]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!videoLoaded) {
        console.log('Video timeout, showing app');
        SplashScreen.hideAsync();
        onFinish();
      }
    }, 5000);

    return () => clearTimeout(timer);
  }, [videoLoaded]);

  if (error) {
    SplashScreen.hideAsync();
    onFinish();
    return null;
  }

  return (
    <View style={styles.container}>
      <Video
        source={require('../assets/images/lifelink_loading_video.mp4')}
        rate={1.0}
        volume={0.5}
        isMuted={false}
        shouldPlay
        isLooping={false}
        resizeMode={ResizeMode.CONTAIN}
        style={styles.video}
        onLoad={() => {
          console.log('Video loaded successfully');
          setVideoLoaded(true);
        }}
        onError={(err) => {
          console.error('Video error:', err);
          setError(true);
        }}
        onPlaybackStatusUpdate={(status) => {
          if (status.isLoaded && status.didJustFinish) {
            console.log('Video finished, showing app');
            onFinish();
          }
        }}
      />
      
      {!videoLoaded && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4f8df5" />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  video: {
    width: '100%',
    height: '100%',
  },
  loadingContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
