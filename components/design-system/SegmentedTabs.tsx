import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import theme from '@/constants/DesignTokens';
import AppText from '@/components/design-system/AppText';

interface Tab {
  key: string;
  label: string;
}

interface SegmentedTabsProps {
  tabs: Tab[];
  selectedKey: string;
  onSelect: (key: string) => void;
}

export default function SegmentedTabs({ tabs, selectedKey, onSelect }: SegmentedTabsProps) {
  return (
    <View style={styles.container}>
      {tabs.map((tab) => {
        const isSelected = tab.key === selectedKey;
        return (
          <TouchableOpacity
            key={tab.key}
            style={[
              styles.tab,
              isSelected && styles.tabSelected,
            ]}
            onPress={() => onSelect(tab.key)}
            activeOpacity={0.7}
          >
            <AppText
              variant={isSelected ? 'button' : 'body2'}
              style={isSelected ? styles.tabTextSelected : styles.tabTextIdle}
            >
              {tab.label}
            </AppText>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: theme.colors.surfaceVariant,
    borderRadius: theme.radius.md,
    padding: theme.spacing.xs,
    marginHorizontal: theme.spacing.md,
    marginVertical: theme.spacing.md,
  },
  tab: {
    flex: 1,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabSelected: {
    backgroundColor: theme.colors.surface,
    ...theme.elevation.sm,
  },
  tabTextIdle: {
    color: theme.colors.textSecondary,
    fontWeight: '500',
  },
  tabTextSelected: {
    color: theme.colors.primary,
  },
});

