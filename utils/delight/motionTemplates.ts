import { Animated, Easing } from 'react-native';
import { DelightTokens } from '@/constants/DelightTokens';

type MotionOpts = {
  allowEnhancedMotion: boolean;
  reduceMotion: boolean;
};

export function runPressScale(
  value: Animated.Value,
  phase: 'in' | 'out',
  opts: MotionOpts
): void {
  value.stopAnimation();
  const { allowEnhancedMotion, reduceMotion } = opts;
  if (!allowEnhancedMotion || reduceMotion) {
    value.setValue(1);
    return;
  }
  if (phase === 'out') {
    Animated.spring(value, {
      toValue: 1,
      friction: DelightTokens.motion.pressReleaseFriction,
      tension: DelightTokens.motion.pressReleaseTension,
      useNativeDriver: true,
    }).start();
    return;
  }
  Animated.timing(value, {
    toValue: DelightTokens.motion.pressScaleDown,
    duration: DelightTokens.motion.pressInMs,
    easing: Easing.out(Easing.quad),
    useNativeDriver: true,
  }).start();
}

/**
 * Success feedback: full motion uses scale; Reduce Motion uses a brief opacity dip only (no bounce).
 */
export function runSuccessPulse(
  scale: Animated.Value,
  opacity: Animated.Value,
  opts: MotionOpts,
  onEnd?: () => void
): void {
  scale.stopAnimation();
  opacity.stopAnimation();
  const { allowEnhancedMotion, reduceMotion } = opts;

  if (reduceMotion) {
    scale.setValue(1);
    opacity.setValue(1);
    const dip = DelightTokens.motion.reduceMotionOpacityDip;
    const ms = DelightTokens.motion.reduceMotionOpacityMs;
    Animated.sequence([
      Animated.timing(opacity, {
        toValue: dip,
        duration: ms,
        useNativeDriver: true,
        easing: Easing.linear,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: ms,
        useNativeDriver: true,
        easing: Easing.linear,
      }),
    ]).start(() => onEnd?.());
    return;
  }

  if (!allowEnhancedMotion) {
    scale.setValue(1);
    opacity.setValue(1);
    onEnd?.();
    return;
  }

  opacity.setValue(1);
  scale.setValue(1);
  Animated.sequence([
    Animated.timing(scale, {
      toValue: DelightTokens.motion.successScalePeak,
      duration: DelightTokens.motion.successScaleUpMs,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }),
    Animated.spring(scale, {
      toValue: 1,
      friction: DelightTokens.motion.successSettleFriction,
      tension: DelightTokens.motion.successSettleTension,
      useNativeDriver: true,
    }),
  ]).start(() => onEnd?.());
}

/** Soft ring expanding behind the quick-record button (success only). */
export function runSuccessRipple(
  ringScale: Animated.Value,
  ringOpacity: Animated.Value,
  opts: MotionOpts
): void {
  ringScale.stopAnimation();
  ringOpacity.stopAnimation();
  if (!opts.allowEnhancedMotion || opts.reduceMotion) {
    ringScale.setValue(1);
    ringOpacity.setValue(0);
    return;
  }
  ringScale.setValue(0.88);
  ringOpacity.setValue(0.42);
  Animated.parallel([
    Animated.timing(ringScale, {
      toValue: 1.42,
      duration: 540,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }),
    Animated.timing(ringOpacity, {
      toValue: 0,
      duration: 540,
      easing: Easing.in(Easing.quad),
      useNativeDriver: true,
    }),
  ]).start();
}

/**
 * Optional micro-toast: full motion = short opacity ramp; Reduce Motion = single step.
 */
export function runSoftToast(opacity: Animated.Value, opts: MotionOpts, onEnd?: () => void): void {
  opacity.stopAnimation();
  const { allowEnhancedMotion, reduceMotion } = opts;
  if (!allowEnhancedMotion) {
    opacity.setValue(0);
    onEnd?.();
    return;
  }
  if (reduceMotion) {
    opacity.setValue(1);
    onEnd?.();
    return;
  }
  opacity.setValue(0);
  Animated.sequence([
    Animated.timing(opacity, {
      toValue: 1,
      duration: 220,
      useNativeDriver: true,
      easing: Easing.out(Easing.quad),
    }),
    Animated.timing(opacity, {
      toValue: 0,
      duration: 380,
      delay: 400,
      useNativeDriver: true,
      easing: Easing.in(Easing.quad),
    }),
  ]).start(() => onEnd?.());
}

export function runTabContentFadeIn(
  opacity: Animated.Value,
  opts: MotionOpts
): void {
  opacity.stopAnimation();
  const { allowEnhancedMotion, reduceMotion } = opts;
  if (!allowEnhancedMotion || reduceMotion) {
    opacity.setValue(1);
    return;
  }
  opacity.setValue(DelightTokens.motion.tabContentOpacityFrom);
  Animated.timing(opacity, {
    toValue: 1,
    duration: DelightTokens.motion.tabContentFadeMs,
    easing: Easing.out(Easing.quad),
    useNativeDriver: true,
  }).start();
}
