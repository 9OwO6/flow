import React from 'react';
import { View, StyleSheet } from 'react-native';
import theme from '@/constants/DesignTokens';
import AppText from '@/components/design-system/AppText';

type Props = {
  title?: string;
  footer?: string;
  children: React.ReactNode;
};

export default function SettingsGroup({ title, footer, children }: Props) {
  return (
    <View style={styles.wrap}>
      {title ? (
        <AppText variant="caption" color="secondary" style={styles.sectionTitle}>
          {title}
        </AppText>
      ) : null}
      <View style={styles.card}>{children}</View>
      {footer ? (
        <AppText variant="caption" color="tertiary" style={styles.footer}>
          {footer}
        </AppText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginBottom: theme.spacing.lg,
  },
  sectionTitle: {
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
    marginLeft: theme.spacing.md,
    marginTop: theme.spacing.sm,
    lineHeight: 18,
  },
});
