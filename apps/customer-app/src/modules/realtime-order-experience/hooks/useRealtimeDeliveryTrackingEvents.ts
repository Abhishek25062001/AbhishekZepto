import { useEffect } from 'react';

import { addSocketListener } from '../services/customer-realtime-socket.service';
import { useRealtimeOrderStore } from '../store/realtime-order.store';
import { CUSTOMER_REALTIME_EVENTS } from '../types/realtime-order.types';
import type {
  CustomerRealtimeEventName,
  DeliveryTrackingRealtimeEvent,
  RealtimeSocketPayload,
} from '../types/realtime-order.types';
import {
  isLocationEventStale,
  mapRealtimeDeliveryTrackingPayload,
} from '../utils/realtime-delivery-location.util';

const DELIVERY_TRACKING_EVENTS: CustomerRealtimeEventName[] = [
  CUSTOMER_REALTIME_EVENTS.DELIVERY_LOCATION_UPDATED,
  CUSTOMER_REALTIME_EVENTS.DELIVERY_PROGRESS_UPDATED,
  CUSTOMER_REALTIME_EVENTS.RIDER_REACHED_CUSTOMER,
  CUSTOMER_REALTIME_EVENTS.DELIVERY_FAILED,
];

const getLatestDeliveryLocationEvent = (
  events: DeliveryTrackingRealtimeEvent[],
  orderId: string,
): DeliveryTrackingRealtimeEvent | null => {
  const matchingEvents = events.filter(
    (event) =>
      event.orderId === orderId &&
      event.eventName === CUSTOMER_REALTIME_EVENTS.DELIVERY_LOCATION_UPDATED,
  );

  return matchingEvents.at(-1) ?? null;
};

export const handleRealtimeDeliveryTrackingPayload = (
  payload: RealtimeSocketPayload,
  eventName: CustomerRealtimeEventName,
): void => {
  const event = mapRealtimeDeliveryTrackingPayload(payload, eventName);
  if (!event) {
    return;
  }

  const latestLocationEvent = getLatestDeliveryLocationEvent(
    useRealtimeOrderStore.getState().deliveryTrackingEvents,
    event.orderId,
  );
  if (
    isLocationEventStale(
      event.lastLocationUpdatedAt,
      latestLocationEvent?.lastLocationUpdatedAt ?? null,
    )
  ) {
    return;
  }

  useRealtimeOrderStore.getState().addDeliveryTrackingEvent(event);
};

export const useRealtimeDeliveryTrackingEvents = (): void => {
  const socketConnected = useRealtimeOrderStore((state) => state.socketConnected);

  useEffect(() => {
    const cleanupListeners = DELIVERY_TRACKING_EVENTS.map((eventName) =>
      addSocketListener(eventName, (payload) => {
        handleRealtimeDeliveryTrackingPayload(payload, eventName);
      }),
    );

    return () => {
      cleanupListeners.forEach((cleanup) => cleanup());
    };
  }, [socketConnected]);
};
