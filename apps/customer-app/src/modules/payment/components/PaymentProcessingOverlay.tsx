import React from 'react';
import { Modal, StyleSheet, View } from 'react-native';

import { Loader, Text } from '../../../components/common';
import { colors, spacing } from '../../../theme';

type PaymentProcessingOverlayProps = {
  visible: boolean;
};

export function PaymentProcessingOverlay({ visible }: PaymentProcessingOverlayProps) {
  return (
    <Modal animationType="fade" transparent visible={visible}>
      <View style={styles.backdrop}>
        <View style={styles.card}>
          <Loader />
          <Text variant="body">Processing payment…</Text>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.45)',
    flex: 1,
    justifyContent: 'center',
    padding: spacing.lg,
  },
  card: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 12,
    gap: spacing.md,
    minWidth: 200,
    padding: spacing.lg,
  },
});
