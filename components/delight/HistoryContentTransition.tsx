import React, { useEffect, useRef } from 'react';
import { Animated, StyleProp, ViewStyle } from 'react-native';
import { runTabContentFadeIn } from '@/utils/delight/motionTemplates';

type Props = {
  activeKey: string;
  /** User preference: enhanced motion on */
  enhancedMotionPref: boolean;
  /** System Reduce Motion */
  reduceMotion: boolean;
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
};

/**
 * Tab content-only cross-fade when switching week/month/year (not the whole screen).
 */
export default function HistoryContentTransition({
  activeKey,
  enhancedMotionPref,
  reduceMotion,
  children,
  style,
}: Props) {
  const opacity = useRef(new Animated.Value(1)).current;
  const didMountKey = useRef<string | null>(null);

  useEffect(() => {
    if (didMountKey.current === null) {
      didMountKey.current = activeKey;
      opacity.setValue(1);
      return;
    }
    runTabContentFadeIn(opacity, {
      allowEnhancedMotion: enhancedMotionPref,
      reduceMotion,
    });
  }, [activeKey, enhancedMotionPref, reduceMotion, opacity]);

  return (
    <Animated.View style={[{ flexGrow: 1 }, style, { opacity }]}>
      {children}
    </Animated.View>
  );
}
