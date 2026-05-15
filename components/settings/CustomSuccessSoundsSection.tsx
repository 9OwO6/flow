import React, { useCallback, useEffect, useRef, useState } from 'react';
import { View, Alert, Platform, StyleSheet, ActivityIndicator, Pressable } from 'react-native';
import { Audio } from 'expo-av';
import * as DocumentPicker from 'expo-document-picker';
import AppText from '@/components/design-system/AppText';
import { useTranslation } from 'react-i18next';
import theme from '@/constants/DesignTokens';
import { delight } from '@/utils/delight';
import {
  getCustomSuccessSoundsPreferences,
  saveCustomSuccessSoundsPreferences,
  importAudioToSlot,
  clearSlot,
  finalizeRecordingToSlot,
  getCustomSoundsDir,
  type CustomSuccessSoundsPreferences,
  type SlotIndex,
} from '@/utils/customSuccessSounds';
import { previewCustomSuccessClip } from '@/utils/delight/soundEngine';
import SettingsGroup from '@/components/settings/SettingsGroup';
import { SettingsRowToggle } from '@/components/settings/SettingsRow';

export default function CustomSuccessSoundsSection() {
  const { t } = useTranslation();
  const [prefs, setPrefs] = useState<CustomSuccessSoundsPreferences | null>(null);
  const [busySlot, setBusySlot] = useState<SlotIndex | null>(null);
  const [recordingSlot, setRecordingSlot] = useState<SlotIndex | null>(null);
  const recordingRef = useRef<Audio.Recording | null>(null);

  const load = useCallback(async () => {
    const p = await getCustomSuccessSoundsPreferences();
    setPrefs(p);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    return () => {
      const rec = recordingRef.current;
      if (rec) {
        void rec.stopAndUnloadAsync().catch(() => undefined);
        recordingRef.current = null;
      }
    };
  }, []);

  const refreshDelight = useCallback(async () => {
    await delight.refreshPrefs();
  }, []);

  const syncPrefs = useCallback(
    async (next: CustomSuccessSoundsPreferences) => {
      setPrefs(next);
      await refreshDelight();
    },
    [refreshDelight]
  );

  const onPickFile = async (slot: SlotIndex) => {
    if (!prefs || busySlot !== null) return;
    try {
      setBusySlot(slot);
      const result = await DocumentPicker.getDocumentAsync({
        type: ['audio/*'],
        copyToCacheDirectory: true,
      });
      if (result.canceled || !result.assets?.[0]) return;
      const asset = result.assets[0];
      const next = await importAudioToSlot(prefs, slot, asset.uri, asset.name, asset.mimeType);
      await syncPrefs(next);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : '';
      if (msg === 'FILE_TOO_LARGE') {
        Alert.alert(t('common.error'), t('settings.customSoundTooLarge'));
      } else {
        Alert.alert(t('common.error'), t('settings.customSoundImportError'));
      }
    } finally {
      setBusySlot(null);
    }
  };

  const startRecording = async (slot: SlotIndex) => {
    if (!prefs || recordingSlot !== null || busySlot !== null) return;
    try {
      setBusySlot(slot);
      const perm = await Audio.requestPermissionsAsync();
      if (!perm.granted) {
        Alert.alert(t('settings.customSoundMicDeniedTitle'), t('settings.customSoundMicDeniedBody'));
        return;
      }
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
        staysActiveInBackground: false,
        shouldDuckAndroid: true,
        playThroughEarpieceAndroid: false,
      });
      const rec = new Audio.Recording();
      await rec.prepareToRecordAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
      await rec.startAsync();
      recordingRef.current = rec;
      setRecordingSlot(slot);
    } catch {
      Alert.alert(t('common.error'), t('settings.customSoundRecordError'));
    } finally {
      setBusySlot(null);
    }
  };

  const stopRecording = async () => {
    if (!prefs || recordingSlot === null) return;
    const slot = recordingSlot;
    const rec = recordingRef.current;
    if (!rec) return;
    try {
      setBusySlot(slot);
      await rec.stopAndUnloadAsync();
      const uri = rec.getURI();
      recordingRef.current = null;
      setRecordingSlot(null);
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        playsInSilentModeIOS: false,
        staysActiveInBackground: false,
        shouldDuckAndroid: true,
        playThroughEarpieceAndroid: false,
      });
      if (!uri) return;
      const next = await finalizeRecordingToSlot(prefs, slot, uri);
      await syncPrefs(next);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : '';
      if (msg === 'FILE_TOO_LARGE') {
        Alert.alert(t('common.error'), t('settings.customSoundTooLarge'));
      } else {
        Alert.alert(t('common.error'), t('settings.customSoundRecordError'));
      }
    } finally {
      setBusySlot(null);
    }
  };

  const onClearSlot = async (slot: SlotIndex) => {
    if (!prefs || busySlot !== null) return;
    setBusySlot(slot);
    try {
      const next = await clearSlot(prefs, slot);
      await syncPrefs(next);
    } finally {
      setBusySlot(null);
    }
  };

  const onPreviewSlot = async (slot: SlotIndex) => {
    if (!prefs) return;
    const name = prefs.slots[slot];
    if (!name) return;
    const uri = `${getCustomSoundsDir()}${name}`;
    try {
      await previewCustomSuccessClip(uri);
    } catch {
      Alert.alert(t('common.error'), t('settings.customSoundPlayError'));
    }
  };

  const updatePrefs = async (patch: Partial<CustomSuccessSoundsPreferences>) => {
    if (!prefs) return;
    const next = { ...prefs, ...patch };
    await saveCustomSuccessSoundsPreferences(next);
    await syncPrefs(next);
  };

  if (Platform.OS === 'web') {
    return null;
  }

  if (!prefs) {
    return (
      <SettingsGroup title={t('settings.customSoundSection')}>
        <View style={styles.loading}>
          <ActivityIndicator color={theme.colors.primary} />
        </View>
      </SettingsGroup>
    );
  }

  const filledCount = prefs.slots.filter(Boolean).length;

  return (
    <SettingsGroup title={t('settings.customSoundSection')}>
      <AppText style={styles.hint}>{t('settings.customSoundHint')}</AppText>
      <SettingsRowToggle
        isFirst
        label={t('settings.customSoundUseCustom')}
        subtitle={t('settings.customSoundUseCustomSub')}
        value={prefs.useCustom}
        onValueChange={(v) => void updatePrefs({ useCustom: v })}
        trackColor={{ false: theme.colors.border, true: theme.colors.primaryLight }}
        thumbColor={prefs.useCustom ? theme.colors.primary : theme.colors.textTertiary}
      />
      <SettingsRowToggle
        label={t('settings.customSoundRandom')}
        subtitle={t('settings.customSoundRandomSub')}
        value={filledCount >= 2 && prefs.random}
        onValueChange={(v) => {
          if (filledCount < 2 && v) return;
          void updatePrefs({ random: v });
        }}
        trackColor={{ false: theme.colors.border, true: theme.colors.primaryLight }}
        thumbColor={filledCount >= 2 && prefs.random ? theme.colors.primary : theme.colors.textTertiary}
      />
      {filledCount < 2 ? (
        <AppText style={styles.randomNote}>{t('settings.customSoundRandomNeedTwo')}</AppText>
      ) : null}

      {[0, 1, 2].map((i) => {
        const slot = i as SlotIndex;
        const occupied = !!prefs.slots[slot];
        const isRecording = recordingSlot === slot;
        const isBusy = busySlot === slot;
        return (
          <View key={slot} style={[styles.slotBlock, slot > 0 && styles.slotBorder]}>
            <AppText style={styles.slotTitle}>
              {t('settings.customSoundSlot', { n: slot + 1 })}
              {occupied ? ` · ${prefs.slots[slot]}` : ''}
            </AppText>
            <View style={styles.slotActions}>
              <Pressable
                style={({ pressed }) => [styles.smallBtn, pressed && { opacity: 0.75 }]}
                disabled={isRecording || isBusy || recordingSlot !== null}
                onPress={() => void onPickFile(slot)}
              >
                <AppText style={styles.smallBtnText}>{t('settings.customSoundImport')}</AppText>
              </Pressable>
              {!isRecording ? (
                <Pressable
                  style={({ pressed }) => [styles.smallBtn, pressed && { opacity: 0.75 }]}
                  disabled={isBusy || recordingSlot !== null}
                  onPress={() => void startRecording(slot)}
                >
                  <AppText style={styles.smallBtnText}>{t('settings.customSoundRecord')}</AppText>
                </Pressable>
              ) : (
                <Pressable
                  style={({ pressed }) => [styles.smallBtn, styles.stopBtn, pressed && { opacity: 0.75 }]}
                  disabled={isBusy}
                  onPress={() => void stopRecording()}
                >
                  <AppText style={[styles.smallBtnText, styles.stopBtnText]}>
                    {t('settings.customSoundStop')}
                  </AppText>
                </Pressable>
              )}
              <Pressable
                style={({ pressed }) => [styles.smallBtn, pressed && { opacity: 0.75 }]}
                disabled={!occupied || isRecording || isBusy}
                onPress={() => void onPreviewSlot(slot)}
              >
                <AppText style={styles.smallBtnText}>{t('settings.customSoundPreview')}</AppText>
              </Pressable>
              <Pressable
                style={({ pressed }) => [styles.smallBtn, pressed && { opacity: 0.75 }]}
                disabled={!occupied || isRecording || isBusy}
                onPress={() => void onClearSlot(slot)}
              >
                <AppText style={styles.smallBtnText}>{t('settings.customSoundRemove')}</AppText>
              </Pressable>
            </View>
            {isBusy && !isRecording ? <ActivityIndicator style={styles.inlineSpinner} color={theme.colors.primary} /> : null}
          </View>
        );
      })}
    </SettingsGroup>
  );
}

