import * as realtimeEmitterService from '../../realtime/services/realtime-emitter.service';
import type { IDeliveryAssignmentDocument } from '../../delivery/types/delivery-assignment.types';
import { INTERNAL_EVENT_NAMES } from '../constants/internal-event-names.constant';
import {
  subscribeToInternalEvent,
  unsubscribeFromInternalEvent,
} from '../services/internal-event-bus.service';
import type { InternalEventEnvelope } from '../types/internal-event.types';

const toDateOrNull = (value: unknown): Date | null => {
  if (value instanceof Date) {
    return value;
  }

  if (typeof value === 'string' && value.trim()) {
    return new Date(value);
  }

  return null;
};

const toDeliveryAssignmentLike = (
  event: InternalEventEnvelope,
): IDeliveryAssignmentDocument => {
  const payload = event.payload;
  const assignmentId = payload.assignmentId ?? payload.breachId;

  return {
    _id: assignmentId,
    orderId: payload.orderId,
    customerId: payload.customerId,
    storeId: payload.storeId,
    cityId: payload.cityId,
    deliveryAgentId: payload.deliveryAgentId,
    deliveryStatus:
      payload.assignmentStatus ??
      payload.pickupStatus ??
      payload.progressStatus ??
      payload.completionStatus,
    assignedAt: toDateOrNull(payload.assignedAt),
    arrivedAtStoreAt: toDateOrNull(payload.arrivedAtStoreAt),
    pickedUpAt: toDateOrNull(payload.pickedUpAt),
    enRouteToCustomerAt: toDateOrNull(payload.enRouteToCustomerAt),
    arrivedAtCustomerAt: toDateOrNull(payload.arrivedAtCustomerAt),
    completedAt: toDateOrNull(payload.completedAt),
    deliveredAt: toDateOrNull(payload.completedAt),
    failedAt: toDateOrNull(payload.failedAt),
    slaStatus: payload.breachStatus,
    slaBreachedStage: payload.slaType,
    slaBreachedAt: toDateOrNull(payload.slaBreachedAt),
    updatedAt: new Date(event.metadata.createdAt),
  } as IDeliveryAssignmentDocument;
};

const handleAssignmentCreated = (event: InternalEventEnvelope): void => {
  realtimeEmitterService.emitAssignmentCreated(toDeliveryAssignmentLike(event));
};

const handlePickupCompleted = (event: InternalEventEnvelope): void => {
  realtimeEmitterService.emitPickupCompleted(toDeliveryAssignmentLike(event));
};

const handleDeliveryLocationUpdated = (event: InternalEventEnvelope): void => {
  realtimeEmitterService.emitDeliveryLocationUpdated(toDeliveryAssignmentLike(event));
};

const handleDeliveryCompleted = (event: InternalEventEnvelope): void => {
  realtimeEmitterService.emitDeliveryCompleted(toDeliveryAssignmentLike(event));
};

const handleSlaBreachCreated = (event: InternalEventEnvelope): void => {
  realtimeEmitterService.emitSlaBreachCreated(toDeliveryAssignmentLike(event));
};

export const registerRealtimeEventSubscriber = (): void => {
  subscribeToInternalEvent(
    INTERNAL_EVENT_NAMES.DELIVERY_ASSIGNMENT_CREATED,
    handleAssignmentCreated,
  );
  subscribeToInternalEvent(
    INTERNAL_EVENT_NAMES.DELIVERY_PICKUP_COMPLETED,
    handlePickupCompleted,
  );
  subscribeToInternalEvent(
    INTERNAL_EVENT_NAMES.DELIVERY_LOCATION_UPDATED,
    handleDeliveryLocationUpdated,
  );
  subscribeToInternalEvent(
    INTERNAL_EVENT_NAMES.DELIVERY_COMPLETED,
    handleDeliveryCompleted,
  );
  subscribeToInternalEvent(
    INTERNAL_EVENT_NAMES.DELIVERY_SLA_BREACH_CREATED,
    handleSlaBreachCreated,
  );
};

export const unregisterRealtimeEventSubscriber = (): void => {
  unsubscribeFromInternalEvent(
    INTERNAL_EVENT_NAMES.DELIVERY_ASSIGNMENT_CREATED,
    handleAssignmentCreated,
  );
  unsubscribeFromInternalEvent(
    INTERNAL_EVENT_NAMES.DELIVERY_PICKUP_COMPLETED,
    handlePickupCompleted,
  );
  unsubscribeFromInternalEvent(
    INTERNAL_EVENT_NAMES.DELIVERY_LOCATION_UPDATED,
    handleDeliveryLocationUpdated,
  );
  unsubscribeFromInternalEvent(
    INTERNAL_EVENT_NAMES.DELIVERY_COMPLETED,
    handleDeliveryCompleted,
  );
  unsubscribeFromInternalEvent(
    INTERNAL_EVENT_NAMES.DELIVERY_SLA_BREACH_CREATED,
    handleSlaBreachCreated,
  );
};
