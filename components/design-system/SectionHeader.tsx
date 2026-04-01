import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import theme from '@/constants/DesignTokens';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export default function SectionHeader({ title, subtitle, action }: SectionHeaderProps) {
  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <Text style={styles.title}>{title}</Text>
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      </View>
      {action && <View style={styles.action}>{action}</View>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.md,
    paddingHorizontal: theme.spacing.md,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    ...theme.typography.h3,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.xs,
  },
  subtitle: {
    ...theme.typography.body2,
    color: theme.colors.textSecondary,
  },
  action: {
    marginLeft: theme.spacing.md,
  },
});

