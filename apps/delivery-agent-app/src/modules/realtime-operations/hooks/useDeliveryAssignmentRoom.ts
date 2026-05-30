import { useEffect } from 'react';

import {
  joinAssignmentRoom,
  leaveAssignmentRoom,
} from '../services/delivery-realtime-socket.service';
import { useDeliveryRealtimeStore } from '../store/delivery-realtime.store';

export const useDeliveryAssignmentRoom = (
  assignmentId: string | null | undefined,
): void => {
  const socketConnected = useDeliveryRealtimeStore((state) => state.socketConnected);
  const addAssignmentRoom = useDeliveryRealtimeStore(
    (state) => state.addAssignmentRoom,
  );
  const removeAssignmentRoom = useDeliveryRealtimeStore(
    (state) => state.removeAssignmentRoom,
  );
  const normalizedAssignmentId = assignmentId?.trim() ?? '';

  useEffect(() => {
    if (!normalizedAssignmentId) {
      return undefined;
    }

    addAssignmentRoom(normalizedAssignmentId);
    return () => {
      removeAssignmentRoom(normalizedAssignmentId);
      leaveAssignmentRoom(normalizedAssignmentId);
    };
  }, [addAssignmentRoom, normalizedAssignmentId, removeAssignmentRoom]);

  useEffect(() => {
    if (!socketConnected || !normalizedAssignmentId) {
      return;
    }

    const activeAssignmentRooms =
      useDeliveryRealtimeStore.getState().activeAssignmentRooms;
    if (activeAssignmentRooms.includes(normalizedAssignmentId)) {
      joinAssignmentRoom(normalizedAssignmentId);
    }
  }, [normalizedAssignmentId, socketConnected]);
};
