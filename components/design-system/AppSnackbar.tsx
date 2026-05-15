import React from 'react';
import { Portal, Snackbar } from 'react-native-paper';
import theme from '@/constants/DesignTokens';
import AppText from '@/components/design-system/AppText';

type Props = {
  visible: boolean;
  message: string;
  onDismiss: () => void;
  duration?: number;
  tone?: 'default' | 'inverse';
};

export default function AppSnackbar({
  visible,
  message,
  onDismiss,
  duration = 3500,
  tone = 'default',
}: Props) {
  const bg = tone === 'inverse' ? theme.colors.primaryDark : theme.colors.textPrimary;

  return (
    <Portal>
      <Snackbar visible={visible} onDismiss={onDismiss} duration={duration} style={{ backgroundColor: bg }}>
        <AppText variant="body2" style={{ color: theme.colors.textOnPrimary }}>
          {message}
        </AppText>
      </Snackbar>
    </Portal>
  );
}
