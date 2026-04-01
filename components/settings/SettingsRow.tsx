import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Switch, type SwitchProps } from 'react-native';
import theme from '@/constants/DesignTokens';

type Props = {
  label: string;
  subtitle?: string;
  onPress?: () => void;
  showChevron?: boolean;
  isFirst?: boolean;
  children?: React.ReactNode;
};

export function SettingsRowPressable({
  label,
  subtitle,
  onPress,
  showChevron,
  isFirst,
  children,
}: Props) {
  return (
    <TouchableOpacity
      style={[styles.row, !isFirst && styles.rowBorder]}
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
      disabled={!onPress}
    >
      <View style={styles.left}>
        <Text style={styles.label}>{label}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>
      <View style={styles.right}>
        {children}
        {showChevron ? <Text style={styles.chevron}>›</Text> : null}
      </View>
    </TouchableOpacity>
  );
}

export function SettingsRowToggle({
  label,
  subtitle,
  value,
  onValueChange,
  trackColor,
  thumbColor,
  isFirst,
}: Pick<Props, 'label' | 'subtitle' | 'isFirst'> & {
  value: boolean;
  onValueChange: SwitchProps['onValueChange'];
  trackColor?: { false: string; true: string };
  thumbColor?: string;
}) {
  return (
    <View style={[styles.row, styles.rowStatic, !isFirst && styles.rowBorder]}>
      <View style={styles.left}>
        <Text style={styles.label}>{label}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={trackColor}
        thumbColor={thumbColor}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.md,
    minHeight: theme.touchTarget.min,
  },
  rowStatic: {
    paddingVertical: theme.spacing.sm,
  },
  rowBorder: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: theme.colors.border,
  },
  left: {
    flex: 1,
    marginRight: theme.spacing.md,
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    ...theme.typography.body,
    color: theme.colors.textPrimary,
  },
  subtitle: {
    ...theme.typography.caption,
    color: theme.colors.textTertiary,
    marginTop: 2,
  },
  chevron: {
    fontSize: 22,
    color: theme.colors.textTertiary,
    fontWeight: '300',
  },
});
