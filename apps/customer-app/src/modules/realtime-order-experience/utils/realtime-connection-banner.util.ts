import type { RealtimeSocketConnectionState } from '../types/realtime-order.types';

export const getRealtimeConnectionBannerMessage = ({
  connectionError,
  connectionState,
  socketConnected,
}: {
  connectionError: string | null;
  connectionState: RealtimeSocketConnectionState;
  socketConnected: boolean;
}): string | null => {
  if (socketConnected || connectionState === 'idle' || connectionState === 'disconnected') {
    return null;
  }

  if (connectionState === 'connecting' || connectionState === 'reconnecting') {
    return 'Connecting...';
  }

  return connectionError ?? 'Realtime updates unavailable';
};
