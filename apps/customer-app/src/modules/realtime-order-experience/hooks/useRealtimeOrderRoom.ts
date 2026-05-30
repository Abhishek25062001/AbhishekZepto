import { useEffect } from 'react';

import {
  getCustomerRealtimeSocket,
  joinOrderRoom as emitJoinOrderRoom,
  leaveOrderRoom as emitLeaveOrderRoom,
} from '../services/customer-realtime-socket.service';
import { useRealtimeOrderStore } from '../store/realtime-order.store';

export const useRealtimeOrderRoom = (orderId: string | null | undefined): void => {
  const joinOrderRoom = useRealtimeOrderStore((state) => state.joinOrderRoom);
  const leaveOrderRoom = useRealtimeOrderStore((state) => state.leaveOrderRoom);
  const socketConnected = useRealtimeOrderStore((state) => state.socketConnected);

  useEffect(() => {
    const normalizedOrderId = orderId?.trim();
    if (!normalizedOrderId) {
      return undefined;
    }

    const alreadyJoined = useRealtimeOrderStore
      .getState()
      .activeOrderRooms.includes(normalizedOrderId);
    if (!alreadyJoined) {
      joinOrderRoom(normalizedOrderId);
    }

    if (socketConnected || getCustomerRealtimeSocket()?.connected) {
      emitJoinOrderRoom(normalizedOrderId);
    }

    return () => {
      leaveOrderRoom(normalizedOrderId);
      emitLeaveOrderRoom(normalizedOrderId);
    };
  }, [joinOrderRoom, leaveOrderRoom, orderId, socketConnected]);
};
