import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from '@/components/Themed';
import ModernCard from '@/components/design-system/ModernCard';
import theme from '@/constants/DesignTokens';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useTranslation } from 'react-i18next';

export default function HomeEmptyGuide() {
  const { t } = useTranslation();
  const bullets = t('home.emptyGuideBullets', { returnObjects: true }) as
    | string[]
    | string;
  const items = Array.isArray(bullets) ? bullets : [];

  return (
    <ModernCard elevation="md" padding="lg" style={styles.card}>
      <View style={styles.row}>
        <FontAwesome
          name="leaf"
          size={theme.iconSize.lg}
          color={theme.colors.primary}
        />
        <View style={styles.textCol}>
          <Text style={styles.title}>{t('home.emptyGuideTitle')}</Text>
          <Text style={styles.subtitle}>{t('home.emptyGuideSubtitle')}</Text>
        </View>
      </View>
      {items.map((line, i) => (
        <Text key={i} style={styles.bullet}>
          · {line}
        </Text>
      ))}
      <Text style={styles.hint}>{t('home.emptyGuideCta')}</Text>
    </ModernCard>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.primaryLight,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  textCol: { flex: 1 },
  title: {
    ...theme.typography.h3,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.xs,
  },
  subtitle: {
    ...theme.typography.body2,
    color: theme.colors.textSecondary,
  },
  bullet: {
    ...theme.typography.body2,
    color: theme.colors.textSecondary,
    marginLeft: theme.spacing.sm,
    marginBottom: theme.spacing.xs,
  },
  hint: {
    ...theme.typography.caption,
    color: theme.colors.textTertiary,
    marginTop: theme.spacing.md,
  },
});
