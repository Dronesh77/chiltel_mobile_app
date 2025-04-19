import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';

const Loading = () => {
  // Create an animated value for the spinner rotation
  const spinValue = new Animated.Value(0);

  // Set up the animation for the spinner
  useEffect(() => {
    startSpinAnimation();
    return () => {
      // Clean up animation if component unmounts
      spinValue.stopAnimation();
    };
  }, []);

  // Function to start the continuous rotation animation
  const startSpinAnimation = () => {
    Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 1000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  };

  // Create the animated rotation style
  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  // Set up the pulse animation for the text
  const pulseAnim = new Animated.Value(1);
  
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 0.6,
          duration: 800,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 800,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.loadingContainer}>
        {/* Spinner */}
        <View style={styles.spinnerOuterRing}>
          <Animated.View 
            style={[
              styles.spinner, 
              { transform: [{ rotate: spin }] }
            ]} 
          />
        </View>
        
        {/* Loading Text */}
        <Animated.Text 
          style={[
            styles.loadingText,
            { opacity: pulseAnim }
          ]}
        >
          Loading, please wait...
        </Animated.Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F3F4F6',
  },
  loadingContainer: {
    alignItems: 'center',
  },
  spinnerOuterRing: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 4,
    borderColor: '#3B82F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  spinner: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderLeftColor: 'transparent',
    borderRightColor: '#3B82F6',
    borderTopColor: 'transparent',
    borderBottomColor: '#3B82F6',
    borderWidth: 4,
    position: 'absolute',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 18,
    fontWeight: '500',
    color: '#4B5563',
  },
});

export default Loading;