import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import AppText from '@/components/design-system/AppText';
import theme from '@/constants/DesignTokens';
import PrimaryButton from '@/components/design-system/PrimaryButton';
import ModernCard from '@/components/design-system/ModernCard';
import { patchAppUiPreferences } from '@/utils/appUiPreferences';

export default function OnboardingScreen() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();

  const onContinue = async () => {
    await patchAppUiPreferences({ onboardingCompleted: true });
    router.replace('/(tabs)');
  };

  return (
    <View
      style={[
        styles.screen,
        {
          paddingTop: insets.top + theme.spacing.md,
          paddingBottom: insets.bottom + theme.spacing.lg,
        },
      ]}
    >
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <AppText style={styles.pageTitle}>{t('onboarding.pageTitle')}</AppText>

        <ModernCard elevation="md" padding="lg" style={styles.card}>
          <AppText style={styles.h}>{t('onboarding.privacyHeading')}</AppText>
          <AppText style={styles.p}>{t('onboarding.privacyText')}</AppText>
        </ModernCard>

        <ModernCard elevation="md" padding="lg" style={styles.card}>
          <AppText style={styles.h}>{t('onboarding.whyHeading')}</AppText>
          <AppText style={styles.p}>{t('onboarding.whyText')}</AppText>
        </ModernCard>

        <ModernCard elevation="md" padding="lg" style={styles.card}>
          <AppText style={styles.h}>{t('onboarding.disclaimerHeading')}</AppText>
          <AppText style={styles.p}>{t('onboarding.disclaimerText')}</AppText>
        </ModernCard>
      </ScrollView>

      <PrimaryButton title={t('onboarding.continue')} onPress={() => void onContinue()} />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: theme.colors.background,
    paddingHorizontal: theme.spacing.lg,
  },
  scroll: {
    paddingBottom: theme.spacing.xl,
  },
  pageTitle: {
    ...theme.typography.h1,
    color: theme.colors.textPrimary,
    textAlign: 'center',
    marginBottom: theme.spacing.xl,
  },
  card: {
    marginBottom: theme.spacing.md,
  },
  h: {
    ...theme.typography.h3,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.sm,
  },
  p: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    lineHeight: 24,
  },
});
