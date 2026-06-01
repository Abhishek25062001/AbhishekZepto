import { REALTIME_EVENTS, REALTIME_NAMESPACE } from '../../realtime/constants/realtime-events.constant';
import type { RealtimeEventName } from '../../realtime/constants/realtime-events.constant';
import type { RealtimeEventPayload } from '../../realtime/types/realtime.types';
import {
  ADMIN_OPERATIONS_ROOM,
  buildCityRoom,
} from '../../realtime/utils/realtime-room.util';

type EmitToRoom = typeof import('../../realtime/services/socket-room.service').emitToRoom;

const getEmitToRoom = (): EmitToRoom => {
  // Delay socket server imports so admin-control route tests do not load env config.
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const socketRoomService = require('../../realtime/services/socket-room.service') as typeof import('../../realtime/services/socket-room.service');
  return socketRoomService.emitToRoom;
};

const toEventPayload = (
  eventName: RealtimeEventName,
  roomName: string,
  data: Record<string, unknown>,
): RealtimeEventPayload => ({
  eventName,
  roomName,
  emittedAt: new Date().toISOString(),
  data,
});

const emitAdminControlEvent = (
  eventName: RealtimeEventName,
  data: Record<string, unknown>,
  cityId?: string | null,
): void => {
  try {
    const emitToRoom = getEmitToRoom();

    emitToRoom(
      ADMIN_OPERATIONS_ROOM,
      eventName,
      toEventPayload(eventName, ADMIN_OPERATIONS_ROOM, data),
      REALTIME_NAMESPACE.ADMIN_CONTROL,
    );

    if (cityId) {
      const cityRoom = buildCityRoom(cityId);
      emitToRoom(
        cityRoom,
        eventName,
        toEventPayload(eventName, cityRoom, data),
        REALTIME_NAMESPACE.ADMIN_CONTROL,
      );
    }
  } catch (error) {
    if (error instanceof Error && error.message === 'Socket server has not been initialized') {
      return;
    }

    throw error;
  }
};

export const emitAdminLiveOrderUpdated = (
  data: Record<string, unknown>,
  cityId?: string | null,
): void => {
  emitAdminControlEvent(REALTIME_EVENTS.ADMIN_LIVE_ORDER_UPDATED, data, cityId);
};

export const emitAdminAgentStatusChanged = (
  data: Record<string, unknown>,
  cityId?: string | null,
): void => {
  emitAdminControlEvent(REALTIME_EVENTS.ADMIN_AGENT_STATUS_CHANGED, data, cityId);
};

export const emitAdminStoreOperationalChanged = (
  data: Record<string, unknown>,
  cityId?: string | null,
): void => {
  emitAdminControlEvent(REALTIME_EVENTS.ADMIN_STORE_OPERATIONAL_CHANGED, data, cityId);
};

export const emitAdminSlaEscalationCreated = (
  data: Record<string, unknown>,
  cityId?: string | null,
): void => {
  emitAdminControlEvent(REALTIME_EVENTS.ADMIN_SLA_ESCALATION_CREATED, data, cityId);
};
