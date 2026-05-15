import React from 'react';
import { StyleSheet, View } from 'react-native';
import theme from '@/constants/DesignTokens';
import ModernCard from '@/components/design-system/ModernCard';
import AppText from '@/components/design-system/AppText';
import { PoopRecord, SmoothLevel } from '@/types';

interface HistoryListItemProps {
  record: PoopRecord;
  onPress: () => void;
  onLongPress?: () => void;
  smoothLevelConfig: Record<SmoothLevel, { label: string; color: string }>;
}

export default function HistoryListItem({
  record,
  onPress,
  onLongPress,
  smoothLevelConfig,
}: HistoryListItemProps) {
  const config = smoothLevelConfig[record.smoothLevel];

  return (
    <ModernCard
      elevation="sm"
      padding="md"
      onPress={onPress}
      onLongPress={onLongPress}
      style={styles.item}
    >
      <View style={styles.content}>
        <View style={styles.leftSection}>
          <View style={[styles.indicator, { backgroundColor: config.color }]} />
          <View style={styles.info}>
            <AppText variant="h3" color="primary" style={styles.date}>
              {record.date}
            </AppText>
            <AppText variant="caption" color="secondary">
              {record.time}
            </AppText>
          </View>
        </View>

        <View style={styles.rightSection}>
          <View style={[styles.levelBadge, { backgroundColor: `${config.color}33` }]}>
            <AppText variant="caption" color="primary" style={[styles.levelText, { color: config.color }]}>
              {config.label}
            </AppText>
          </View>
          {record.notes ? (
            <AppText variant="body2" color="tertiary" style={styles.notes} numberOfLines={2} ellipsizeMode="tail">
              {record.notes}
            </AppText>
          ) : null}
        </View>
      </View>
    </ModernCard>
  );
}

const styles = StyleSheet.create({
  item: {
    marginBottom: theme.spacing.sm,
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  indicator: {
    width: 4,
    height: 40,
    borderRadius: 2,
    marginRight: theme.spacing.md,
  },
  info: {
    flex: 1,
  },
  date: {
    marginBottom: theme.spacing.xs,
  },
  rightSection: {
    alignItems: 'flex-end',
    maxWidth: '50%',
  },
  levelBadge: {
    paddingVertical: theme.spacing.xs,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.radius.full,
    marginBottom: theme.spacing.xs,
  },
  levelText: {
    fontWeight: '600',
  },
  notes: {
    textAlign: 'right',
  },
});
