import { useEffect } from 'react';

import {
  joinCityRoom,
  leaveCityRoom,
} from '../services/admin-realtime-socket.service';
import { useAdminRealtimeStore } from '../store/admin-realtime.store';

export const useAdminCityRoom = (cityId: string | undefined | null): void => {
  const socketConnected = useAdminRealtimeStore((state) => state.socketConnected);
  const trimmedCityId = cityId?.trim();

  useEffect(() => {
    if (!trimmedCityId) {
      return undefined;
    }

    const alreadyJoined = useAdminRealtimeStore
      .getState()
      .activeCityRooms.includes(trimmedCityId);

    if (!alreadyJoined) {
      useAdminRealtimeStore.getState().addCityRoom(trimmedCityId);
    }

    return () => {
      leaveCityRoom(trimmedCityId);
      useAdminRealtimeStore.getState().removeCityRoom(trimmedCityId);
    };
  }, [trimmedCityId]);

  useEffect(() => {
    if (!socketConnected || !trimmedCityId) {
      return;
    }

    joinCityRoom(trimmedCityId);
  }, [socketConnected, trimmedCityId]);
};
