import type { AdminSocketConnectionState } from '../types/control-tower-realtime.types';

export const getAdminRealtimeConnectionBannerMessage = (
  connectionState: AdminSocketConnectionState,
  connectionError: string | null,
): string | null => {
  if (connectionState === 'connected' || connectionState === 'idle') {
    return null;
  }

  if (connectionState === 'failed') {
    return connectionError ?? 'Live control tower updates unavailable';
  }

  return 'Reconnecting live control tower...';
};
