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

/** Fill color for smooth-level indicators (no emoji). */
export function smoothLevelFill(level: SmoothLevel): string {
  switch (level) {
    case SmoothLevel.VERY_DIFFICULT:
      return theme.colors.smoothLevel.veryDifficult;
    case SmoothLevel.DIFFICULT:
      return theme.colors.smoothLevel.difficult;
    case SmoothLevel.NORMAL:
      return theme.colors.smoothLevel.normal;
    case SmoothLevel.SMOOTH:
      return theme.colors.smoothLevel.smooth;
    case SmoothLevel.VERY_SMOOTH:
      return theme.colors.smoothLevel.verySmooth;
    default:
      return theme.colors.smoothLevel.normal;
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
    color: theme.colors.textPrimary,
    textAlign: 'center',
    marginBottom: theme.spacing.xs,
  },
  hint: {
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
  levelDot: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginBottom: theme.spacing.sm,
  },
  levelLabel: {
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
