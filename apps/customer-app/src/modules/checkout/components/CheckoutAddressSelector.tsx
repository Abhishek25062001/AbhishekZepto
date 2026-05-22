import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { Button, Text } from '../../../components/common';
import { colors, radius, spacing } from '../../../theme';
import type { CustomerAddress } from '../../addresses/types/customer-address.types';

type CheckoutAddressSelectorProps = {
  address: CustomerAddress | null;
  onChangeAddress: () => void;
  onAddAddress: () => void;
};

export function CheckoutAddressSelector({
  address,
  onChangeAddress,
  onAddAddress,
}: CheckoutAddressSelectorProps) {
  if (!address) {
    return (
      <View style={styles.container}>
        <Text variant="h3">Delivery address</Text>
        <Text color="secondary" variant="small">
          Add an address to continue checkout.
        </Text>
        <Button onPress={onAddAddress} title="Add delivery address" variant="secondary" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text variant="h3">Delivery address</Text>
        <Pressable accessibilityRole="button" onPress={onChangeAddress}>
          <Text color="primary" variant="small">
            Change
          </Text>
        </Pressable>
      </View>
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
  container: {
    gap: spacing.sm,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  card: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radius.md,
    borderWidth: 1,
    gap: spacing.xs,
    padding: spacing.md,
  },
});
