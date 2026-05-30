import { INTERNAL_EVENT_NAMES } from '../../internal-events/constants/internal-event-names.constant';
import {
  subscribeToInternalEvent,
  unsubscribeFromInternalEvent,
} from '../../internal-events/services/internal-event-bus.service';
import type { InternalEventEnvelope } from '../../internal-events/types/internal-event.types';
import * as orderRealtimeEmitterService from '../services/order-realtime-emitter.service';

const toOrderRealtimeSource = (event: InternalEventEnvelope): Record<string, unknown> => ({
  ...event.payload,
  _id: event.payload.orderId,
  updatedAt: event.payload.updatedAt ?? event.metadata.createdAt,
});

const handleOrderCreated = (event: InternalEventEnvelope): void => {
  orderRealtimeEmitterService.emitOrderCreated(toOrderRealtimeSource(event));
};

const handleOrderAccepted = (event: InternalEventEnvelope): void => {
  orderRealtimeEmitterService.emitOrderAccepted(toOrderRealtimeSource(event));
};

const handleOrderPacked = (event: InternalEventEnvelope): void => {
  orderRealtimeEmitterService.emitOrderPacked(toOrderRealtimeSource(event));
};

const handleOrderReadyForPickup = (event: InternalEventEnvelope): void => {
  orderRealtimeEmitterService.emitOrderReadyForPickup(toOrderRealtimeSource(event));
};

const handleOrderOutForDelivery = (event: InternalEventEnvelope): void => {
  orderRealtimeEmitterService.emitOrderOutForDelivery(toOrderRealtimeSource(event));
};

const handleOrderCancelled = (event: InternalEventEnvelope): void => {
  orderRealtimeEmitterService.emitOrderCancelled(toOrderRealtimeSource(event));
};

const handleOrderDelivered = (event: InternalEventEnvelope): void => {
  orderRealtimeEmitterService.emitOrderDelivered(toOrderRealtimeSource(event));
};

export const registerOrderRealtimeSubscriber = (): void => {
  subscribeToInternalEvent(INTERNAL_EVENT_NAMES.ORDER_CREATED, handleOrderCreated);
  subscribeToInternalEvent(INTERNAL_EVENT_NAMES.ORDER_ACCEPTED, handleOrderAccepted);
  subscribeToInternalEvent(INTERNAL_EVENT_NAMES.ORDER_PACKED, handleOrderPacked);
  subscribeToInternalEvent(
    INTERNAL_EVENT_NAMES.ORDER_READY_FOR_PICKUP,
    handleOrderReadyForPickup,
  );
  subscribeToInternalEvent(
    INTERNAL_EVENT_NAMES.ORDER_OUT_FOR_DELIVERY,
    handleOrderOutForDelivery,
  );
  subscribeToInternalEvent(INTERNAL_EVENT_NAMES.ORDER_CANCELLED, handleOrderCancelled);
  subscribeToInternalEvent(INTERNAL_EVENT_NAMES.ORDER_DELIVERED, handleOrderDelivered);
};

export const unregisterOrderRealtimeSubscriber = (): void => {
  unsubscribeFromInternalEvent(INTERNAL_EVENT_NAMES.ORDER_CREATED, handleOrderCreated);
  unsubscribeFromInternalEvent(INTERNAL_EVENT_NAMES.ORDER_ACCEPTED, handleOrderAccepted);
  unsubscribeFromInternalEvent(INTERNAL_EVENT_NAMES.ORDER_PACKED, handleOrderPacked);
  unsubscribeFromInternalEvent(
    INTERNAL_EVENT_NAMES.ORDER_READY_FOR_PICKUP,
    handleOrderReadyForPickup,
  );
  unsubscribeFromInternalEvent(
    INTERNAL_EVENT_NAMES.ORDER_OUT_FOR_DELIVERY,
    handleOrderOutForDelivery,
  );
  unsubscribeFromInternalEvent(INTERNAL_EVENT_NAMES.ORDER_CANCELLED, handleOrderCancelled);
  unsubscribeFromInternalEvent(INTERNAL_EVENT_NAMES.ORDER_DELIVERED, handleOrderDelivered);
};
