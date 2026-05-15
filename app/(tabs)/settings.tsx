import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Alert, Animated, ScrollView, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import AppText from '@/components/design-system/AppText';
import AppConfirmDialog, { AppAlertDialog } from '@/components/design-system/AppConfirmDialog';
import { useTranslation } from 'react-i18next';
import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';
import theme from '@/constants/DesignTokens';
import { StorageService } from '@/utils/storage';
import { changeLanguage, getCurrentLanguage } from '@/utils/i18n';
import { UserSettings } from '@/types';
import { ExportService } from '@/utils/exportService';
import {
  delight,
  getDelightPreferences,
  saveDelightPreferences,
  type DelightPreferences,
  DEFAULT_DELIGHT_PREFERENCES,
} from '@/utils/delight';
import {
  getAppUiPreferences,
  saveAppUiPreferences,
  patchAppUiPreferences,
  type AppUiPreferences,
  DEFAULT_APP_UI_PREFERENCES,
} from '@/utils/appUiPreferences';
import SwipeableContainer from '@/components/SwipeableContainer';
import ModernCard from '@/components/design-system/ModernCard';
import PrimaryButton from '@/components/design-system/PrimaryButton';
import LegalInfoModal from '@/components/legal/LegalInfoModal';
import Share7DayModal from '@/components/share/Share7DayModal';
import { TextInput } from 'react-native-paper';
import {
  createFadeInAnimation, 
  createSlideInAnimation 
} from '@/utils/animations';
import { useCelebration } from '@/contexts/CelebrationContext';
import SettingsGroup from '@/components/settings/SettingsGroup';
import CustomSuccessSoundsSection from '@/components/settings/CustomSuccessSoundsSection';
import { SettingsRowPressable, SettingsRowToggle } from '@/components/settings/SettingsRow';
import {
  ensureWaterNotificationPermission,
  syncWaterNudgeSchedule,
} from '@/utils/waterNudgeScheduler';

