import React from 'react';
import { StyleSheet, View } from 'react-native';

import { Text } from '../../../components/common';
import { colors, radius, spacing } from '../../../theme';
import type { CustomerDeliveryTrackingResponse } from '../../orders/types/order.types';
import { useRealtimeDeliveryTrackingEvents } from '../hooks/useRealtimeDeliveryTrackingEvents';
import { useRealtimeOrderStore } from '../store/realtime-order.store';
import { CUSTOMER_REALTIME_EVENTS } from '../types/realtime-order.types';
import { hasValidRealtimeCoordinates } from '../utils/realtime-delivery-location.util';

type RealtimeDeliveryTrackerProps = {
  orderId: string;
  pollingDelivery: CustomerDeliveryTrackingResponse;
};

export function RealtimeDeliveryTracker({
  orderId,
  pollingDelivery,
}: RealtimeDeliveryTrackerProps) {
  useRealtimeDeliveryTrackingEvents();

  const socketConnected = useRealtimeOrderStore((state) => state.socketConnected);
  const latestRealtimeEvent = useRealtimeOrderStore((state) =>
    [...state.deliveryTrackingEvents]
      .reverse()
      .find((event) => event.orderId === orderId),
  );
  const hasRealtimeLocation = hasValidRealtimeCoordinates(
    latestRealtimeEvent?.currentLatitude ?? null,
    latestRealtimeEvent?.currentLongitude ?? null,
  );
  const lastUpdatedAt =
    latestRealtimeEvent?.lastLocationUpdatedAt ??
    latestRealtimeEvent?.updatedAt ??
    pollingDelivery?.completedAt ??
    pollingDelivery?.deliveredAt ??
    null;
  const progressStatus =
    latestRealtimeEvent?.progressStatus || pollingDelivery?.deliveryStatus || null;
  const isDelivered =
    latestRealtimeEvent?.eventName === CUSTOMER_REALTIME_EVENTS.ORDER_DELIVERED ||
    progressStatus === 'delivered';

  return (
    <View style={styles.card}>
      <Text variant="h3">Live rider location</Text>
      {hasRealtimeLocation && !isDelivered ? (
        <View style={styles.locationRow}>
          <View style={styles.marker} />
          <View style={styles.locationCopy}>
            <Text variant="small">
              {latestRealtimeEvent?.currentLatitude?.toFixed(5)},{' '}
              {latestRealtimeEvent?.currentLongitude?.toFixed(5)}
            </Text>
            <Text color="secondary" variant="small">
              Updated {lastUpdatedAt ? new Date(lastUpdatedAt).toLocaleString() : 'now'}
            </Text>
          </View>
        </View>
      ) : (
        <Text color="secondary" variant="small">
          {socketConnected
            ? 'Waiting for rider location update.'
            : 'Realtime updates unavailable. Polling delivery status.'}
        </Text>
      )}
      {progressStatus ? (
        <Text color="secondary" variant="small">
          Status: {progressStatus.replaceAll('_', ' ')}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radius.lg,
    borderWidth: 1,
    gap: spacing.sm,
    padding: spacing.md,
  },
  locationCopy: {
    flex: 1,
    gap: spacing.xs,
  },
  locationRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
  },
  marker: {
    backgroundColor: colors.primary,
    borderColor: '#ffffff',
    borderRadius: 8,
    borderWidth: 2,
    height: 16,
    width: 16,
  },
});
