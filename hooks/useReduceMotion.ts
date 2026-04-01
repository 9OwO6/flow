import { useEffect, useState } from 'react';
import { AccessibilityInfo, Platform } from 'react-native';

/**
 * Subscribes to system Reduce Motion (iOS / Android).
 * Web: treated as off.
 */
export function useReduceMotion(): boolean {
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    if (Platform.OS === 'web') {
      setReduceMotion(false);
      return;
    }
    let alive = true;
    AccessibilityInfo.isReduceMotionEnabled()
      .then((v) => {
        if (alive) setReduceMotion(!!v);
      })
      .catch(() => {});

    const sub = AccessibilityInfo.addEventListener(
      'reduceMotionChanged',
      (v: boolean) => setReduceMotion(!!v)
    );

    return () => {
      alive = false;
      sub.remove();
    };
  }, []);

  return reduceMotion;
}
