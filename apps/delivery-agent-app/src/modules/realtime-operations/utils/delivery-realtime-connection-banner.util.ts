import type { DeliverySocketConnectionState } from '../types/delivery-realtime.types';

export const getDeliveryRealtimeConnectionBannerMessage = (
  connectionState: DeliverySocketConnectionState,
  connectionError: string | null,
): string | null => {
  if (connectionState === 'connected' || connectionState === 'idle') {
    return null;
  }

  if (connectionState === 'failed') {
    return connectionError ?? 'Live updates unavailable';
  }

  return 'Reconnecting live updates...';
};

