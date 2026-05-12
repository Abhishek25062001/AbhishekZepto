import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  type GestureResponderEvent,
  type ViewStyle,
} from 'react-native';

import { colors, radius, spacing, typography } from '../../theme';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

type ButtonProps = {
  accessibilityLabel?: string;
  disabled?: boolean;
  loading?: boolean;
  onPress?: (event: GestureResponderEvent) => void;
  size?: ButtonSize;
  title: string;
  variant?: ButtonVariant;
};

export function Button({
  accessibilityLabel,
  disabled = false,
  loading = false,
  onPress,
  size = 'md',
  title,
  variant = 'primary',
}: ButtonProps) {
  const isDisabled = disabled || loading;
  const textColor = getTextColor(variant, isDisabled);

  return (
    <Pressable
      accessibilityLabel={accessibilityLabel ?? title}
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled }}
      disabled={isDisabled}
      onPress={onPress}
      style={[
        styles.button,
        sizeStyles[size],
        variantStyles[variant],
        isDisabled && styles.buttonDisabled,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={textColor} />
      ) : (
        <Text style={[styles.title, { color: textColor }]}>{title}</Text>
      )}
    </Pressable>
  );
}

function getTextColor(variant: ButtonVariant, isDisabled: boolean) {
  if (isDisabled) {
    return colors.textDisabled;
  }

  if (variant === 'outline' || variant === 'ghost' || variant === 'secondary') {
    return colors.primary;
  }

  return colors.surface;
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    borderRadius: radius.md,
    borderWidth: 1,
    minHeight: 44,
    justifyContent: 'center',
  },
  buttonDisabled: {
    backgroundColor: colors.border,
    borderColor: colors.border,
  },
  title: {
    fontSize: typography.body,
    fontWeight: '600',
  },
});

const sizeStyles = StyleSheet.create<Record<ButtonSize, ViewStyle>>({
  sm: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  md: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  lg: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
  },
});

const variantStyles = StyleSheet.create<Record<ButtonVariant, ViewStyle>>({
  danger: {
    backgroundColor: colors.error,
    borderColor: colors.error,
  },
  ghost: {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
  },
  outline: {
    backgroundColor: 'transparent',
    borderColor: colors.primary,
  },
  primary: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  secondary: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.primaryLight,
  },
});
