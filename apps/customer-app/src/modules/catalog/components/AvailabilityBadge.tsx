import React from 'react';
import { StyleSheet, View } from 'react-native';

import { Text } from '../../../components/common';
import { colors, radius, spacing } from '../../../theme';

import type { AvailabilityState } from '../utils/availability.util';
import { LowStockHint } from './LowStockHint';

const LABELS: Record<AvailabilityState, string> = {
  available: 'Available',
  out_of_stock: 'Out of stock',
  unavailable: 'Unavailable',
};

type AvailabilityBadgeProps = {
  availableQuantity?: number | null;
  state: AvailabilityState;
};

export function AvailabilityBadge({ availableQuantity, state }: AvailabilityBadgeProps) {
  return (
    <View>
      <View style={[styles.badge, state !== 'available' && styles.badgeWarning]}>
        <Text variant="small">{LABELS[state]}</Text>
      </View>
      {state === 'available' ? <LowStockHint availableQuantity={availableQuantity} /> : null}
    </View>
  );
}

export { getAvailabilityState } from '../utils/availability.util';

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.success,
    borderRadius: radius.sm,
    marginVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
  },
  badgeWarning: {
    backgroundColor: colors.warning,
  },
});
