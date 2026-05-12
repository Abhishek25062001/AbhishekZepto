import React from 'react';
import { StyleSheet, Text, TextInput, View, type KeyboardTypeOptions } from 'react-native';

import { colors, radius, spacing, typography } from '../../theme';

type InputProps = {
  accessibilityLabel?: string;
  disabled?: boolean;
  error?: string;
  keyboardType?: KeyboardTypeOptions;
  label: string;
  onChangeText: (value: string) => void;
  placeholder?: string;
  secureTextEntry?: boolean;
  value: string;
};

export function Input({
  accessibilityLabel,
  disabled = false,
  error,
  keyboardType,
  label,
  onChangeText,
  placeholder,
  secureTextEntry = false,
  value,
}: InputProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        accessibilityLabel={accessibilityLabel ?? label}
        accessibilityState={{ disabled }}
        editable={!disabled}
        keyboardType={keyboardType}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textDisabled}
        secureTextEntry={secureTextEntry}
        style={[styles.input, error ? styles.inputError : null, disabled && styles.inputDisabled]}
        value={value}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.xs,
  },
  error: {
    color: colors.error,
    fontSize: typography.caption,
  },
  input: {
    borderColor: colors.border,
    borderRadius: radius.md,
    borderWidth: 1,
    color: colors.textPrimary,
    fontSize: typography.body,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  inputDisabled: {
    backgroundColor: colors.background,
    color: colors.textDisabled,
  },
  inputError: {
    borderColor: colors.error,
  },
  label: {
    color: colors.textPrimary,
    fontSize: typography.small,
    fontWeight: '600',
  },
});
