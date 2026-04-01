import { StyleSheet, Platform } from 'react-native';
import theme from '@/constants/DesignTokens';
import { SmoothLevel } from '@/types';

export const LEVEL_ORDER: SmoothLevel[] = [
  SmoothLevel.VERY_DIFFICULT,
  SmoothLevel.DIFFICULT,
  SmoothLevel.NORMAL,
  SmoothLevel.SMOOTH,
  SmoothLevel.VERY_SMOOTH,
];

export const DEFAULT_PAGE = LEVEL_ORDER.indexOf(SmoothLevel.NORMAL);

export type QuickRecordSmoothModalProps = {
  visible: boolean;
  onClose: () => void;
  onConfirm: (level: SmoothLevel) => void;
};

export function smoothKey(level: SmoothLevel): string {
  switch (level) {
    case SmoothLevel.VERY_DIFFICULT:
      return 'veryDifficult';
    case SmoothLevel.DIFFICULT:
      return 'difficult';
    case SmoothLevel.NORMAL:
      return 'normal';
    case SmoothLevel.SMOOTH:
      return 'smooth';
    case SmoothLevel.VERY_SMOOTH:
      return 'verySmooth';
    default:
      return 'normal';
  }
}

export function levelEmoji(lv: SmoothLevel): string {
  switch (lv) {
    case SmoothLevel.VERY_DIFFICULT:
      return '😣';
    case SmoothLevel.DIFFICULT:
      return '😟';
    case SmoothLevel.NORMAL:
      return '😐';
    case SmoothLevel.SMOOTH:
      return '🙂';
    case SmoothLevel.VERY_SMOOTH:
      return '😌';
    default:
      return '😐';
  }
}

export const smoothModalStyles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: Platform.OS === 'ios' ? 36 : 24,
  },
  sheet: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.lg,
    ...theme.elevation.md,
  },
  title: {
    ...theme.typography.h3,
    color: theme.colors.textPrimary,
    textAlign: 'center',
    marginBottom: theme.spacing.xs,
  },
  hint: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginBottom: theme.spacing.md,
  },
  page: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.sm,
  },
  card: {
    width: '100%',
    maxWidth: 280,
    paddingVertical: theme.spacing.xl,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: theme.radius.lg,
    borderWidth: 2,
    backgroundColor: theme.colors.surfaceVariant,
    alignItems: 'center',
  },
  emoji: {
    fontSize: 44,
    marginBottom: theme.spacing.sm,
  },
  levelLabel: {
    ...theme.typography.h3,
    color: theme.colors.textPrimary,
    textAlign: 'center',
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: theme.spacing.lg,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  dotActive: {
    backgroundColor: theme.colors.primary,
    width: 22,
  },
  dotIdle: {
    backgroundColor: theme.colors.border,
  },
});
