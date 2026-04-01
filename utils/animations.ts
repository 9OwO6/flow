import { Animated, Easing } from 'react-native';

// 按钮缩放动画
export const createButtonScaleAnimation = (scaleValue: Animated.Value) => {
  const scaleDown = Animated.timing(scaleValue, {
    toValue: 0.95,
    duration: 100,
    easing: Easing.out(Easing.quad),
    useNativeDriver: true,
  });

  const scaleUp = Animated.timing(scaleValue, {
    toValue: 1,
    duration: 100,
    easing: Easing.out(Easing.quad),
    useNativeDriver: true,
  });

  return { scaleDown, scaleUp };
};

// 淡入动画
export const createFadeInAnimation = (opacity: Animated.Value, duration: number = 500) => {
  return Animated.timing(opacity, {
    toValue: 1,
    duration,
    easing: Easing.out(Easing.quad),
    useNativeDriver: true,
  });
};

// 滑入动画
export const createSlideInAnimation = (
  translateY: Animated.Value, 
  fromValue: number = 50, 
  duration: number = 500
) => {
  translateY.setValue(fromValue);
  return Animated.timing(translateY, {
    toValue: 0,
    duration,
    easing: Easing.out(Easing.quad),
    useNativeDriver: true,
  });
};

// 弹跳动画
export const createBounceAnimation = (scaleValue: Animated.Value) => {
  const bounce = Animated.sequence([
    Animated.timing(scaleValue, {
      toValue: 1.1,
      duration: 150,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }),
    Animated.timing(scaleValue, {
      toValue: 1,
      duration: 150,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }),
  ]);

  return bounce;
};

// 脉冲动画
export const createPulseAnimation = (scaleValue: Animated.Value) => {
  const pulse = Animated.loop(
    Animated.sequence([
      Animated.timing(scaleValue, {
        toValue: 1.05,
        duration: 1000,
        easing: Easing.inOut(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.timing(scaleValue, {
        toValue: 1,
        duration: 1000,
        easing: Easing.inOut(Easing.quad),
        useNativeDriver: true,
      }),
    ])
  );

  return pulse;
};

// 页面切换动画
export const createPageTransitionAnimation = (
  translateX: Animated.Value,
  direction: 'left' | 'right' = 'right'
) => {
  const fromValue = direction === 'right' ? 300 : -300;
  translateX.setValue(fromValue);
  
  return Animated.timing(translateX, {
    toValue: 0,
    duration: 300,
    easing: Easing.out(Easing.quad),
    useNativeDriver: true,
  });
};

// 卡片出现动画
export const createCardAppearAnimation = (
  opacity: Animated.Value,
  translateY: Animated.Value,
  delay: number = 0
) => {
  opacity.setValue(0);
  translateY.setValue(30);
  
  return Animated.parallel([
    Animated.timing(opacity, {
      toValue: 1,
      duration: 400,
      delay,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }),
    Animated.timing(translateY, {
      toValue: 0,
      duration: 400,
      delay,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }),
  ]);
}; 