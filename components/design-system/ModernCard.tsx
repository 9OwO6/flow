import React from 'react';
import { StyleSheet, Pressable, ViewStyle, StyleProp } from 'react-native';
import { Surface } from 'react-native-paper';
import theme from '@/constants/DesignTokens';

interface ModernCardProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  elevation?: 'none' | 'sm' | 'md' | 'lg';
  padding?: keyof typeof theme.spacing;
  backgroundColor?: string;
  borderColor?: string;
  onPress?: () => void;
  onLongPress?: () => void;
  disabled?: boolean;
  pressedOpacity?: number;
}

export default function ModernCard({
  children,
  style,
  elevation = 'sm',
  padding = 'md',
  backgroundColor,
  borderColor,
  onPress,
  onLongPress,
  disabled,
  pressedOpacity = 0.94,
}: ModernCardProps) {
  const elevationStyle = elevation !== 'none' ? theme.elevation[elevation] : theme.elevation.none;
  const interactive = !!(onPress || onLongPress);

  const innerSurfaceStyle: StyleProp<ViewStyle> = [
    styles.surface,
    {
      backgroundColor: backgroundColor ?? theme.colors.surface,
      borderColor: borderColor ?? theme.colors.border,
      padding: theme.spacing[padding],
    },
    elevationStyle,
  ];

  if (!interactive) {
    return (
      <Surface style={[innerSurfaceStyle, styles.staticMargin, style]} elevation={0}>
        {children}
      </Surface>
    );
  }

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: !!disabled }}
      disabled={disabled}
      onPress={onPress}
      onLongPress={onLongPress}
      style={({ pressed }) => [
        styles.pressableOuter,
        style,
        {
          opacity: disabled ? 0.55 : pressed ? pressedOpacity : 1,
        },
      ]}
    >
      <Surface style={innerSurfaceStyle} elevation={0}>
        {children}
      </Surface>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  surface: {
    borderRadius: theme.radius.lg,
    borderWidth: 1,
  },
  staticMargin: {
    marginBottom: theme.spacing.md,
  },
  pressableOuter: {
    marginBottom: theme.spacing.md,
  },
});
