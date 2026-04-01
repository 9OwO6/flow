import React, { useEffect, useRef, useState } from 'react';
import {
  Modal,
  View,
  StyleSheet,
  Pressable,
  ActivityIndicator,
  ScrollView,
  useWindowDimensions,
  Platform,
} from 'react-native';
import { Text } from '@/components/Themed';
import { useTranslation } from 'react-i18next';
import theme from '@/constants/DesignTokens';
import PrimaryButton from '@/components/design-system/PrimaryButton';
import SevenDayShareCard, {
  type SevenDayShareCardStrings,
} from '@/components/share/SevenDayShareCard';
import { StorageService } from '@/utils/storage';
import {
  buildSummary7dModel,
  smoothLevelFromAverage,
} from '@/utils/summary7dStats';
import { captureAndShareSummaryCard } from '@/utils/shareSummaryCard';
import { DietTag, SmoothLevel } from '@/types';
import type { TFunction } from 'i18next';

type Props = {
  visible: boolean;
  onClose: () => void;
};

function smoothI18nKey(level: SmoothLevel): string {
  switch (level) {
    case SmoothLevel.VERY_DIFFICULT:
      return 'veryDifficult';
    case SmoothLevel.DIFFICULT:
      return 'difficult';
    case SmoothLevel.NORMAL:
      return 'normal';
    case SmoothLevel.SMOOTH:
      return 'smooth';
    case SmoothLevel.VERY_SMOOTH:
      return 'verySmooth';
    default:
      return 'normal';
  }
}

function dietTagLabel(t: TFunction, tag: DietTag): string {
  const map: Record<DietTag, string> = {
    [DietTag.HIGH_FIBER]: t('diet.highFiber'),
    [DietTag.LOW_FIBER]: t('diet.lowFiber'),
    [DietTag.OILY]: t('diet.oily'),
    [DietTag.SPICY]: t('diet.spicy'),
    [DietTag.DAIRY]: t('diet.dairy'),
    [DietTag.CAFFEINE]: t('diet.caffeine'),
    [DietTag.ALCOHOL]: t('diet.alcohol'),
    [DietTag.NONE]: '',
  };
  return map[tag] ?? String(tag);
}

export default function Share7DayModal({ visible, onClose }: Props) {
  const { t } = useTranslation();
  const { height } = useWindowDimensions();
  const shotRef = useRef<View>(null);
  const [loading, setLoading] = useState(false);
  const [sharing, setSharing] = useState(false);
  const [payload, setPayload] = useState<{
    strings: SevenDayShareCardStrings;
    total: number;
    avgLine: string;
    trendLine: string;
    tagLines: { label: string; count: number }[];
  } | null>(null);

  useEffect(() => {
    if (!visible) {
      setPayload(null);
      return;
    }
    let alive = true;
    setLoading(true);
    (async () => {
      try {
        const records = await StorageService.getAllRecords();
        const model = buildSummary7dModel(records);
        const strings: SevenDayShareCardStrings = {
          brand: t('share.cardBrand'),
          headline: t('share.cardHeadline'),
          range: t('share.cardRange', {
            start: model.rangeStart,
            end: model.rangeEnd,
          }),
          totalLabel: t('share.cardTotal'),
          avgLabel: t('share.cardAvgComfort'),
          trendLabel: t('share.cardTrend'),
          tagsTitle: t('share.cardTagsTitle'),
          noTags: t('share.cardNoTags'),
          disclaimer: t('share.cardDisclaimer'),
          tagLine: t('share.cardTagLine'),
        };
        const smooth = smoothLevelFromAverage(model.avgSmoothNumeric);
        const avgLine = t('share.cardAvgComfortLine', {
          label: strings.avgLabel,
          value: t(`smoothLevel.${smoothI18nKey(smooth)}`),
        });
        const trendLine = t(`share.trend.${model.trend}`);
        const tagLines = model.tagCounts.map((x) => ({
          label: dietTagLabel(t, x.tag),
          count: x.count,
        }));
        if (alive) {
          setPayload({
            strings,
            total: model.totalRecords,
            avgLine,
            trendLine,
            tagLines,
          });
        }
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [visible, t]);

  const onShare = async () => {
    if (!payload || payload.total < 1) return;
    setSharing(true);
    try {
      await captureAndShareSummaryCard(shotRef);
    } finally {
      setSharing(false);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={[styles.wrap, { maxHeight: height * 0.95 }]}>
        <View style={styles.header}>
          <Text style={styles.title} numberOfLines={1}>
            {t('share.modalTitle')}
          </Text>
          <Pressable
            onPress={onClose}
            hitSlop={16}
            accessibilityRole="button"
            accessibilityLabel={t('common.close')}
            style={({ pressed }) => [styles.closeBtn, pressed && styles.closeBtnPressed]}
          >
            <Text style={styles.close}>✕</Text>
          </Pressable>
        </View>
        <ScrollView contentContainerStyle={styles.body} keyboardShouldPersistTaps="handled">
          {loading && (
            <ActivityIndicator color={theme.colors.primary} style={{ margin: 24 }} />
          )}
          {!loading && payload && payload.total < 1 && (
            <Text style={styles.muted}>{t('share.notEnoughData')}</Text>
          )}
          {!loading && payload && payload.total >= 1 && (
            <>
              <Text style={styles.previewCaption}>{t('share.previewCaption')}</Text>
              <View style={styles.previewBox}>
                <View style={{ transform: [{ scale: 0.86 }] }}>
                  <SevenDayShareCard
                    totalRecords={payload.total}
                    avgComfortLine={payload.avgLine}
                    trendLine={payload.trendLine}
                    tagLines={payload.tagLines}
                    strings={payload.strings}
                  />
                </View>
              </View>

              <View style={styles.offscreen} collapsable={false} pointerEvents="none">
                <View ref={shotRef} collapsable={false}>
                  <SevenDayShareCard
                    totalRecords={payload.total}
                    avgComfortLine={payload.avgLine}
                    trendLine={payload.trendLine}
                    tagLines={payload.tagLines}
                    strings={payload.strings}
                  />
                </View>
              </View>

              <Text style={styles.note}>{t('share.localNote')}</Text>
              <PrimaryButton
                title={sharing ? t('share.sharing') : t('share.sharePng')}
                onPress={() => void onShare()}
                disabled={sharing}
              />
            </>
          )}
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    marginTop: 48,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
    zIndex: 2,
    elevation: Platform.OS === 'android' ? 6 : 0,
  },
  title: {
    ...theme.typography.h3,
    color: theme.colors.textPrimary,
    flex: 1,
    marginRight: theme.spacing.md,
  },
  closeBtn: {
    minWidth: 44,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 3,
  },
  closeBtnPressed: {
    opacity: 0.65,
  },
  close: {
    ...theme.typography.h3,
    color: theme.colors.textPrimary,
    fontWeight: '600',
  },
  body: {
    padding: theme.spacing.lg,
    paddingBottom: theme.spacing.xl * 2,
  },
  previewCaption: {
    ...theme.typography.caption,
    color: theme.colors.textTertiary,
    marginBottom: theme.spacing.sm,
  },
  previewBox: {
    alignSelf: 'center',
    marginBottom: theme.spacing.lg,
    ...theme.elevation.sm,
  },
  offscreen: {
    position: 'absolute',
    left: -8000,
    top: 0,
    width: 360,
    height: 450,
    opacity: 1,
  },
  note: {
    ...theme.typography.caption,
    color: theme.colors.textTertiary,
    marginBottom: theme.spacing.md,
    textAlign: 'center',
  },
  muted: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginTop: theme.spacing.xl,
  },
});
