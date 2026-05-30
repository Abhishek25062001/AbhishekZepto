import { useEffect } from 'react';

import {
  joinOrderRoom,
  leaveOrderRoom,
} from '../services/vendor-realtime-socket.service';
import { useVendorRealtimeStore } from '../store/vendor-realtime.store';

export const useVendorOrderRoom = (orderId: string | null | undefined): void => {
  const socketConnected = useVendorRealtimeStore((state) => state.socketConnected);
  const addOrderRoom = useVendorRealtimeStore((state) => state.addOrderRoom);
  const removeOrderRoom = useVendorRealtimeStore((state) => state.removeOrderRoom);

  useEffect(() => {
    const normalizedOrderId = orderId?.trim();
    if (!normalizedOrderId) {
      return undefined;
    }

    addOrderRoom(normalizedOrderId);

    return () => {
      leaveOrderRoom(normalizedOrderId);
      removeOrderRoom(normalizedOrderId);
    };
  }, [addOrderRoom, orderId, removeOrderRoom]);

  useEffect(() => {
    const normalizedOrderId = orderId?.trim();
    if (!socketConnected || !normalizedOrderId) {
      return;
    }

    joinOrderRoom(normalizedOrderId);
  }, [orderId, socketConnected]);
};

