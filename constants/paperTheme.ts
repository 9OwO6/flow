/**
 * Maps DesignTokens → react-native-paper MD3 theme so Paper surfaces match app chrome.
 */
import { MD3LightTheme } from 'react-native-paper';
import type { MD3Theme } from 'react-native-paper';
import tokens from '@/constants/DesignTokens';

const { colors: c, radius } = tokens;

export const flowPaperLightTheme: MD3Theme = {
  ...MD3LightTheme,
  roundness: radius.sm,
  colors: {
    ...MD3LightTheme.colors,
    primary: c.primary,
    primaryContainer: c.primaryLight,
    secondary: c.secondary,
    secondaryContainer: c.accent,
    tertiary: c.primaryDark,
    tertiaryContainer: c.primaryLight,
    surface: c.surface,
    surfaceVariant: c.surfaceVariant,
    background: c.background,
    error: c.error,
    onPrimary: c.textOnPrimary,
    onPrimaryContainer: c.primaryDark,
    onSecondary: c.textPrimary,
    onSecondaryContainer: c.textPrimary,
    onTertiary: c.textOnPrimary,
    onTertiaryContainer: c.primaryDark,
    onSurface: c.textPrimary,
    onSurfaceVariant: c.textSecondary,
    onBackground: c.textPrimary,
    onError: c.textOnPrimary,
    outline: c.border,
    outlineVariant: c.border,
    inverseSurface: c.textPrimary,
    inverseOnSurface: c.surface,
    inversePrimary: c.primaryLight,
  },
  fonts: MD3LightTheme.fonts,
};
