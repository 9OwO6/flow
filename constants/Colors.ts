import { colors as designColors } from './DesignTokens';

export default {
  light: {
    text: designColors.textPrimary,
    background: designColors.background,
    surface: designColors.surface,
    primary: designColors.primary,
    secondary: designColors.secondary,
    accent: designColors.accent,
    tint: designColors.primary,
    tabIconDefault: designColors.textTertiary,
    tabIconSelected: designColors.primary,
    card: designColors.surface,
    border: designColors.border,
    notification: designColors.primary,
    success: designColors.success,
    warning: designColors.warning,
    error: designColors.error,
    poop: designColors.primary,
    surfaceVariant: designColors.surfaceVariant,
    outline: designColors.border,
    onSurface: designColors.textPrimary,
    onSurfaceVariant: designColors.textSecondary,
  },
  dark: {
    text: '#F7FAFC',
    background: '#1A1D1C',
    surface: '#252928',
    primary: designColors.primary,
    secondary: designColors.secondary,
    accent: designColors.accent,
    tint: designColors.primary,
    tabIconDefault: '#636E72',
    tabIconSelected: designColors.primary,
    card: '#252928',
    border: '#2D3436',
    notification: designColors.primary,
    success: designColors.success,
    warning: designColors.warning,
    error: designColors.error,
    poop: designColors.primary,
    surfaceVariant: '#2D3436',
    outline: '#2D3436',
    onSurface: '#F7FAFC',
    onSurfaceVariant: '#B2BEC3',
  },
};

export const gradients = {
  // 这里的渐变改为非常柔和的 Mesh Gradient 风格
  organic: [designColors.primaryLight, designColors.background],
  fluid: ['#FFFFFF', designColors.primaryLight],
};
