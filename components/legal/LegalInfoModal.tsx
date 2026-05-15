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
import FontAwesome from '@expo/vector-icons/FontAwesome';
import theme from '@/constants/DesignTokens';
import AppText from '@/components/design-system/AppText';

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
          <AppText variant="h3" style={styles.title} numberOfLines={2}>
            {title}
          </AppText>
          <Pressable
            onPress={onClose}
            hitSlop={16}
            accessibilityRole="button"
            accessibilityLabel="Close"
            style={({ pressed }) => [styles.closeBtn, pressed && { opacity: 0.65 }]}
          >
            <FontAwesome name="close" size={22} color={theme.colors.textPrimary} />
          </Pressable>
        </View>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator
          keyboardShouldPersistTaps="handled"
        >
          <AppText variant="body2" color="secondary" style={styles.body}>
            {body}
          </AppText>
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
    flex: 1,
    marginRight: theme.spacing.md,
  },
  closeBtn: {
    minWidth: 44,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scroll: { flex: 1 },
  scrollContent: {
    padding: theme.spacing.lg,
    paddingBottom: theme.spacing.xl * 2,
  },
  body: {
    lineHeight: 22,
  },
});
