import { useEffect, useState } from 'react';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { Redirect } from 'expo-router';
import { getAppUiPreferences } from '@/utils/appUiPreferences';
import theme from '@/constants/DesignTokens';

export default function EntryIndex() {
  const [done, setDone] = useState(false);
  const [toOnboarding, setToOnboarding] = useState(false);

  useEffect(() => {
    let alive = true;
    getAppUiPreferences()
      .then((p) => {
        if (!alive) return;
        setToOnboarding(!p.onboardingCompleted);
        setDone(true);
      })
      .catch(() => {
        if (!alive) return;
        setToOnboarding(true);
        setDone(true);
      });
    return () => {
      alive = false;
    };
  }, []);

  if (!done) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={theme.colors.primary} size="large" />
      </View>
    );
  }

  if (toOnboarding) {
    return <Redirect href="/onboarding" />;
  }
  return <Redirect href="/(tabs)" />;
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
  },
});
