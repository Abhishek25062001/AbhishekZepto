import { INTERNAL_EVENT_NAMES } from '../../internal-events/constants/internal-event-names.constant';
import {
  subscribeToInternalEvent,
  unsubscribeFromInternalEvent,
} from '../../internal-events/services/internal-event-bus.service';
import type { InternalEventEnvelope } from '../../internal-events/types/internal-event.types';
import {
  sendAssignmentCreatedPush,
  sendDeliveryFailedPush,
  sendOrderDeliveredPush,
  sendOrderOutForDeliveryPush,
} from '../services/delivery-push-notification.service';

let pushNotificationSubscriberRegistered = false;

const toString = (value: unknown): string | null =>
  typeof value === 'string' && value.trim() ? value.trim() : null;

const handleAssignmentCreated = async (
  event: InternalEventEnvelope,
): Promise<void> => {
  const deliveryAgentId = toString(event.payload.deliveryAgentId);
  if (!deliveryAgentId) {
    return;
  }

  await sendAssignmentCreatedPush(deliveryAgentId, event.payload);
};

const handleOutForDelivery = async (
  event: InternalEventEnvelope,
): Promise<void> => {
  const customerId = toString(event.payload.customerId);
  if (!customerId) {
    return;
  }

  await sendOrderOutForDeliveryPush(customerId, event.payload);
};

const handleDeliveryCompleted = async (
  event: InternalEventEnvelope,
): Promise<void> => {
  const customerId = toString(event.payload.customerId);
  if (!customerId) {
    return;
  }

  await sendOrderDeliveredPush(customerId, event.payload);
};

const handleDeliveryFailed = async (
  event: InternalEventEnvelope,
): Promise<void> => {
  const customerId = toString(event.payload.customerId);
  if (!customerId) {
    return;
  }

  await sendDeliveryFailedPush(customerId, event.payload);
};

export const registerPushNotificationSubscriber = (): void => {
  if (pushNotificationSubscriberRegistered) {
    return;
  }

  subscribeToInternalEvent(
    INTERNAL_EVENT_NAMES.DELIVERY_ASSIGNMENT_CREATED,
    handleAssignmentCreated,
  );
  subscribeToInternalEvent(
    INTERNAL_EVENT_NAMES.DELIVERY_OUT_FOR_DELIVERY,
    handleOutForDelivery,
  );
  subscribeToInternalEvent(
    INTERNAL_EVENT_NAMES.DELIVERY_COMPLETED,
    handleDeliveryCompleted,
  );
  subscribeToInternalEvent(
    INTERNAL_EVENT_NAMES.DELIVERY_FAILED,
    handleDeliveryFailed,
  );
  pushNotificationSubscriberRegistered = true;
};

export const unregisterPushNotificationSubscriber = (): void => {
  unsubscribeFromInternalEvent(
    INTERNAL_EVENT_NAMES.DELIVERY_ASSIGNMENT_CREATED,
    handleAssignmentCreated,
  );
  unsubscribeFromInternalEvent(
    INTERNAL_EVENT_NAMES.DELIVERY_OUT_FOR_DELIVERY,
    handleOutForDelivery,
  );
  unsubscribeFromInternalEvent(
    INTERNAL_EVENT_NAMES.DELIVERY_COMPLETED,
    handleDeliveryCompleted,
  );
  unsubscribeFromInternalEvent(
    INTERNAL_EVENT_NAMES.DELIVERY_FAILED,
    handleDeliveryFailed,
  );
  pushNotificationSubscriberRegistered = false;
};
