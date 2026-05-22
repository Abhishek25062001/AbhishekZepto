import React from 'react';
import { StyleSheet, View } from 'react-native';

import { Text } from '../../../components/common';
import { colors, radius, spacing } from '../../../theme';
import type { OrderAddressSnapshot as OrderAddressSnapshotType } from '../types/order.types';

type OrderAddressSnapshotProps = {
  address: OrderAddressSnapshotType;
};

export function OrderAddressSnapshot({ address }: OrderAddressSnapshotProps) {
  return (
    <View style={styles.container}>
      <Text variant="h3">Delivery address</Text>
      <View style={styles.card}>
        <Text variant="small">{address.label}</Text>
        <Text color="secondary" variant="small">
          {address.line1}
          {address.line2 ? `, ${address.line2}` : ''}
        </Text>
        <Text color="secondary" variant="small">
          {address.city}
          {address.postalCode ? ` — ${address.postalCode}` : ''}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radius.md,
    borderWidth: 1,
    gap: spacing.xs,
    padding: spacing.md,
  },
  container: {
    gap: spacing.sm,
  },
});
