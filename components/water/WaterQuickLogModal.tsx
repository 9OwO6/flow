import React, { useState } from 'react';
import { Modal, View, StyleSheet, Pressable, TouchableOpacity } from 'react-native';
import AppText from '@/components/design-system/AppText';
import { useTranslation } from 'react-i18next';
import theme from '@/constants/DesignTokens';
import PrimaryButton from '@/components/design-system/PrimaryButton';
import { WaterService } from '@/utils/waterService';

const AMOUNTS = [200, 250, 500, 750] as const;

type Props = {
  visible: boolean;
  onClose: () => void;
  onLogged?: () => void;
};

export default function WaterQuickLogModal({ visible, onClose, onLogged }: Props) {
  const { t } = useTranslation();
  const [busy, setBusy] = useState(false);

  const add = async (ml: number) => {
    if (busy) return;
    setBusy(true);
    try {
      await WaterService.addQuickWater(ml);
      onLogged?.();
      onClose();
    } finally {
      setBusy(false);
    }
  };

  return (
    <Modal visible={visible} animationType="fade" transparent onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
        <View style={styles.sheet}>
          <AppText style={styles.title}>{t('water.quickLogTitle')}</AppText>
          <AppText style={styles.sub}>{t('water.quickLogSub')}</AppText>

          <View style={styles.grid}>
            {AMOUNTS.map((ml) => (
              <TouchableOpacity
                key={ml}
                style={[styles.chip, { borderColor: theme.colors.primary }]}
                onPress={() => void add(ml)}
                disabled={busy}
                activeOpacity={0.85}
              >
                <AppText style={styles.chipText}>+{ml} ml</AppText>
              </TouchableOpacity>
            ))}
          </View>

          <PrimaryButton title={t('common.close')} onPress={onClose} variant="outlined" disabled={busy} />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.lg,
  },
  sheet: {
    width: '100%',
    maxWidth: 380,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.lg,
    ...theme.elevation.md,
  },
  title: {
    ...theme.typography.h3,
    color: theme.colors.textPrimary,
    textAlign: 'center',
    marginBottom: theme.spacing.xs,
  },
  sub: {
    ...theme.typography.body2,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginBottom: theme.spacing.lg,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.lg,
  },
  chip: {
    minWidth: '42%',
    flexGrow: 1,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.radius.md,
    borderWidth: 1.5,
    backgroundColor: theme.colors.primaryLight,
    alignItems: 'center',
  },
  chipText: {
    ...theme.typography.button,
    color: theme.colors.primaryDark,
  },
});
