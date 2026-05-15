import { useCallback, useRef, useMemo, useState, useEffect } from 'react';
import { useRouter, useSegments } from 'expo-router';
import { PanResponder, Animated, Dimensions } from 'react-native';

const TAB_ROUTES = ['index', 'two', 'settings'];
const SWIPE_THRESHOLD = 50; // 最小滑动距离（像素）
const SWIPE_VELOCITY_THRESHOLD = 0.3; // 最小滑动速度
const SWITCH_COOLDOWN = 400; // 切换冷却时间（毫秒），防止快速连续切换

export function useSwipeGesture() {
  const router = useRouter();
  const segments = useSegments();
  const translateX = useRef(new Animated.Value(0)).current;
  const isSwiping = useRef(false);
  const isSwitching = useRef(false); // 是否正在切换
  const lastSwitchTime = useRef(0); // 上次切换的时间
  const switchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const translateXValueRef = useRef(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // 清理函数：组件卸载时重置状态
  useEffect(() => {
    return () => {
      // 清理定时器
      if (switchTimeoutRef.current) {
        clearTimeout(switchTimeoutRef.current);
        switchTimeoutRef.current = null;
      }
      // 停止动画
      translateX.stopAnimation();
      // 重置状态
      isSwitching.current = false;
      isSwiping.current = false;
      translateX.setValue(0);
    };
  }, [translateX]);

  useEffect(() => {
    const id = translateX.addListener(({ value }) => {
      translateXValueRef.current = value;
    });
    return () => {
      translateX.removeListener(id);
    };
  }, [translateX]);

  const getCurrentTabIndex = useCallback(() => {
    // 从 segments 中提取当前标签
    const currentPath = segments[segments.length - 1] || 'index';
    let currentTab = 'index';
    if (currentPath === 'two') {
      currentTab = 'two';
    } else if (currentPath === 'settings') {
      currentTab = 'settings';
    }
    return TAB_ROUTES.indexOf(currentTab);
  }, [segments]);

  const switchTab = useCallback((direction: 'left' | 'right', animated = true) => {
    // 防止快速连续切换
    const now = Date.now();
    if (isSwitching.current || now - lastSwitchTime.current < SWITCH_COOLDOWN) {
      // 如果正在切换或冷却时间未到，回弹动画
      Animated.spring(translateX, {
        toValue: 0,
        useNativeDriver: true,
        tension: 50,
        friction: 7,
      }).start();
      return;
    }

    const currentIndex = getCurrentTabIndex();
    if (currentIndex === -1) return;

    let nextIndex: number;
    if (direction === 'right') {
      // 向右滑动 = 向左切换（显示左边的标签）
      nextIndex = currentIndex > 0 ? currentIndex - 1 : currentIndex;
    } else {
      // 向左滑动 = 向右切换（显示右边的标签）
      nextIndex = currentIndex < TAB_ROUTES.length - 1 ? currentIndex + 1 : currentIndex;
    }

    if (nextIndex !== currentIndex) {
      // 设置切换锁定状态
      isSwitching.current = true;
      setIsTransitioning(true);
      lastSwitchTime.current = now;

      // 取消之前的动画
      translateX.stopAnimation();
      
      // 先执行切换动画
      if (animated) {
        const screenWidth = Dimensions.get('window').width;
        Animated.timing(translateX, {
          toValue: direction === 'right' ? screenWidth : -screenWidth,
          duration: 300,
          useNativeDriver: true,
        }).start((finished) => {
          if (finished) {
            // 重置动画值
            translateX.setValue(0);
            
            // 切换路由
            const routeMap: Record<string, string> = {
              'index': '/(tabs)',
              'two': '/(tabs)/two',
              'settings': '/(tabs)/settings',
            };
            const nextRoute = routeMap[TAB_ROUTES[nextIndex]];
            if (nextRoute) {
              // 使用 replace 而不是 push，避免路由栈问题
              // 使用 requestAnimationFrame 确保在下一帧执行
              requestAnimationFrame(() => {
                try {
                  // 先重置动画值，避免白屏
                  translateX.setValue(0);
                  router.replace(nextRoute as any);
                  // 延迟解除锁定，确保路由切换完成
                  switchTimeoutRef.current = setTimeout(() => {
                    isSwitching.current = false;
                    setIsTransitioning(false);
                    switchTimeoutRef.current = null;
                  }, 200);
                } catch (error) {
                  console.error('Route switch error:', error);
                  // 出错时也要解除锁定
                  isSwitching.current = false;
                  setIsTransitioning(false);
                  // 重置动画值
                  translateX.setValue(0);
                }
              });
            } else {
              isSwitching.current = false;
              setIsTransitioning(false);
              translateX.setValue(0);
            }
          } else {
            // 动画被中断，解除锁定
            isSwitching.current = false;
            setIsTransitioning(false);
          }
        });
      } else {
        const routeMap: Record<string, string> = {
          'index': '/(tabs)',
          'two': '/(tabs)/two',
          'settings': '/(tabs)/settings',
        };
        const nextRoute = routeMap[TAB_ROUTES[nextIndex]];
        if (nextRoute) {
          try {
            translateX.setValue(0);
            router.replace(nextRoute as any);
          } catch (error) {
            console.error('Route switch error:', error);
            translateX.setValue(0);
          }
        }
        isSwitching.current = false;
        setIsTransitioning(false);
      }
    } else {
      // 如果无法切换，回弹动画
      Animated.spring(translateX, {
        toValue: 0,
        useNativeDriver: true,
        tension: 50,
        friction: 7,
      }).start();
    }
  }, [getCurrentTabIndex, router, translateX]);

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: (evt, gestureState) => {
          // 如果正在切换，不响应新的手势
          if (isSwitching.current || isTransitioning) {
            return false;
          }
          
          // 检查是否从屏幕边缘开始（左右各50px）
          const screenWidth = Dimensions.get('window').width;
          const startX = evt.nativeEvent.pageX || 0;
          const isEdge = startX < 50 || startX > screenWidth - 50;
          
          // 从边缘开始就激活手势
          return isEdge;
        },
        onMoveShouldSetPanResponder: (evt, gestureState) => {
          // 如果正在切换，不响应新的手势
          if (isSwitching.current || isTransitioning) {
            return false;
          }
          
          // 当水平滑动距离明显大于垂直滑动距离时激活
          const screenWidth = Dimensions.get('window').width;
          const startX = evt.nativeEvent.pageX || gestureState.moveX - gestureState.dx;
          const isEdge = startX < 50 || startX > screenWidth - 50;
          const isHorizontal = Math.abs(gestureState.dx) > Math.abs(gestureState.dy) * 1.5;
          const isSignificant = Math.abs(gestureState.dx) > 20;
          
          // 从边缘开始，或者水平滑动足够明显
          return isEdge || (isHorizontal && isSignificant);
        },
        onPanResponderTerminationRequest: () => {
          // 如果正在切换，允许终止
          if (isSwitching.current || isTransitioning) {
            return true;
          }
          // 不主动让出手势控制权，确保滑动流畅
          return false;
        },
        onPanResponderGrant: (evt, gestureState) => {
          // 如果正在切换，不处理
          if (isSwitching.current || isTransitioning) {
            return;
          }
          
          isSwiping.current = true;
          translateX.setOffset(translateXValueRef.current);
          translateXValueRef.current = 0;
          translateX.setValue(0);
        },
        onPanResponderMove: (evt, gestureState) => {
          // 如果正在切换，不处理
          if (isSwitching.current || isTransitioning) {
            return;
          }
          
          // 限制滑动距离，避免过度滑动
          const screenWidth = Dimensions.get('window').width;
          const maxTranslate = screenWidth * 0.8;
          const clampedDx = Math.max(-maxTranslate, Math.min(maxTranslate, gestureState.dx));
          translateXValueRef.current = clampedDx;
          translateX.setValue(clampedDx);
        },
        onPanResponderRelease: (evt, gestureState) => {
          // 如果正在切换，不处理
          if (isSwitching.current || isTransitioning) {
            isSwiping.current = false;
            translateX.flattenOffset();
            Animated.spring(translateX, {
              toValue: 0,
              useNativeDriver: true,
              tension: 50,
              friction: 7,
            }).start();
            return;
          }
          
          isSwiping.current = false;
          translateX.flattenOffset();

          const absDx = Math.abs(gestureState.dx);
          const absDy = Math.abs(gestureState.dy);
          const velocityX = gestureState.vx;
          const absVelocityX = Math.abs(velocityX);

          // 判断是否满足切换条件
          const shouldSwitch =
            (absDx > SWIPE_THRESHOLD && absDx > absDy) || // 滑动距离足够
            (absVelocityX > SWIPE_VELOCITY_THRESHOLD && absDx > absDy); // 或者速度足够

          if (shouldSwitch) {
            if (gestureState.dx > 0 || velocityX > 0) {
              // 向右滑动 - 切换到左边标签
              switchTab('right', true);
            } else {
              // 向左滑动 - 切换到右边标签
              switchTab('left', true);
            }
          } else {
            // 回弹到原位
            Animated.spring(translateX, {
              toValue: 0,
              useNativeDriver: true,
              tension: 50,
              friction: 7,
            }).start();
          }
        },
        onPanResponderTerminate: () => {
          isSwiping.current = false;
          translateX.flattenOffset();
          Animated.spring(translateX, {
            toValue: 0,
            useNativeDriver: true,
            tension: 50,
            friction: 7,
          }).start();
        },
      }),
    [switchTab, translateX, isTransitioning]
  );

  return {
    panResponder,
    translateX,
    isSwiping: isSwiping.current,
    isTransitioning,
  };
}
