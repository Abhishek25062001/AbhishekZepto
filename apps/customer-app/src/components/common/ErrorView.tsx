import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, spacing, typography } from '../../theme';

type ErrorViewProps = {
  message: string;
  onRetry?: () => void;
  retryLabel?: string;
  title?: string;
};

export function ErrorView({
  message,
  onRetry,
  retryLabel = 'Retry',
  title = 'Something went wrong',
}: ErrorViewProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
      {onRetry ? (
        <Pressable accessibilityRole="button" onPress={onRetry}>
          <Text style={styles.retry}>{retryLabel}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.md,
    padding: spacing.lg,
  },
  message: {
    color: colors.error,
    fontSize: typography.small,
  },
  retry: {
    color: colors.primary,
    fontSize: typography.small,
    fontWeight: '600',
  },
  title: {
    color: colors.textPrimary,
    fontSize: typography.h3,
    fontWeight: '700',
  },
});
