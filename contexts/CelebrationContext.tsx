import React, { createContext, useCallback, useContext, useRef, useState } from 'react';
import { Alert, View, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import SuccessCelebration from '@/components/delight/SuccessCelebration';
import { getDelightPreferences } from '@/utils/delight';
import { shouldShowConfettiLayer } from '@/utils/celebrationRules';
import { pickCelebrationDurationMs, pickCelebrationMessage, type CelebrationTone } from '@/utils/celebrationMessages';
import { useReduceMotion } from '@/hooks/useReduceMotion';

export type RecordSaveCelebrationMeta = {
  isNewRecord: boolean;
  todayCountBefore: number;
  totalCountBefore: number;
};

type CelebrationSession = {
  key: number;
  variant: 'minimal' | 'confetti';
  tone: CelebrationTone;
  message: string;
  durationMs: number;
  reduceMotion: boolean;
};

/** Minimum gap between save-triggered celebrations (rapid taps). Preview ignores this. */
export const CELEBRATION_SAVE_COOLDOWN_MS = 900;

type CelebrationContextValue = {
  notifyRecordSaved: (meta: RecordSaveCelebrationMeta) => Promise<void>;
  previewCelebration: () => Promise<void>;
};

const CelebrationContext = createContext<CelebrationContextValue | null>(null);

export function useCelebration(): CelebrationContextValue {
  const ctx = useContext(CelebrationContext);
  if (!ctx) {
    throw new Error('useCelebration must be used within CelebrationProvider');
  }
  return ctx;
}

export function CelebrationProvider({ children }: { children: React.ReactNode }) {
  const { t } = useTranslation();
  const reduceMotion = useReduceMotion();
  const [session, setSession] = useState<CelebrationSession | null>(null);
  const lastSaveCelebrationRef = useRef(0);

  const finishSession = useCallback(() => {
    setSession(null);
  }, []);

  const notifyRecordSaved = useCallback(
    async (meta: RecordSaveCelebrationMeta) => {
      const prefs = await getDelightPreferences();
      if (!prefs.celebrationEnabled) return;

      const now = Date.now();
      if (now - lastSaveCelebrationRef.current < CELEBRATION_SAVE_COOLDOWN_MS) return;
      lastSaveCelebrationRef.current = now;

      const totalAfter = meta.isNewRecord ? meta.totalCountBefore + 1 : meta.totalCountBefore;
      const showConfetti = shouldShowConfettiLayer({
        sillyMode: prefs.celebrationSillyMode,
        isNewRecord: meta.isNewRecord,
        todayCountBefore: meta.todayCountBefore,
        totalCountAfter: totalAfter,
      });

      const variant = showConfetti ? 'confetti' : 'minimal';
      const tone: CelebrationTone = prefs.celebrationSillyMode ? 'silly' : 'normal';

      setSession({
        key: now,
        variant,
        tone,
        message: pickCelebrationMessage(t, tone),
        durationMs: pickCelebrationDurationMs(),
        reduceMotion,
      });
    },
    [t, reduceMotion]
  );

  const previewCelebration = useCallback(async () => {
    const prefs = await getDelightPreferences();
    if (!prefs.celebrationEnabled) {
      Alert.alert(t('common.warning'), t('settings.celebrationOffHint'));
      return;
    }
    const tone: CelebrationTone = prefs.celebrationSillyMode ? 'silly' : 'normal';
    const variant = prefs.celebrationSillyMode ? 'confetti' : 'minimal';
    setSession({
      key: Date.now(),
      variant,
      tone,
      message: pickCelebrationMessage(t, tone),
      durationMs: pickCelebrationDurationMs(),
      reduceMotion,
    });
  }, [t, reduceMotion]);

  const value = React.useMemo(
    () => ({
      notifyRecordSaved,
      previewCelebration,
    }),
    [notifyRecordSaved, previewCelebration]
  );

  return (
    <CelebrationContext.Provider value={value}>
      <View style={styles.wrap}>
        {children}
        {session ? (
          <SuccessCelebration
            key={session.key}
            visible
            variant={session.variant}
            tone={session.tone}
            reduceMotion={session.reduceMotion}
            message={session.message}
            durationMs={session.durationMs}
            onFinished={finishSession}
          />
        ) : null}
      </View>
    </CelebrationContext.Provider>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1 },
});
