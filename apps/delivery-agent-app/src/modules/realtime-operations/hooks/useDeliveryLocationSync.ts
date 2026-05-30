import { useDeliveryRealtimeStore } from '../store/delivery-realtime.store';

export const useDeliveryLocationSync = () => {
  const socketConnected = useDeliveryRealtimeStore((state) => state.socketConnected);
  const lastLocationAckAt = useDeliveryRealtimeStore(
    (state) => state.lastLocationAckAt,
  );
  const locationSyncPaused = useDeliveryRealtimeStore(
    (state) => state.locationSyncPaused,
  );
  const locationSyncError = useDeliveryRealtimeStore(
    (state) => state.locationSyncError,
  );

  return {
    lastLocationAckAt,
    locationSyncError,
    locationSyncPaused,
    restLocationSyncEnabled: !locationSyncPaused || !socketConnected,
  };
};
