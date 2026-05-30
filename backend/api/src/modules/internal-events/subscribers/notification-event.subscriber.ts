import * as deliveryNotificationService from '../../delivery/services/delivery-notification.service';
import type { IDeliveryAssignmentDocument } from '../../delivery/types/delivery-assignment.types';
import { INTERNAL_EVENT_NAMES } from '../constants/internal-event-names.constant';
import {
  subscribeToInternalEvent,
  unsubscribeFromInternalEvent,
} from '../services/internal-event-bus.service';
import type { InternalEventEnvelope } from '../types/internal-event.types';

const toNotificationDelivery = (
  event: InternalEventEnvelope,
): IDeliveryAssignmentDocument => {
  const payload = event.payload;

  return {
    _id: payload.assignmentId ?? payload.breachId,
    orderId: payload.orderId,
    customerId: payload.customerId,
    storeId: payload.storeId,
    cityId: payload.cityId,
    deliveryAgentId: payload.deliveryAgentId,
    deliveryStatus:
      payload.assignmentStatus ??
      payload.pickupStatus ??
      payload.progressStatus ??
      payload.completionStatus ??
      payload.breachStatus,
  } as IDeliveryAssignmentDocument;
};

const publishNotificationForEvent =
  (eventType: string) =>
  (event: InternalEventEnvelope): void => {
    deliveryNotificationService.publishDeliveryNotificationPlaceholders(
      toNotificationDelivery(event),
      eventType,
    ).catch((error) => {
      console.warn('Failed to publish internal-event notification placeholder:', error);
    });
  };

const handleAssignmentCreated = publishNotificationForEvent('assigned');
const handlePickupCompleted = publishNotificationForEvent('picked_up');
const handleDeliveryCompleted = publishNotificationForEvent('delivered');
const handleDeliveryFailed = publishNotificationForEvent('failed');
const handleSlaBreachCreated = publishNotificationForEvent('sla_breached');

export const registerNotificationEventSubscriber = (): void => {
  subscribeToInternalEvent(
    INTERNAL_EVENT_NAMES.DELIVERY_ASSIGNMENT_CREATED,
    handleAssignmentCreated,
  );
  subscribeToInternalEvent(
    INTERNAL_EVENT_NAMES.DELIVERY_PICKUP_COMPLETED,
    handlePickupCompleted,
  );
  subscribeToInternalEvent(
    INTERNAL_EVENT_NAMES.DELIVERY_COMPLETED,
    handleDeliveryCompleted,
  );
  subscribeToInternalEvent(
    INTERNAL_EVENT_NAMES.DELIVERY_FAILED,
    handleDeliveryFailed,
  );
  subscribeToInternalEvent(
    INTERNAL_EVENT_NAMES.DELIVERY_SLA_BREACH_CREATED,
    handleSlaBreachCreated,
  );
};

export const unregisterNotificationEventSubscriber = (): void => {
  unsubscribeFromInternalEvent(
    INTERNAL_EVENT_NAMES.DELIVERY_ASSIGNMENT_CREATED,
    handleAssignmentCreated,
  );
  unsubscribeFromInternalEvent(
    INTERNAL_EVENT_NAMES.DELIVERY_PICKUP_COMPLETED,
    handlePickupCompleted,
  );
  unsubscribeFromInternalEvent(
    INTERNAL_EVENT_NAMES.DELIVERY_COMPLETED,
    handleDeliveryCompleted,
  );
  unsubscribeFromInternalEvent(
    INTERNAL_EVENT_NAMES.DELIVERY_FAILED,
    handleDeliveryFailed,
  );
  unsubscribeFromInternalEvent(
    INTERNAL_EVENT_NAMES.DELIVERY_SLA_BREACH_CREATED,
    handleSlaBreachCreated,
  );
};
