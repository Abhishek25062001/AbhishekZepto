import React, { type PropsWithChildren } from 'react';
import { StyleSheet, Text as RNText, type TextStyle } from 'react-native';

import { colors, typography } from '../../theme';

type TextVariant = 'h1' | 'h2' | 'h3' | 'body' | 'small' | 'caption';
type TextColor = 'primary' | 'secondary' | 'disabled' | 'success' | 'warning' | 'error';

type TextProps = PropsWithChildren<{
  color?: TextColor;
  variant?: TextVariant;
}>;

export function Text({ children, color = 'primary', variant = 'body' }: TextProps) {
  return <RNText style={[variantStyles[variant], colorStyles[color]]}>{children}</RNText>;
}

const variantStyles = StyleSheet.create<Record<TextVariant, TextStyle>>({
  body: {
    fontSize: typography.body,
  },
  caption: {
    fontSize: typography.caption,
  },
  h1: {
    fontSize: typography.h1,
    fontWeight: '700',
  },
  h2: {
    fontSize: typography.h2,
    fontWeight: '700',
  },
  h3: {
    fontSize: typography.h3,
    fontWeight: '700',
  },
  small: {
    fontSize: typography.small,
  },
});

const colorStyles = StyleSheet.create<Record<TextColor, TextStyle>>({
  disabled: {
    color: colors.textDisabled,
  },
  error: {
    color: colors.error,
  },
  primary: {
    color: colors.textPrimary,
  },
  secondary: {
    color: colors.textSecondary,
  },
  success: {
    color: colors.success,
  },
  warning: {
    color: colors.warning,
  },
});
