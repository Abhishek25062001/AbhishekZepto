import { useAdminRealtimeStore } from '../store/admin-realtime.store';
import {
  ADMIN_REALTIME_EVENTS,
  type AdminDeliveryRealtimeEvent,
  type AdminOrderRealtimeEvent,
  type AdminRealtimeEventName,
  type AdminRealtimeSocketPayload,
  type AdminSlaRealtimeEvent,
} from '../types/control-tower-realtime.types';
import { mapAdminRealtimeEventPayload } from './admin-realtime-event.mapper';
import {
  shouldIgnoreAdminDeliveryRealtimeEvent,
  shouldIgnoreAdminOrderRealtimeEvent,
  shouldIgnoreAdminSlaRealtimeEvent,
} from './admin-realtime-stale-event.util';

const isAdminOrderRealtimeEvent = (
  event: ReturnType<typeof mapAdminRealtimeEventPayload>,
): event is AdminOrderRealtimeEvent =>
  event?.eventName === ADMIN_REALTIME_EVENTS.ORDER_CREATED ||
  event?.eventName === ADMIN_REALTIME_EVENTS.ORDER_STATUS_UPDATED ||
  event?.eventName === ADMIN_REALTIME_EVENTS.ORDER_DELAYED ||
  event?.eventName === ADMIN_REALTIME_EVENTS.ORDER_CANCELLED;

const isAdminDeliveryRealtimeEvent = (
  event: ReturnType<typeof mapAdminRealtimeEventPayload>,
): event is AdminDeliveryRealtimeEvent =>
  event?.eventName === ADMIN_REALTIME_EVENTS.DELIVERY_ASSIGNMENT_CREATED ||
  event?.eventName === ADMIN_REALTIME_EVENTS.DELIVERY_STATUS_CHANGED ||
  event?.eventName === ADMIN_REALTIME_EVENTS.DELIVERY_LOCATION_UPDATED ||
  event?.eventName === ADMIN_REALTIME_EVENTS.DELIVERY_PROGRESS_UPDATED ||
  event?.eventName === ADMIN_REALTIME_EVENTS.DELIVERY_FAILED;

const isAdminSlaRealtimeEvent = (
  event: ReturnType<typeof mapAdminRealtimeEventPayload>,
): event is AdminSlaRealtimeEvent =>
  event?.eventName === ADMIN_REALTIME_EVENTS.DELIVERY_SLA_BREACH_CREATED;

export const handleAdminRealtimePayload = (
  payload: AdminRealtimeSocketPayload,
  eventName: AdminRealtimeEventName,
): void => {
  const event = mapAdminRealtimeEventPayload(payload, eventName);
  if (!event) {
    return;
  }

  if (isAdminOrderRealtimeEvent(event)) {
    if (
      shouldIgnoreAdminOrderRealtimeEvent(
        event,
        useAdminRealtimeStore.getState().lastOrderEvent,
      )
    ) {
      return;
    }

    useAdminRealtimeStore.getState().setLastOrderEvent(event);
    return;
  }

  if (isAdminDeliveryRealtimeEvent(event)) {
    if (
      shouldIgnoreAdminDeliveryRealtimeEvent(
        event,
        useAdminRealtimeStore.getState().lastDeliveryEvent,
      )
    ) {
      return;
    }

    useAdminRealtimeStore.getState().setLastDeliveryEvent(event);
    return;
  }

  if (isAdminSlaRealtimeEvent(event)) {
    if (
      shouldIgnoreAdminSlaRealtimeEvent(
        event,
        useAdminRealtimeStore.getState().lastSlaEvent,
      )
    ) {
      return;
    }

    useAdminRealtimeStore.getState().setLastSlaEvent(event);
  }
};
