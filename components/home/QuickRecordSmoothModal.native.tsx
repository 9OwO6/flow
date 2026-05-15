import React, { useCallback, useRef, useState } from 'react';
import { Modal, View, StyleSheet, Pressable, Dimensions, Animated } from 'react-native';
import PagerView from 'react-native-pager-view';
import AppText from '@/components/design-system/AppText';
import { useTranslation } from 'react-i18next';
import theme from '@/constants/DesignTokens';
import PrimaryButton from '@/components/design-system/PrimaryButton';
import { delight } from '@/utils/delight';
import {
  LEVEL_ORDER,
  DEFAULT_PAGE,
  smoothKey,
  smoothLevelFill,
  smoothModalStyles as styles,
  type QuickRecordSmoothModalProps,
} from '@/components/home/quickRecordSmoothShared';

export default function QuickRecordSmoothModal({ visible, onClose, onConfirm }: QuickRecordSmoothModalProps) {
  const { t } = useTranslation();
  const [page, setPage] = useState(DEFAULT_PAGE);
  const pagerRef = useRef<PagerView>(null);
  const lastHapticAt = useRef(0);
  const width = Dimensions.get('window').width;
  const scalesRef = useRef(
    LEVEL_ORDER.map((_, i) => new Animated.Value(i === DEFAULT_PAGE ? 1 : 0.86))
  ).current;

  const triggerPreview = useCallback((idx: number) => {
    const now = Date.now();
    if (now - lastHapticAt.current < 280) return;
    lastHapticAt.current = now;
    void delight.playSmoothPick(LEVEL_ORDER[idx]);
  }, []);

  const updateScales = useCallback(
    (active: number) => {
      LEVEL_ORDER.forEach((_, i) => {
        Animated.spring(scalesRef[i], {
          toValue: i === active ? 1 : 0.86,
          friction: 7,
          tension: 120,
          useNativeDriver: true,
        }).start();
      });
    },
    [scalesRef]
  );

  React.useEffect(() => {
    if (visible) {
      setPage(DEFAULT_PAGE);
      requestAnimationFrame(() => {
        pagerRef.current?.setPage(DEFAULT_PAGE);
        updateScales(DEFAULT_PAGE);
      });
    }
  }, [visible, updateScales]);

  const onPageSelected = (e: { nativeEvent: { position: number } }) => {
    const p = e.nativeEvent.position;
    setPage(p);
    updateScales(p);
    triggerPreview(p);
  };

  const level = LEVEL_ORDER[page];

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} accessibilityRole="button" />
        <View style={[styles.sheet, { width: Math.min(width - 24, 420) }]}>
          <AppText variant="h3" style={styles.title}>
            {t('quickRecord.pickComfortTitle')}
          </AppText>
          <AppText variant="caption" color="secondary" style={styles.hint}>
            {t('quickRecord.pickComfortHint')}
          </AppText>

          <PagerView
            ref={pagerRef}
            style={{ width: '100%', height: 200 }}
            initialPage={DEFAULT_PAGE}
            onPageSelected={onPageSelected}
          >
            {LEVEL_ORDER.map((lv, index) => (
              <View key={String(lv)} style={styles.page} collapsable={false}>
                <Animated.View
                  style={[
                    styles.card,
                    {
                      borderColor: theme.colors.primary,
                      transform: [{ scale: scalesRef[index] }],
                    },
                  ]}
                >
                  <View style={[styles.levelDot, { backgroundColor: smoothLevelFill(lv) }]} />
                  <AppText variant="h3" style={styles.levelLabel}>
                    {t(`smoothLevel.${smoothKey(lv)}`)}
                  </AppText>
                </Animated.View>
              </View>
            ))}
          </PagerView>

          <View style={styles.dots}>
            {LEVEL_ORDER.map((_, i) => (
              <View key={i} style={[styles.dot, i === page ? styles.dotActive : styles.dotIdle]} />
            ))}
          </View>

          <PrimaryButton title={t('quickRecord.confirmLog')} onPress={() => onConfirm(level)} />
          <PrimaryButton
            title={t('common.cancel')}
            onPress={onClose}
            variant="outlined"
            style={{ marginTop: theme.spacing.sm }}
          />
        </View>
      </View>
    </Modal>
  );
}
