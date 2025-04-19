import React, { useState, useEffect } from 'react';
import { Text, StyleSheet } from 'react-native';

type AnimatedCounterProps = {
  end: number;
  duration?: number;
};

const AnimatedCounter: React.FC<AnimatedCounterProps> = ({ end, duration = 2000 }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number | null = null;
    let animationFrame: number | null = null;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      const percentage = Math.min(progress / duration, 1);

      setCount(Math.floor(end * percentage));

      if (percentage < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [end, duration]);

  return <Text style={styles.counter}>{count}</Text>;
};

const styles = StyleSheet.create({
  counter: {
    fontWeight: 'bold',
    fontSize: 20,
  },
});

export default AnimatedCounter;
