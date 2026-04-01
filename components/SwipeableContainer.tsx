import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useSwipeGesture } from '@/hooks/useSwipeGesture';
import { Animated } from 'react-native';

interface SwipeableContainerProps {
  children: React.ReactNode;
  style?: any;
}

export default function SwipeableContainer({ children, style }: SwipeableContainerProps) {
  const { panResponder, translateX, isTransitioning } = useSwipeGesture();

  return (
    <Animated.View
      style={[
        styles.container,
        style,
        {
          transform: [{ translateX }],
          // 在切换过程中禁用指针事件，防止点击干扰
          // 但不隐藏内容，避免白屏
          pointerEvents: isTransitioning ? 'none' : 'auto',
          opacity: 1, // 确保内容始终可见
        },
      ]}
      {...panResponder.panHandlers}
    >
      {children}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

