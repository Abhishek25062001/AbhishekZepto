import React from 'react';
import { StyleSheet, TextInput, View } from 'react-native';

import { colors, radius, spacing } from '../../../theme';

type CustomerSearchBarProps = {
  autoFocus?: boolean;
  onChangeText: (value: string) => void;
  onSubmit?: () => void;
  placeholder?: string;
  value: string;
};

export function CustomerSearchBar({
  autoFocus = false,
  onChangeText,
  onSubmit,
  placeholder = 'Search products',
  value,
}: CustomerSearchBarProps) {
  return (
    <View style={styles.container}>
      <TextInput
        autoCapitalize="none"
        autoCorrect={false}
        autoFocus={autoFocus}
        onChangeText={onChangeText}
        onSubmitEditing={onSubmit}
        placeholder={placeholder}
        placeholderTextColor={colors.textSecondary}
        returnKeyType="search"
        style={styles.input}
        value={value}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  input: {
    backgroundColor: colors.background,
    borderColor: colors.border,
    borderRadius: radius.md,
    borderWidth: 1,
    color: colors.textPrimary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
});
