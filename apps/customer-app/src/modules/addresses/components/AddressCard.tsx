import React from 'react';
import { StyleSheet, View } from 'react-native';

import { Button, Text } from '../../../components/common';
import { colors, radius, spacing } from '../../../theme';
import type { CustomerAddress } from '../types/customer-address.types';

type AddressCardProps = {
  address: CustomerAddress;
  onEdit: (address: CustomerAddress) => void;
  onDelete: (address: CustomerAddress) => void;
  onSetDefault: (address: CustomerAddress) => void;
  onSelect: (address: CustomerAddress) => void;
};

export function AddressCard({
  address,
  onDelete,
  onEdit,
  onSelect,
  onSetDefault,
}: AddressCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text variant="h3">{address.label}</Text>
        {address.isDefault ? <Text variant="small">Default</Text> : null}
      </View>
      <Text color="secondary" variant="body">
        {address.line1}
        {address.line2 ? `, ${address.line2}` : ''}
      </Text>
      <Text color="secondary" variant="small">
        {address.city} · {address.latitude.toFixed(4)}, {address.longitude.toFixed(4)}
      </Text>
      <View style={styles.actions}>
        <Button onPress={() => onSelect(address)} title="Use for delivery" variant="primary" />
        {!address.isDefault ? (
          <Button onPress={() => onSetDefault(address)} title="Set default" variant="secondary" />
        ) : null}
        <Button onPress={() => onEdit(address)} title="Edit" variant="ghost" />
        <Button onPress={() => onDelete(address)} title="Delete" variant="ghost" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderColor: colors.border,
    borderRadius: radius.md,
    borderWidth: 1,
    gap: spacing.sm,
    marginBottom: spacing.md,
    padding: spacing.md,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actions: {
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
});
