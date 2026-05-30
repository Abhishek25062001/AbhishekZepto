import React from 'react';
import { StyleSheet, View } from 'react-native';

import { Text } from '../../../components/common';
import { colors, radius, spacing } from '../../../theme';
import { useRealtimeOrderStore } from '../store/realtime-order.store';
import { getRealtimeConnectionBannerMessage } from '../utils/realtime-connection-banner.util';

export function RealtimeConnectionBanner() {
  const connectionState = useRealtimeOrderStore((state) => state.connectionState);
  const connectionError = useRealtimeOrderStore((state) => state.connectionError);
  const socketConnected = useRealtimeOrderStore((state) => state.socketConnected);

  const message = getRealtimeConnectionBannerMessage({
    connectionError,
    connectionState,
    socketConnected,
  });

  if (!message) {
    return null;
  }

  return (
    <View style={styles.banner}>
      <Text color="secondary" variant="small">
        {message}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radius.md,
    borderWidth: 1,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
});
