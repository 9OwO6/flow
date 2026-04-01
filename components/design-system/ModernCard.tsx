import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { Surface } from 'react-native-paper';
import theme from '@/constants/DesignTokens';

interface ModernCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  elevation?: 'none' | 'sm' | 'md' | 'lg';
  padding?: keyof typeof theme.spacing;
}

export default function ModernCard({
  children,
  style,
  elevation = 'sm',
  padding = 'md',
}: ModernCardProps) {
  const elevationStyle = elevation !== 'none' ? theme.elevation[elevation] : theme.elevation.none;

  return (
    <Surface
      style={[
        styles.card,
        {
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.border,
          padding: theme.spacing[padding],
        },
        elevationStyle,
        style,
      ]}
      elevation={0}
    >
      {children}
    </Surface>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    marginBottom: theme.spacing.md,
  },
});