const styles = StyleSheet.create({
  hint: {
    ...theme.typography.body2,
    color: theme.colors.textSecondary,
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.sm,
    paddingBottom: theme.spacing.xs,
  },
  randomNote: {
    ...theme.typography.caption,
    color: theme.colors.textTertiary,
    paddingHorizontal: theme.spacing.md,
    paddingBottom: theme.spacing.sm,
  },
  loading: {
    padding: theme.spacing.lg,
    alignItems: 'center',
  },
  slotBlock: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
  },
  slotBorder: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: theme.colors.border,
  },
  slotTitle: {
    ...theme.typography.body2,
    color: theme.colors.textPrimary,
    fontWeight: '600',
    marginBottom: theme.spacing.sm,
  },
  slotActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.xs,
  },
  smallBtn: {
    paddingVertical: theme.spacing.xs,
    paddingHorizontal: theme.spacing.sm,
    borderRadius: theme.radius.sm,
    backgroundColor: theme.colors.surfaceVariant,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  stopBtn: {
    backgroundColor: theme.colors.error + '18',
    borderColor: theme.colors.error + '55',
  },
  smallBtnText: {
    ...theme.typography.caption,
    color: theme.colors.primaryDark,
    fontWeight: '600',
  },
  stopBtnText: {
    color: theme.colors.error,
  },
  inlineSpinner: {
    marginTop: theme.spacing.sm,
  },
});
