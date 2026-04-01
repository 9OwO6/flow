import React, { useRef } from 'react';
import { StyleSheet, TouchableOpacity, Animated, View, Text, type StyleProp, type ViewStyle } from 'react-native';
import theme from '@/constants/DesignTokens';
import { useReduceMotion } from '@/hooks/useReduceMotion';
import { delight } from '@/utils/delight';
import { runPressScale } from '@/utils/delight/motionTemplates';

import FontAwesome from '@expo/vector-icons/FontAwesome';

interface PrimaryButtonProps {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  icon?: string;
  loading?: boolean;
  variant?: 'filled' | 'outlined';
  size?: 'large' | 'medium' | 'small';
  /** Delight Pack: light tap + press scale (respects prefs + Reduce Motion) */
  delightPress?: boolean;
  style?: StyleProp<ViewStyle>;
}

export default function PrimaryButton({
  title,
  onPress,
  disabled = false,
  icon,
  loading = false,
  variant = 'filled',
  size = 'medium',
  delightPress = false,
  style,
}: PrimaryButtonProps) {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const reduceMotion = useReduceMotion();

  const handlePressIn = () => {
    if (disabled || loading) return;
    if (delightPress) {
      void delight.play('tap');
      runPressScale(scaleAnim, 'in', {
        allowEnhancedMotion: delight.shouldPlayEnhancedMotion(),
        reduceMotion,
      });
    } else {
      Animated.spring(scaleAnim, {
        toValue: 0.98,
        useNativeDriver: true,
      }).start();
    }
  };

  const handlePressOut = () => {
    if (delightPress) {
      runPressScale(scaleAnim, 'out', {
        allowEnhancedMotion: delight.shouldPlayEnhancedMotion(),
        reduceMotion,
      });
    } else {
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
      }).start();
    }
  };

  const handlePress = () => {
    if (!disabled && !loading) {
      onPress();
    }
  };

  const sizeStyle = size === 'large' 
    ? styles.large 
    : size === 'small' 
    ? styles.small 
    : styles.medium;

  const buttonStyle = variant === 'filled' 
    ? [styles.button, styles.filled, sizeStyle, { backgroundColor: theme.colors.primary }]
    : [styles.button, styles.outlined, sizeStyle, { borderColor: theme.colors.primary }];

  const textStyle = variant === 'filled'
    ? styles.filledText
    : styles.outlinedText;

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled || loading}
        style={[
          buttonStyle,
          (disabled || loading) && styles.disabled,
          style,
        ]}
      >
        <View style={styles.content}>
          {icon && (
            <FontAwesome 
              name={icon as any} 
              size={theme.iconSize.md} 
              color={variant === 'filled' ? 'white' : theme.colors.primary} 
              style={styles.icon} 
            />
          )}
          <Text style={[styles.text, textStyle]}>
            {loading ? '...' : title}
          </Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: theme.radius.md,
    justifyContent: 'center',
    alignItems: 'center',
    ...theme.elevation.sm,
  },
  large: {
    paddingVertical: theme.spacing.lg,
    paddingHorizontal: theme.spacing.xl,
    minHeight: 56,
  },
  medium: {
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    minHeight: theme.touchTarget.min,
  },
  small: {
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    minHeight: 36,
  },
  filled: {
    borderWidth: 0,
  },
  outlined: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
  },
  disabled: {
    opacity: 0.5,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: theme.iconSize.md,
    marginRight: theme.spacing.sm,
  },
  text: {
    ...theme.typography.button,
  },
  filledText: {
    color: theme.colors.textOnPrimary,
  },
  outlinedText: {
    color: theme.colors.primary,
  },
});
