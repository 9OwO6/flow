import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Button } from 'react-native-paper';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useTranslation } from 'react-i18next';
import type { HealthAlert as HealthAlertModel } from '@/utils/healthManager';
import theme from '@/constants/DesignTokens';
import AppText from '@/components/design-system/AppText';

export type AlertBannerProps = {
  alert: HealthAlertModel;
  onDismiss?: () => void;
};

type IconName = React.ComponentProps<typeof FontAwesome>['name'];

function tokensForType(type: HealthAlertModel['type']): {
  bg: string;
  border: string;
  iconColor: string;
  icon: IconName;
} {
  switch (type) {
    case 'warning':
      return {
        bg: `${theme.colors.error}14`,
        border: theme.colors.error,
        iconColor: theme.colors.error,
        icon: 'exclamation-circle',
      };
    case 'success':
      return {
        bg: `${theme.colors.success}18`,
        border: theme.colors.success,
        iconColor: theme.colors.primaryDark,
        icon: 'check-circle',
      };
    case 'reminder':
      return {
        bg: `${theme.colors.warning}22`,
        border: theme.colors.warning,
        iconColor: theme.colors.secondary,
        icon: 'clock-o',
      };
    case 'info':
    default:
      return {
        bg: theme.colors.primaryLight,
        border: theme.colors.primary,
        iconColor: theme.colors.primaryDark,
        icon: 'info-circle',
      };
  }
}

/**
 * Inline health / tip banner — tokens only, no emoji; icon from severity type.
 */
export default function AlertBanner({ alert, onDismiss }: AlertBannerProps) {
  const { t } = useTranslation();
  const tks = tokensForType(alert.type);

  return (
    <View
      style={[
        styles.wrap,
        {
          backgroundColor: tks.bg,
          borderLeftColor: tks.border,
        },
        theme.elevation.sm,
      ]}
    >
      <View style={styles.header}>
        <FontAwesome name={tks.icon} size={theme.iconSize.md} color={tks.iconColor} style={styles.leadIcon} />
        <AppText variant="h3" color="primary" style={styles.title}>
          {alert.title}
        </AppText>
      </View>
      <AppText variant="body2" color="secondary" style={styles.message}>
        {alert.message}
      </AppText>
      {(alert.actions?.length || onDismiss) ? (
        <View style={styles.actions}>
          {alert.actions?.map((action, index) => (
            <Button
              key={index}
              mode={index === 0 ? 'outlined' : 'contained'}
              onPress={() => {
                action.action();
                onDismiss?.();
              }}
              buttonColor={index === 0 ? undefined : tks.border}
              textColor={index === 0 ? tks.iconColor : theme.colors.textOnPrimary}
              style={styles.actionBtn}
              labelStyle={styles.actionLabel}
            >
              {action.text}
            </Button>
          ))}
          {onDismiss ? (
            <Button mode="text" onPress={onDismiss} textColor={theme.colors.textSecondary} labelStyle={styles.actionLabel}>
              {t('common.later')}
            </Button>
          ) : null}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    borderRadius: theme.radius.lg,
    borderLeftWidth: 4,
    borderTopWidth: 1,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderTopColor: theme.colors.border,
    borderRightColor: theme.colors.border,
    borderBottomColor: theme.colors.border,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  leadIcon: {
    marginRight: theme.spacing.sm,
  },
  title: {
    flex: 1,
  },
  message: {
    marginBottom: theme.spacing.md,
  },
  actions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
    alignItems: 'center',
  },
  actionBtn: {
    borderRadius: theme.radius.full,
  },
  actionLabel: {
    fontSize: 12,
  },
});
