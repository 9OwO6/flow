import React from 'react';
import { StyleSheet, View } from 'react-native';
import theme from '@/constants/DesignTokens';
import AppText from '@/components/design-system/AppText';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export default function SectionHeader({ title, subtitle, action }: SectionHeaderProps) {
  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <AppText variant="h3" style={styles.title}>
          {title}
        </AppText>
        {subtitle ? (
          <AppText variant="body2" color="secondary" style={styles.subtitle}>
            {subtitle}
          </AppText>
        ) : null}
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
    marginBottom: theme.spacing.xs,
  },
  subtitle: {},
  action: {
    marginLeft: theme.spacing.md,
  },
});

