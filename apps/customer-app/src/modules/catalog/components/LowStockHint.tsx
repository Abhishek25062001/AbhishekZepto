import React from 'react';
import { StyleSheet, View } from 'react-native';

import { Text } from '../../../components/common';
import { spacing } from '../../../theme';
import { getLowStockLabel, isLowStock } from '../utils/availability.util';

type LowStockHintProps = {
  availableQuantity?: number | null;
};

export function LowStockHint({ availableQuantity }: LowStockHintProps) {
  if (!isLowStock(availableQuantity)) {
    return null;
  }

  return (
    <View style={styles.hint}>
      <Text color="secondary" variant="small">
        {getLowStockLabel(availableQuantity!)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  hint: {
    marginTop: spacing.xs,
  },
});
