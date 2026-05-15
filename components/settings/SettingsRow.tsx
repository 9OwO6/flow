import React from 'react';
import { View, TouchableOpacity, StyleSheet, Switch, type SwitchProps } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import theme from '@/constants/DesignTokens';
import AppText from '@/components/design-system/AppText';

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
        <AppText variant="body" style={styles.label}>
          {label}
        </AppText>
        {subtitle ? (
          <AppText variant="caption" color="tertiary" style={styles.subtitle}>
            {subtitle}
          </AppText>
        ) : null}
      </View>
      <View style={styles.right}>
        {children}
        {showChevron ? (
          <FontAwesome name="chevron-right" size={14} color={theme.colors.textTertiary} />
        ) : null}
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
        <AppText variant="body" style={styles.label}>
          {label}
        </AppText>
        {subtitle ? (
          <AppText variant="caption" color="tertiary" style={styles.subtitle}>
            {subtitle}
          </AppText>
        ) : null}
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
    color: theme.colors.textPrimary,
  },
  subtitle: {
    marginTop: 2,
  },
});
