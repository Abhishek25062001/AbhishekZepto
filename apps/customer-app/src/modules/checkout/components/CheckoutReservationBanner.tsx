import React from 'react';
import { StyleSheet, View } from 'react-native';

import { Text } from '../../../components/common';
import { colors, radius, spacing } from '../../../theme';
import { useCheckoutReservationTimer } from '../hooks/useCheckoutReservationTimer';

type CheckoutReservationBannerProps = {
  expiresAt: string | null;
  onExpired?: () => void;
};

export function CheckoutReservationBanner({
  expiresAt,
  onExpired,
}: CheckoutReservationBannerProps) {
  const timer = useCheckoutReservationTimer(expiresAt, onExpired);
  const isUrgent = !timer.isExpired && timer.remainingSeconds <= 120;

  return (
    <View style={[styles.banner, timer.isExpired ? styles.expired : isUrgent ? styles.urgent : null]}>
      <Text variant="small">
        {timer.isExpired
          ? 'Your reservation has expired. Please start checkout again.'
          : `Items reserved for ${timer.formatted}`}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    backgroundColor: colors.primaryLight,
    borderRadius: radius.md,
    padding: spacing.md,
  },
  urgent: {
    backgroundColor: '#FFF3E0',
  },
  expired: {
    backgroundColor: '#FFEBEE',
  },
});
