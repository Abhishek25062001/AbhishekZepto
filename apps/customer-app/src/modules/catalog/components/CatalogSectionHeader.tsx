import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { Text } from '../../../components/common';
import { spacing } from '../../../theme';

type CatalogSectionHeaderProps = {
  actionLabel?: string;
  onActionPress?: () => void;
  subtitle?: string;
  title: string;
};

export function CatalogSectionHeader({
  actionLabel,
  onActionPress,
  subtitle,
  title,
}: CatalogSectionHeaderProps) {
  return (
    <View style={styles.header}>
      <View>
        <Text variant="h3">{title}</Text>
        {subtitle ? (
          <Text color="secondary" variant="small">
            {subtitle}
          </Text>
        ) : null}
      </View>
      {actionLabel && onActionPress ? (
        <Pressable onPress={onActionPress}>
          <Text color="secondary" variant="small">
            {actionLabel}
          </Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
    marginTop: spacing.md,
  },
});
