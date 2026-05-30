import React from 'react';
import { StyleSheet, Text as RNText, View } from 'react-native';

import { useDeliveryRealtimeStore } from '../store/delivery-realtime.store';
import { getDeliveryRealtimeConnectionBannerMessage } from '../utils/delivery-realtime-connection-banner.util';

export function DeliveryRealtimeConnectionBanner() {
  const connectionState = useDeliveryRealtimeStore((state) => state.connectionState);
  const connectionError = useDeliveryRealtimeStore((state) => state.connectionError);

  const message = getDeliveryRealtimeConnectionBannerMessage(
    connectionState,
    connectionError,
  );

  if (!message) {
    return null;
  }

  const isFailure = connectionState === 'failed';

  return (
    <View style={[styles.banner, isFailure ? styles.failure : styles.reconnecting]}>
      <RNText style={styles.message}>{message}</RNText>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  failure: {
    backgroundColor: 'rgba(220, 38, 38, 0.14)',
    borderColor: 'rgba(220, 38, 38, 0.5)',
  },
  message: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
  },
  reconnecting: {
    backgroundColor: 'rgba(245, 158, 11, 0.16)',
    borderColor: 'rgba(245, 158, 11, 0.55)',
  },
});
