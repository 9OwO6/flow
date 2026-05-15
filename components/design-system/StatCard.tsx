import React from 'react';
import { StyleSheet, View } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import theme from '@/constants/DesignTokens';
import ModernCard from '@/components/design-system/ModernCard';
import AppText from '@/components/design-system/AppText';

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
    <ModernCard
      elevation="sm"
      padding="md"
      style={[styles.card, { flex: 1, marginHorizontal: theme.spacing.xs, marginBottom: 0 }]}
    >
      <View style={styles.content}>
        <FontAwesome name={icon as any} size={theme.iconSize.lg} color={cardColor} style={styles.icon} />
        <AppText variant="h2" color="primary" style={[styles.value, { color: cardColor }]}>
          {value}
        </AppText>
        <AppText variant="caption" color="secondary" style={styles.label}>
          {label}
        </AppText>
      </View>
    </ModernCard>
  );
}

const styles = StyleSheet.create({
  card: {
    minHeight: 100,
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  icon: {
    marginBottom: theme.spacing.sm,
  },
  value: {
    marginBottom: theme.spacing.xs,
  },
  label: {
    textAlign: 'center',
  },
});