export default function SettingsScreen() {
  const { t, i18n } = useTranslation();
  const { previewCelebration } = useCelebration();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const designColors = theme.colors;
  
  // 动画状态
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(50));
  
  // 设置状态
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [isDarkMode, setIsDarkMode] = useState(colorScheme === 'dark');
  const [userSettings, setUserSettings] = useState<UserSettings | null>(null);
  const [delightPrefs, setDelightPrefs] = useState<DelightPreferences>({
    ...DEFAULT_DELIGHT_PREFERENCES,
  });
  const [appUi, setAppUi] = useState<AppUiPreferences>(DEFAULT_APP_UI_PREFERENCES);
  const [privacyOpen, setPrivacyOpen] = useState(false);
  const [disclaimerOpen, setDisclaimerOpen] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [clearConfirmVisible, setClearConfirmVisible] = useState(false);
  const [clearFeedback, setClearFeedback] = useState<{ title: string; message: string } | null>(null);

  // 页面加载动画
  useEffect(() => {
    Animated.parallel([
      createFadeInAnimation(fadeAnim, 800),
      createSlideInAnimation(slideAnim, 50, 800),
    ]).start();
    
    // 获取当前语言
    setCurrentLanguage(getCurrentLanguage());
    loadUserSettings();
    getDelightPreferences().then((p) => {
      setDelightPrefs(p);
      delight.applyPrefs(p);
    });
    getAppUiPreferences().then(setAppUi);
  }, []);

  const updateAppUi = (patch: Partial<AppUiPreferences>) => {
    setAppUi((prev) => {
      const next = { ...prev, ...patch };
      void saveAppUiPreferences(next).catch((e) => console.error(e));
      return next;
    });
  };

  const replayWelcome = () => {
    Alert.alert(t('settings.showWelcomeAgain'), '', [
      { text: t('common.cancel'), style: 'cancel' },
      {
        text: t('common.confirm'),
        onPress: () => {
          void (async () => {
            await patchAppUiPreferences({ onboardingCompleted: false });
            router.replace('/onboarding');
          })();
        },
      },
    ]);
  };

  const updateDelightPrefs = (patch: Partial<DelightPreferences>) => {
    setDelightPrefs((prev) => {
      const next = { ...prev, ...patch };
      delight.applyPrefs(next);
      void saveDelightPreferences(next).catch((e) => console.error(e));
      return next;
    });
  };

  const handleTestSuccessSound = async () => {
    if (!delight.getPrefs().sound) {
      Alert.alert(t('common.warning'), t('settings.delightSoundOffHint'));
      return;
    }
    await delight.playSuccessTest();
  };

  const handlePreviewCelebration = () => {
    void previewCelebration();
  };

  const loadUserSettings = async () => {
    try {
      const settings = await StorageService.getUserSettings();
      setUserSettings(settings);
    } catch (error) {
      console.error('Error loading user settings:', error);
    }
  };

  const patchUserSettings = async (patch: Partial<UserSettings>) => {
    if (!userSettings) return;
    const next = { ...userSettings, ...patch };
    try {
      await StorageService.saveUserSettings(next);
      setUserSettings(next);
      await syncWaterNudgeSchedule();
    } catch (e) {
      console.error(e);
    }
  };

  const handleSaveSettings = async (newSettings: UserSettings) => {
    try {
      await StorageService.saveUserSettings(newSettings);
      setUserSettings(newSettings);
      Alert.alert(t('common.success'), t('settings.settingsSaved', 'Settings saved successfully'));
    } catch (error) {
      console.error('Error saving settings:', error);
      Alert.alert(t('common.error'), t('settings.saveError', 'Failed to save settings'));
    }
  };

  // 切换语言
  const handleLanguageChange = async (language: string) => {
    try {
      await changeLanguage(language);
      setCurrentLanguage(language);
      Alert.alert(
        t('common.success'),
        t('settings.languageChanged')
      );
    } catch (error) {
      console.error('Error changing language:', error);
      Alert.alert(t('common.error'), t('settings.changeLanguageError'));
    }
  };

  // Clear all data — destructive confirm (not system Alert chain)
  const handleClearData = () => {
    setClearConfirmVisible(true);
  };

  const confirmClearAll = async () => {
    setClearConfirmVisible(false);
    try {
      await StorageService.clearAllData();
      setClearFeedback({ title: t('common.success'), message: t('settings.clearDataSuccess') });
    } catch (error) {
      console.error('Error clearing data:', error);
      setClearFeedback({ title: t('common.error'), message: t('settings.clearDataError') });
    }
  };

  return (
    <SwipeableContainer style={[styles.container, { backgroundColor: designColors.background }]}>
        <Animated.ScrollView 
          style={[styles.scrollView, { opacity: fadeAnim }]}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* 标题区域 */}
          <Animated.View style={{ transform: [{ translateY: slideAnim }] }}>
            <ModernCard elevation="md" padding="lg" style={styles.headerCard}>
              <View style={styles.headerContent}>
                <AppText style={styles.title}>
                  {t('settings.title')}
                </AppText>
                <AppText style={styles.subtitle}>
                  {t('settings.subtitle')}
                </AppText>
              </View>
            </ModernCard>
          </Animated.View>

          {/* 设置选项 — grouped list */}
          <Animated.View style={{ transform: [{ translateY: slideAnim }] }}>
            <SettingsGroup title={t('settings.trustDataSection')} footer={t('settings.trustDataFooter')}>
              <SettingsRowPressable
                isFirst
                label={t('settings.privacyPolicy')}
                showChevron
                onPress={() => setPrivacyOpen(true)}
              />
              <SettingsRowPressable
                label={t('settings.medicalDisclaimer')}
                showChevron
                onPress={() => setDisclaimerOpen(true)}
              />
              <View style={[styles.exportButtons, { padding: theme.spacing.md }]}>
                <PrimaryButton
                  title={t('settings.exportCSV', 'Export CSV')}
                  onPress={async () => {
                    try {
                      await ExportService.exportCSVAndShare();
                      Alert.alert(t('common.success'), t('settings.exportSuccess', 'Data exported successfully'));
                    } catch (error) {
                      console.error('Export error:', error);
                      Alert.alert(t('common.error'), t('settings.exportError', 'Failed to export data'));
                    }
                  }}
                  variant="outlined"
                  size="medium"
                  style={styles.exportButton}
                />
                <PrimaryButton
                  title={t('settings.exportJSON', 'Export JSON')}
                  onPress={async () => {
                    try {
                      await ExportService.exportJSONAndShare();
                      Alert.alert(t('common.success'), t('settings.exportSuccess', 'Data exported successfully'));
                    } catch (error) {
                      console.error('Export error:', error);
                      Alert.alert(t('common.error'), t('settings.exportError', 'Failed to export data'));
                    }
                  }}
                  variant="outlined"
                  size="medium"
                  style={styles.exportButton}
                />
              </View>
              <TouchableOpacity
                onPress={handleClearData}
                style={[styles.clearButton, { borderColor: designColors.error }]}
              >
                <AppText style={[styles.clearButtonText, { color: designColors.error }]}>
                  {t('settings.clearData')}
                </AppText>
              </TouchableOpacity>
            </SettingsGroup>

            <SettingsGroup title={t('settings.loggingSection')}>
              <View style={styles.languageOptions}>
                <TouchableOpacity
                  onPress={() => handleLanguageChange('en')}
                  style={[
                    styles.languageButton,
                    currentLanguage === 'en' && styles.languageButtonSelected,
                  ]}
                >
                  <AppText
                    style={[
                      styles.languageButtonText,
                      currentLanguage === 'en' && styles.languageButtonTextSelected,
                    ]}
                  >
                    {t('settings.english')}
                  </AppText>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleLanguageChange('zh')}
                  style={[
                    styles.languageButton,
                    currentLanguage === 'zh' && styles.languageButtonSelected,
                  ]}
                >
                  <AppText
                    style={[
                      styles.languageButtonText,
                      currentLanguage === 'zh' && styles.languageButtonTextSelected,
                    ]}
                  >
                    {t('settings.chinese')}
                  </AppText>
                </TouchableOpacity>
              </View>
              <SettingsRowPressable
                label={t('settings.showWelcomeAgain')}
                showChevron
                onPress={replayWelcome}
              />
            </SettingsGroup>

            <SettingsGroup title={t('settings.theme')}>
              <View style={{ padding: theme.spacing.md }}>
                <AppText style={styles.themeText}>
                  {isDarkMode ? t('settings.dark') : t('settings.light')} {t('settings.theme')}
                </AppText>
                <AppText style={styles.themeNote}>{t('settings.followsSystem', 'Follows system settings')}</AppText>
              </View>
            </SettingsGroup>

            <SettingsGroup title={t('settings.guidanceSection')}>
              <SettingsRowToggle
                isFirst
                label={t('settings.emptyGuidanceToggle')}
                value={appUi.emptyGuidanceEnabled}
                onValueChange={(v) => updateAppUi({ emptyGuidanceEnabled: v })}
                trackColor={{ false: theme.colors.border, true: theme.colors.primaryLight }}
                thumbColor={
                  appUi.emptyGuidanceEnabled ? theme.colors.primary : theme.colors.textTertiary
                }
              />
            </SettingsGroup>

            <SettingsGroup title={t('settings.shareSection')}>
              <SettingsRowToggle
                isFirst
                label={t('settings.share7DayToggle')}
                value={appUi.share7DaySummaryEnabled}
                onValueChange={(v) => updateAppUi({ share7DaySummaryEnabled: v })}
                trackColor={{ false: theme.colors.border, true: theme.colors.primaryLight }}
                thumbColor={
                  appUi.share7DaySummaryEnabled ? theme.colors.primary : theme.colors.textTertiary
                }
              />
              {appUi.share7DaySummaryEnabled ? (
                <View style={{ padding: theme.spacing.md, paddingTop: 0 }}>
                  <PrimaryButton
                    title={t('share.settingsCta')}
                    onPress={() => setShareModalOpen(true)}
                    variant="outlined"
                    size="medium"
                  />
                </View>
              ) : null}
            </SettingsGroup>

            {userSettings ? (
              <SettingsGroup title={t('settings.remindersSection')} footer={t('water.nudgeHint')}>
                <SettingsRowToggle
                  isFirst
                  label={t('water.nudgeToggle')}
                  value={userSettings.waterReminderEnabled}
                  onValueChange={async (v) => {
                    if (v) {
                      const ok = await ensureWaterNotificationPermission();
                      if (!ok) {
                        Alert.alert(t('common.warning'), t('settings.notificationPermissionNeeded'));
                        return;
                      }
                    }
                    await patchUserSettings({ waterReminderEnabled: v });
                  }}
                  trackColor={{ false: theme.colors.border, true: theme.colors.primaryLight }}
                  thumbColor={
                    userSettings.waterReminderEnabled ? theme.colors.primary : theme.colors.textTertiary
                  }
                />
                <View style={[styles.sleepRow, { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: theme.colors.border }]}>
                  <AppText style={styles.sleepLabel}>{t('water.quietHours')}</AppText>
                  <View style={styles.sleepInputs}>
                    <TextInput
                      mode="outlined"
                      dense
                      label={t('water.sleepStart')}
                      value={userSettings.sleepQuietHoursStart}
                      onChangeText={(text) =>
                        setUserSettings((s) => (s ? { ...s, sleepQuietHoursStart: text } : s))
                      }
                      onBlur={() => void patchUserSettings({ sleepQuietHoursStart: userSettings.sleepQuietHoursStart })}
                      style={{ flex: 1, marginRight: theme.spacing.sm, backgroundColor: theme.colors.surfaceVariant }}
                    />
                    <TextInput
                      mode="outlined"
                      dense
                      label={t('water.sleepEnd')}
                      value={userSettings.sleepQuietHoursEnd}
                      onChangeText={(text) =>
                        setUserSettings((s) => (s ? { ...s, sleepQuietHoursEnd: text } : s))
                      }
                      onBlur={() => void patchUserSettings({ sleepQuietHoursEnd: userSettings.sleepQuietHoursEnd })}
                      style={{ flex: 1, backgroundColor: theme.colors.surfaceVariant }}
                    />
                  </View>
                </View>
                <View style={{ padding: theme.spacing.md, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: theme.colors.border }}>
                  <AppText style={styles.themeNote}>{t('settings.dailyWaterGoal', 'Daily water goal (ml)')}</AppText>
                  <TextInput
                    mode="outlined"
                    keyboardType="number-pad"
                    value={String(userSettings.dailyWaterGoal)}
                    onChangeText={(text) => {
                      const n = parseInt(text.replace(/\D/g, ''), 10);
                      setUserSettings((s) =>
                        s ? { ...s, dailyWaterGoal: Number.isFinite(n) ? n : s.dailyWaterGoal } : s
                      );
                    }}
                    onBlur={async () => {
                      const g = userSettings.dailyWaterGoal;
                      if (g >= 500 && g <= 8000) await patchUserSettings({ dailyWaterGoal: g });
                    }}
                    style={{ marginTop: theme.spacing.xs, backgroundColor: theme.colors.surfaceVariant }}
                  />
                </View>
              </SettingsGroup>
            ) : null}

            <SettingsGroup title={t('settings.feedbackSection')}>
              <SettingsRowToggle
                isFirst
                label={t('settings.delightSound')}
                value={delightPrefs.sound}
                onValueChange={(v) => updateDelightPrefs({ sound: v })}
                trackColor={{ false: theme.colors.border, true: theme.colors.primaryLight }}
                thumbColor={delightPrefs.sound ? theme.colors.primary : theme.colors.textTertiary}
              />
              <SettingsRowToggle
                label={t('settings.delightHaptics')}
                value={delightPrefs.haptics}
                onValueChange={(v) => updateDelightPrefs({ haptics: v })}
                trackColor={{ false: theme.colors.border, true: theme.colors.primaryLight }}
                thumbColor={delightPrefs.haptics ? theme.colors.primary : theme.colors.textTertiary}
              />
              <SettingsRowToggle
                label={t('settings.delightMotion')}
                value={delightPrefs.enhancedMotion}
                onValueChange={(v) => updateDelightPrefs({ enhancedMotion: v })}
                trackColor={{ false: theme.colors.border, true: theme.colors.primaryLight }}
                thumbColor={delightPrefs.enhancedMotion ? theme.colors.primary : theme.colors.textTertiary}
              />
              <SettingsRowToggle
                label={t('settings.celebrationToggle')}
                value={delightPrefs.celebrationEnabled}
                onValueChange={(v) => updateDelightPrefs({ celebrationEnabled: v })}
                trackColor={{ false: theme.colors.border, true: theme.colors.primaryLight }}
                thumbColor={
                  delightPrefs.celebrationEnabled ? theme.colors.primary : theme.colors.textTertiary
                }
              />
              <SettingsRowToggle
                label={t('settings.celebrationSillyToggle')}
                value={delightPrefs.celebrationSillyMode}
                onValueChange={(v) => updateDelightPrefs({ celebrationSillyMode: v })}
                trackColor={{ false: theme.colors.border, true: theme.colors.primaryLight }}
                thumbColor={
                  delightPrefs.celebrationSillyMode ? theme.colors.primary : theme.colors.textTertiary
                }
              />
              <View style={{ padding: theme.spacing.md, gap: theme.spacing.sm }}>
                <PrimaryButton
                  title={t('settings.delightTestSound')}
                  onPress={() => void handleTestSuccessSound()}
                  variant="outlined"
                  size="medium"
                />
                <PrimaryButton
                  title={t('settings.celebrationPreview')}
                  onPress={handlePreviewCelebration}
                  variant="outlined"
                  size="medium"
                />
              </View>
            </SettingsGroup>

            <CustomSuccessSoundsSection />

            {__DEV__ ? (
              <SettingsGroup title="Development">
                <SettingsRowPressable
                  isFirst
                  label="UI Playground"
                  showChevron
                  onPress={() => router.push('/playground')}
                />
              </SettingsGroup>
            ) : null}

            <SettingsGroup title={t('settings.about')}>
              <View style={styles.aboutInfo}>
                <AppText style={styles.aboutText}>Flow</AppText>
                <AppText style={styles.versionText}>{t('settings.version')}: 1.0.0</AppText>
                <AppText style={styles.descriptionText}>
                  {t('settings.description', 'Track your body flow with ease and care')}
                </AppText>
              </View>
            </SettingsGroup>
          </Animated.View>
        </Animated.ScrollView>

      <LegalInfoModal
        visible={privacyOpen}
        title={t('legal.privacyTitle')}
        body={t('legal.privacyBody')}
        onClose={() => setPrivacyOpen(false)}
      />
      <LegalInfoModal
        visible={disclaimerOpen}
        title={t('legal.disclaimerTitle')}
        body={t('legal.disclaimerBody')}
        onClose={() => setDisclaimerOpen(false)}
      />
      <Share7DayModal
        visible={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
      />
      <AppConfirmDialog
        visible={clearConfirmVisible}
        title={t('settings.clearData')}
        message={t('settings.clearDataConfirm')}
        confirmLabel={t('common.confirm')}
        cancelLabel={t('common.cancel')}
        destructive
        onConfirm={() => void confirmClearAll()}
        onCancel={() => setClearConfirmVisible(false)}
      />
      <AppAlertDialog
        visible={!!clearFeedback}
        title={clearFeedback?.title ?? ''}
        message={clearFeedback?.message ?? ''}
        buttonLabel={t('common.ok', 'OK')}
        onDismiss={() => setClearFeedback(null)}
      />
    </SwipeableContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: theme.spacing.md,
    paddingBottom: theme.spacing.xl,
  },
  headerCard: {
    marginBottom: theme.spacing.md,
  },
  headerContent: {
    alignItems: 'center',
  },
  title: {
    ...theme.typography.h2,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.sm,
    textAlign: 'center',
  },
  subtitle: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
  section: {
    marginBottom: theme.spacing.lg,
  },
  sectionTitle: {
    ...theme.typography.h3,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.md,
  },
  languageOptions: {
    flexDirection: 'row',
    gap: theme.spacing.md,
    padding: theme.spacing.md,
  },
  sleepRow: {
    padding: theme.spacing.md,
  },
  sleepLabel: {
    ...theme.typography.body,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.sm,
  },
  sleepInputs: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  languageButton: {
    flex: 1,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: theme.radius.md,
    borderWidth: 1.5,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: theme.touchTarget.min,
  },
  languageButtonSelected: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
    ...theme.elevation.sm,
  },
  languageButtonText: {
    ...theme.typography.button,
    color: theme.colors.textPrimary,
  },
  languageButtonTextSelected: {
    color: theme.colors.textOnPrimary,
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.border,
    marginVertical: theme.spacing.md,
  },
  themeInfo: {
    alignItems: 'center',
  },
  themeText: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
  },
  themeNote: {
    ...theme.typography.caption,
    color: theme.colors.textTertiary,
  },
  clearButton: {
    marginTop: theme.spacing.sm,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: theme.radius.md,
    borderWidth: 1.5,
    backgroundColor: `${theme.colors.error}10`,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: theme.touchTarget.min,
  },
  exportButtons: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
  },
  exportButton: {
    flex: 1,
  },
  clearButtonText: {
    ...theme.typography.button,
  },
  aboutInfo: {
    alignItems: 'center',
  },
  aboutText: {
    ...theme.typography.h3,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.sm,
  },
  versionText: {
    ...theme.typography.caption,
    color: theme.colors.textTertiary,
    marginBottom: theme.spacing.md,
  },
  descriptionText: {
    ...theme.typography.body2,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.md,
  },
  settingLabel: {
    ...theme.typography.body,
    color: theme.colors.textPrimary,
    flex: 1,
    marginRight: theme.spacing.md,
  },
  linkRow: {
    paddingVertical: theme.spacing.sm,
    marginBottom: theme.spacing.xs,
  },
  linkText: {
    ...theme.typography.body,
    color: theme.colors.primaryDark,
    textDecorationLine: 'underline',
  },
  numberInput: {
    width: 100,
    height: 40,
    backgroundColor: theme.colors.surfaceVariant,
  },
}); 
