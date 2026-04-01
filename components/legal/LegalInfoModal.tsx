import React from 'react';
import {
  Modal,
  View,
  ScrollView,
  Pressable,
  StyleSheet,
  useWindowDimensions,
  Platform,
} from 'react-native';
import { Text } from '@/components/Themed';
import theme from '@/constants/DesignTokens';

type Props = {
  visible: boolean;
  title: string;
  body: string;
  onClose: () => void;
};

export default function LegalInfoModal({
  visible,
  title,
  body,
  onClose,
}: Props) {
  const { height } = useWindowDimensions();
  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={[styles.wrap, { maxHeight: height * 0.92 }]}>
        <View style={styles.header}>
          <Text style={styles.title} numberOfLines={2}>
            {title}
          </Text>
          <Pressable
            onPress={onClose}
            hitSlop={16}
            accessibilityRole="button"
            style={({ pressed }) => [styles.closeBtn, pressed && { opacity: 0.65 }]}
          >
            <Text style={styles.closeLabel}>✕</Text>
          </Pressable>
        </View>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.body}>{body}</Text>
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    marginTop: 48,
    backgroundColor: theme.colors.surface,
    borderTopLeftRadius: theme.radius.lg,
    borderTopRightRadius: theme.radius.lg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
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
  },
  closeLabel: {
    ...theme.typography.h3,
    color: theme.colors.textPrimary,
    fontWeight: '600',
  },
  scroll: { flex: 1 },
  scrollContent: {
    padding: theme.spacing.lg,
    paddingBottom: theme.spacing.xl * 2,
  },
  body: {
    ...theme.typography.body2,
    color: theme.colors.textSecondary,
    lineHeight: 22,
  },
});
