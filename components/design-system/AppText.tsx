import React from 'react';
import { Text, type TextProps, type TextStyle } from 'react-native';
import theme from '@/constants/DesignTokens';

export type AppTextVariant = 'h1' | 'h2' | 'h3' | 'body' | 'body2' | 'caption' | 'button';

type Props = TextProps & {
  variant?: AppTextVariant;
  color?: 'primary' | 'secondary' | 'tertiary' | 'error' | 'onPrimary';
};

const colorMap: Record<NonNullable<Props['color']>, string> = {
  primary: theme.colors.textPrimary,
  secondary: theme.colors.textSecondary,
  tertiary: theme.colors.textTertiary,
  error: theme.colors.error,
  onPrimary: theme.colors.textOnPrimary,
};

export default function AppText({
  variant = 'body',
  color = 'primary',
  style,
  ...rest
}: Props) {
  const tokenStyle = theme.typography[variant] as TextStyle;
  const colorStyle: TextStyle = { color: colorMap[color] };

  return <Text style={[tokenStyle, colorStyle, style]} {...rest} />;
}
