import React, { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Redirect } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';

import AppText from '@/components/design-system/AppText';
import PrimaryButton from '@/components/design-system/PrimaryButton';
import ModernCard from '@/components/design-system/ModernCard';
import AppSnackbar from '@/components/design-system/AppSnackbar';
import AppConfirmDialog, { AppAlertDialog } from '@/components/design-system/AppConfirmDialog';
import SectionHeader from '@/components/design-system/SectionHeader';
import theme from '@/constants/DesignTokens';

/**
 * Dev-only visual QA surface (typography, spacing tokens, dialogs).
 * Production builds should redirect away; route still exists for safety.
 */
export default function PlaygroundScreen() {
  const [snackOpen, setSnackOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [destructOpen, setDestructOpen] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);

  if (!__DEV__) {
    return <Redirect href="/(tabs)" />;
  }

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <SectionHeader title="UI Playground" subtitle="Typography · spacing · dialogs (dev-only)" />

      <ModernCard elevation="md" padding="md" style={styles.block}>
        <AppText variant="h2">Typography</AppText>
        <AppText variant="h3">Heading h3</AppText>
        <AppText variant="body">Body primary</AppText>
        <AppText variant="body2" color="secondary">
          Body secondary
        </AppText>
        <AppText variant="caption" color="tertiary">
          Caption tertiary
        </AppText>
      </ModernCard>

      <ModernCard elevation="sm" padding="md" style={styles.block}>
        <AppText variant="h3" style={{ marginBottom: theme.spacing.sm }}>
          Icons
        </AppText>
        <View style={styles.iconRow}>
          <FontAwesome name="leaf" size={24} color={theme.colors.primary} />
          <FontAwesome name="tint" size={24} color={theme.colors.info} />
          <FontAwesome name="close" size={24} color={theme.colors.textSecondary} />
        </View>
      </ModernCard>

      <ModernCard elevation="sm" padding="md" style={styles.block}>
        <AppText variant="h3" style={{ marginBottom: theme.spacing.md }}>
          Spacing (8 / 12 / 16 / 24)
        </AppText>
        <View style={[styles.spacingSwatch, { width: theme.spacing.xs, backgroundColor: theme.colors.primary }]} />
        <View style={[styles.spacingSwatch, { width: theme.spacing.sm, backgroundColor: theme.colors.primaryDark }]} />
        <View style={[styles.spacingSwatch, { width: theme.spacing.md, backgroundColor: theme.colors.secondary }]} />
        <View style={[styles.spacingSwatch, { width: theme.spacing.lg, backgroundColor: theme.colors.primary }]} />
      </ModernCard>

      <ModernCard elevation="sm" padding="md" style={styles.block}>
        <AppText variant="h3" style={{ marginBottom: theme.spacing.md }}>
          Dialog / Snackbar
        </AppText>
        <PrimaryButton title="Open Snackbar" onPress={() => setSnackOpen(true)} style={styles.btn} />
        <PrimaryButton
          title="Confirm dialog"
          onPress={() => setConfirmOpen(true)}
          variant="outlined"
          style={styles.btn}
        />
        <PrimaryButton
          title="Destructive confirm"
          onPress={() => setDestructOpen(true)}
          variant="outlined"
          style={styles.btn}
        />
        <PrimaryButton title="Alert dialog" onPress={() => setAlertOpen(true)} variant="outlined" style={styles.btn} />
      </ModernCard>

      <AppSnackbar visible={snackOpen} message="Snack message (AppText inside)" onDismiss={() => setSnackOpen(false)} />
      <AppConfirmDialog
        visible={confirmOpen}
        title="Confirm"
        message="Neutral confirm: cancel left, primary right."
        confirmLabel="OK"
        cancelLabel="Cancel"
        onConfirm={() => setConfirmOpen(false)}
        onCancel={() => setConfirmOpen(false)}
      />
      <AppConfirmDialog
        visible={destructOpen}
        title="Delete item"
        message="Destructive style uses error for the confirm button."
        confirmLabel="Delete"
        cancelLabel="Cancel"
        destructive
        onConfirm={() => setDestructOpen(false)}
        onCancel={() => setDestructOpen(false)}
      />
      <AppAlertDialog
        visible={alertOpen}
        title="Done"
        message="Single-action alert pattern."
        buttonLabel="Close"
        onDismiss={() => setAlertOpen(false)}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: theme.colors.background },
  content: {
    padding: theme.spacing.md,
    paddingBottom: theme.spacing.xl * 2,
    gap: theme.spacing.md,
  },
  block: { gap: theme.spacing.sm },
  iconRow: { flexDirection: 'row', gap: theme.spacing.lg, alignItems: 'center' },
  spacingSwatch: { height: 8, borderRadius: 4, marginBottom: theme.spacing.sm },
  btn: { marginBottom: theme.spacing.sm },
});
