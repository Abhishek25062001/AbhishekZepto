import type { VendorSocketConnectionState } from '../types/vendor-realtime.types';

export const getVendorRealtimeConnectionBannerMessage = (
  connectionState: VendorSocketConnectionState,
  connectionError: string | null,
): string | null => {
  if (connectionState === 'connected' || connectionState === 'idle') {
    return null;
  }

  if (connectionState === 'failed') {
    return connectionError ?? 'Live store updates unavailable';
  }

  return 'Reconnecting live store updates...';
};

