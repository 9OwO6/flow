import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import theme from '@/constants/DesignTokens';

type Props = {
  title?: string;
  footer?: string;
  children: React.ReactNode;
};

export default function SettingsGroup({ title, footer, children }: Props) {
  return (
    <View style={styles.wrap}>
      {title ? <Text style={styles.sectionTitle}>{title}</Text> : null}
      <View style={styles.card}>{children}</View>
      {footer ? <Text style={styles.footer}>{footer}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginBottom: theme.spacing.lg,
  },
  sectionTitle: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    marginLeft: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    fontWeight: '600',
    letterSpacing: 0.4,
  },
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: theme.colors.border,
    overflow: 'hidden',
  },
  footer: {
    ...theme.typography.caption,
    color: theme.colors.textTertiary,
    marginLeft: theme.spacing.md,
    marginTop: theme.spacing.sm,
    lineHeight: 18,
  },
});
