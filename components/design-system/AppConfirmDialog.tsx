import React from 'react';
import { StyleSheet } from 'react-native';
import { Portal, Dialog, Button } from 'react-native-paper';
import theme from '@/constants/DesignTokens';
import AppText from '@/components/design-system/AppText';

export type AppConfirmDialogProps = {
  visible: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  cancelLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
  destructive?: boolean;
};

export default function AppConfirmDialog({
  visible,
  title,
  message,
  confirmLabel,
  cancelLabel,
  onConfirm,
  onCancel,
  destructive = false,
}: AppConfirmDialogProps) {
  return (
    <Portal>
      <Dialog visible={visible} onDismiss={onCancel} style={styles.dialog}>
        <Dialog.Title style={styles.title}>{title}</Dialog.Title>
        <Dialog.Content style={styles.content}>
          <AppText variant="body2" color="secondary" style={styles.body}>
            {message}
          </AppText>
        </Dialog.Content>
        <Dialog.Actions style={styles.actions}>
          <Button onPress={onCancel} textColor={theme.colors.textSecondary}>
            {cancelLabel}
          </Button>
          <Button
            mode="contained"
            onPress={onConfirm}
            buttonColor={destructive ? theme.colors.error : theme.colors.primary}
            textColor={theme.colors.textOnPrimary}
          >
            {confirmLabel}
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
}

export function AppAlertDialog({
  visible,
  title,
  message,
  buttonLabel,
  onDismiss,
}: {
  visible: boolean;
  title: string;
  message: string;
  buttonLabel: string;
  onDismiss: () => void;
}) {
  return (
    <Portal>
      <Dialog visible={visible} onDismiss={onDismiss} style={styles.dialog}>
        <Dialog.Title style={styles.title}>{title}</Dialog.Title>
        <Dialog.Content style={styles.content}>
          <AppText variant="body2" color="secondary" style={styles.body}>
            {message}
          </AppText>
        </Dialog.Content>
        <Dialog.Actions style={styles.actions}>
          <Button mode="contained" onPress={onDismiss} buttonColor={theme.colors.primary} textColor={theme.colors.textOnPrimary}>
            {buttonLabel}
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
}

const styles = StyleSheet.create({
  dialog: {
    borderRadius: theme.radius.lg,
    backgroundColor: theme.colors.surface,
  },
  title: {
    color: theme.colors.textPrimary,
    paddingBottom: theme.spacing.xs,
  },
  content: {
    paddingTop: theme.spacing.xs,
    paddingHorizontal: theme.spacing.md,
    paddingBottom: theme.spacing.sm,
  },
  body: {
    marginTop: theme.spacing.xs,
  },
  actions: {
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    paddingBottom: theme.spacing.md,
    justifyContent: 'flex-end',
  },
});
