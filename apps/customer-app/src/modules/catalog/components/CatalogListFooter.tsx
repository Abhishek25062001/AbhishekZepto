import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native';

import { Text } from '../../../components/common';
import { colors, spacing } from '../../../theme';

type CatalogListFooterProps = {
  errorMessage?: string | null;
  hasItems?: boolean;
  hasNextPage?: boolean;
  isLoadingMore?: boolean;
  onRetry?: () => void;
};

export function CatalogListFooter({
  errorMessage,
  hasItems = false,
  hasNextPage = false,
  isLoadingMore = false,
  onRetry,
}: CatalogListFooterProps) {
  if (errorMessage) {
    return (
      <View style={styles.container}>
        <Text color="secondary" variant="small">
          {errorMessage}
        </Text>
        {onRetry ? (
          <Pressable onPress={onRetry}>
            <Text variant="small">Try again</Text>
          </Pressable>
        ) : null}
      </View>
    );
  }

  if (isLoadingMore) {
    return (
      <View style={styles.container}>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  if (hasItems && !hasNextPage) {
    return (
      <View style={styles.container}>
        <Text color="secondary" variant="small">
          No more products
        </Text>
      </View>
    );
  }

  return null;
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
});
