import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from '@/components/Themed';
import theme from '@/constants/DesignTokens';

export const SHARE_CARD_WIDTH = 360;
export const SHARE_CARD_HEIGHT = 450;

export type SevenDayShareCardStrings = {
  brand: string;
  headline: string;
  range: string;
  totalLabel: string;
  avgLabel: string;
  trendLabel: string;
  tagsTitle: string;
  noTags: string;
  disclaimer: string;
  tagLine: string; // "{{label}}: {{count}}"
};

type TagLine = { label: string; count: number };

type Props = {
  totalRecords: number;
  avgComfortLine: string;
  trendLine: string;
  tagLines: TagLine[];
  strings: SevenDayShareCardStrings;
};

/**
 * Fixed-size layout for PNG capture (logical 360×450, device pixel ratio scales output).
 */
export default function SevenDayShareCard({
  totalRecords,
  avgComfortLine,
  trendLine,
  tagLines,
  strings,
}: Props) {
  const formatTag = (l: TagLine) =>
    strings.tagLine.replace('{{label}}', l.label).replace('{{count}}', String(l.count));

  return (
    <View style={styles.root} collapsable={false}>
      <View style={styles.header}>
        <Text style={styles.brand}>{strings.brand}</Text>
        <Text style={styles.headline}>{strings.headline}</Text>
        <Text style={styles.range}>{strings.range}</Text>
      </View>
      <View style={styles.stats}>
        <Text style={styles.statLine}>
          <Text style={styles.statEm}>{strings.totalLabel}</Text> {totalRecords}
        </Text>
        <Text style={styles.statLine}>{avgComfortLine}</Text>
        <Text style={styles.statLine}>{trendLine}</Text>
      </View>
      <View style={styles.tags}>
        <Text style={styles.tagsTitle}>{strings.tagsTitle}</Text>
        {tagLines.length === 0 ? (
          <Text style={styles.tagMuted}>{strings.noTags}</Text>
        ) : (
          tagLines.slice(0, 4).map((t, i) => (
            <Text key={i} style={styles.tagLine}>
              {formatTag(t)}
            </Text>
          ))
        )}
      </View>
      <Text style={styles.disclaimer}>{strings.disclaimer}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    width: SHARE_CARD_WIDTH,
    height: SHARE_CARD_HEIGHT,
    backgroundColor: theme.colors.background,
    padding: theme.spacing.lg,
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  header: {
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    paddingBottom: theme.spacing.sm,
  },
  brand: {
    ...theme.typography.caption,
    color: theme.colors.primaryDark,
    letterSpacing: 1.2,
    marginBottom: theme.spacing.xs,
  },
  headline: {
    ...theme.typography.h2,
    color: theme.colors.textPrimary,
    fontSize: 22,
  },
  range: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
  },
  stats: {
    paddingVertical: theme.spacing.sm,
    gap: theme.spacing.xs,
  },
  statLine: {
    ...theme.typography.body2,
    color: theme.colors.textSecondary,
  },
  statEm: {
    fontWeight: '600',
    color: theme.colors.textPrimary,
  },
  tags: {
    flex: 1,
    paddingTop: theme.spacing.sm,
  },
  tagsTitle: {
    ...theme.typography.caption,
    color: theme.colors.textTertiary,
    marginBottom: theme.spacing.xs,
  },
  tagLine: {
    ...theme.typography.body2,
    color: theme.colors.textPrimary,
  },
  tagMuted: {
    ...theme.typography.body2,
    color: theme.colors.textTertiary,
    fontStyle: 'italic',
  },
  disclaimer: {
    ...theme.typography.caption,
    fontSize: 10,
    lineHeight: 14,
    color: theme.colors.textTertiary,
    marginTop: theme.spacing.sm,
  },
});
