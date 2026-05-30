import { INTERNAL_EVENT_NAMES } from '../constants/internal-event-names.constant';
import { publishInternalEvent } from '../services/internal-event-bus.service';
import type { InternalEventName } from '../constants/internal-event-names.constant';
import { buildEventMetadata } from '../utils/internal-event-metadata.util';
import { mapOrderInternalEventPayload } from '../utils/internal-event-payload.mapper';

const ORDER_SOURCE_MODULE = 'orders';

const publishOrderEvent = (eventName: InternalEventName, order: unknown): void => {
  publishInternalEvent(
    eventName,
    mapOrderInternalEventPayload(order),
    buildEventMetadata(ORDER_SOURCE_MODULE, { eventName }),
  );
};

export const publishOrderCreated = (order: unknown): void => {
  publishOrderEvent(INTERNAL_EVENT_NAMES.ORDER_CREATED, order);
};

export const publishOrderAccepted = (order: unknown): void => {
  publishOrderEvent(INTERNAL_EVENT_NAMES.ORDER_ACCEPTED, order);
};

export const publishOrderPacked = (order: unknown): void => {
  publishOrderEvent(INTERNAL_EVENT_NAMES.ORDER_PACKED, order);
};

export const publishOrderReadyForPickup = (order: unknown): void => {
  publishOrderEvent(INTERNAL_EVENT_NAMES.ORDER_READY_FOR_PICKUP, order);
};

export const publishOrderOutForDelivery = (order: unknown): void => {
  publishOrderEvent(INTERNAL_EVENT_NAMES.ORDER_OUT_FOR_DELIVERY, order);
};

export const publishOrderCancelled = (order: unknown): void => {
  publishOrderEvent(INTERNAL_EVENT_NAMES.ORDER_CANCELLED, order);
};

export const publishOrderDelivered = (order: unknown): void => {
  publishOrderEvent(INTERNAL_EVENT_NAMES.ORDER_DELIVERED, order);
};
