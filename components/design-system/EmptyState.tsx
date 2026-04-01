import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from '@/components/Themed';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import theme from '@/constants/DesignTokens';

interface EmptyStateProps {
  icon?: string;
  title: string;
  subtitle?: string;
}

export default function EmptyState({ icon = 'leaf', title, subtitle }: EmptyStateProps) {
  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <FontAwesome name={icon as any} size={48} color={theme.colors.textTertiary} />
      </View>
      <Text style={styles.title}>{title}</Text>
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: theme.spacing.xl * 2,
    paddingHorizontal: theme.spacing.xl,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: theme.colors.surfaceVariant,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  title: {
    ...theme.typography.h3,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.sm,
    textAlign: 'center',
  },
  subtitle: {
    ...theme.typography.body2,
    color: theme.colors.textTertiary,
    textAlign: 'center',
  },
});

