import { INTERNAL_EVENT_NAMES } from '../../internal-events/constants/internal-event-names.constant';
import {
  subscribeToInternalEvent,
  unsubscribeFromInternalEvent,
} from '../../internal-events/services/internal-event-bus.service';
import type { InternalEventEnvelope } from '../../internal-events/types/internal-event.types';
import * as deliveryTrackingRealtimeEmitterService from '../services/delivery-tracking-realtime-emitter.service';

const toDeliveryTrackingSource = (event: InternalEventEnvelope): Record<string, unknown> => ({
  ...event.payload,
  _id: event.payload.assignmentId,
  updatedAt: event.payload.updatedAt ?? event.metadata.createdAt,
});

const handleDeliveryLocationUpdated = (event: InternalEventEnvelope): void => {
  deliveryTrackingRealtimeEmitterService.emitDeliveryLocationUpdated(
    toDeliveryTrackingSource(event),
  );
};

const handleDeliveryOutForDelivery = (event: InternalEventEnvelope): void => {
  deliveryTrackingRealtimeEmitterService.emitDeliveryProgressUpdated(
    toDeliveryTrackingSource(event),
  );
};

const handleDeliveryReachedCustomer = (event: InternalEventEnvelope): void => {
  deliveryTrackingRealtimeEmitterService.emitRiderReachedCustomer(
    toDeliveryTrackingSource(event),
  );
};

const handleDeliveryCompleted = (event: InternalEventEnvelope): void => {
  deliveryTrackingRealtimeEmitterService.emitOrderDelivered(
    toDeliveryTrackingSource(event),
  );
};

const handleDeliveryFailed = (event: InternalEventEnvelope): void => {
  deliveryTrackingRealtimeEmitterService.emitDeliveryFailed(toDeliveryTrackingSource(event));
};

export const registerDeliveryTrackingRealtimeSubscriber = (): void => {
  subscribeToInternalEvent(
    INTERNAL_EVENT_NAMES.DELIVERY_LOCATION_UPDATED,
    handleDeliveryLocationUpdated,
  );
  subscribeToInternalEvent(
    INTERNAL_EVENT_NAMES.DELIVERY_OUT_FOR_DELIVERY,
    handleDeliveryOutForDelivery,
  );
  subscribeToInternalEvent(
    INTERNAL_EVENT_NAMES.DELIVERY_REACHED_CUSTOMER,
    handleDeliveryReachedCustomer,
  );
  subscribeToInternalEvent(INTERNAL_EVENT_NAMES.DELIVERY_COMPLETED, handleDeliveryCompleted);
  subscribeToInternalEvent(INTERNAL_EVENT_NAMES.DELIVERY_FAILED, handleDeliveryFailed);
};

export const unregisterDeliveryTrackingRealtimeSubscriber = (): void => {
  unsubscribeFromInternalEvent(
    INTERNAL_EVENT_NAMES.DELIVERY_LOCATION_UPDATED,
    handleDeliveryLocationUpdated,
  );
  unsubscribeFromInternalEvent(
    INTERNAL_EVENT_NAMES.DELIVERY_OUT_FOR_DELIVERY,
    handleDeliveryOutForDelivery,
  );
  unsubscribeFromInternalEvent(
    INTERNAL_EVENT_NAMES.DELIVERY_REACHED_CUSTOMER,
    handleDeliveryReachedCustomer,
  );
  unsubscribeFromInternalEvent(INTERNAL_EVENT_NAMES.DELIVERY_COMPLETED, handleDeliveryCompleted);
  unsubscribeFromInternalEvent(INTERNAL_EVENT_NAMES.DELIVERY_FAILED, handleDeliveryFailed);
};
