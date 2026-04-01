import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Surface } from 'react-native-paper';
import theme from '@/constants/DesignTokens';

import FontAwesome from '@expo/vector-icons/FontAwesome';

interface StatCardProps {
  icon: string;
  value: string | number;
  label: string;
  color?: string;
}

export default function StatCard({
  icon,
  value,
  label,
  color,
}: StatCardProps) {
  const cardColor = color || theme.colors.primary;

  return (
    <Surface 
      style={[
        styles.card,
        { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }
      ]} 
      elevation={0}
    >
      <View style={styles.content}>
        <FontAwesome name={icon as any} size={28} color={cardColor} style={styles.icon} />
        <Text style={[styles.value, { color: cardColor }]}>{value}</Text>
        <Text style={styles.label}>{label}</Text>
      </View>
    </Surface>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    flex: 1,
    marginHorizontal: theme.spacing.xs,
    minHeight: 100,
    ...theme.elevation.sm,
  },
  content: {
    padding: theme.spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  icon: {
    fontSize: theme.iconSize.lg,
    marginBottom: theme.spacing.sm,
  },
  value: {
    ...theme.typography.h2,
    marginBottom: theme.spacing.xs,
  },
  label: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
});
