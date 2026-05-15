import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, ViewStyle, View, type DimensionValue } from 'react-native';
import theme from '@/constants/DesignTokens';
import { useReduceMotion } from '@/hooks/useReduceMotion';

interface SkeletonLoaderProps {
  width?: DimensionValue;
  height?: number;
  borderRadius?: number;
  style?: ViewStyle | ViewStyle[];
}

export default function SkeletonLoader({
  width = '100%',
  height = 20,
  borderRadius = theme.radius.sm,
  style,
}: SkeletonLoaderProps) {
  const reduceMotion = useReduceMotion();
  const shimmerAnim = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    if (reduceMotion) {
      shimmerAnim.setValue(0.45);
      return undefined;
    }

    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnim, {
          toValue: 0.75,
          duration: 900,
          useNativeDriver: true,
        }),
        Animated.timing(shimmerAnim, {
          toValue: 0.35,
          duration: 900,
          useNativeDriver: true,
        }),
      ])
    );
    loop.start();

    return () => {
      loop.stop();
    };
  }, [reduceMotion, shimmerAnim]);

  const bg = theme.colors.surfaceVariant;

  if (reduceMotion) {
    return (
      <View
        style={[
          styles.base,
          {
            width,
            height,
            borderRadius,
            backgroundColor: bg,
            opacity: 0.55,
          },
          style,
        ]}
      />
    );
  }

  return (
    <Animated.View
      style={[
        styles.base,
        {
          width,
          height,
          borderRadius,
          opacity: shimmerAnim,
          backgroundColor: bg,
        },
        style,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  base: {
    overflow: 'hidden',
  },
});
