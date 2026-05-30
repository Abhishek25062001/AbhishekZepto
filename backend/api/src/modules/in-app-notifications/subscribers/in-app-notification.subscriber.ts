import { INTERNAL_EVENT_NAMES } from '../../internal-events/constants/internal-event-names.constant';
import {
  subscribeToInternalEvent,
  unsubscribeFromInternalEvent,
} from '../../internal-events/services/internal-event-bus.service';
import type { InternalEventEnvelope } from '../../internal-events/types/internal-event.types';
import { IN_APP_NOTIFICATION_PRIORITY } from '../constants/in-app-notification-priority.constant';
import {
  notifyAdminSlaAlert,
  notifyCustomerOrderUpdate,
  notifyDeliveryAssignment,
  notifyVendorOrderUpdate,
} from '../services/in-app-notification-trigger.service';

let inAppNotificationSubscriberRegistered = false;

const toString = (value: unknown): string | null =>
  typeof value === 'string' && value.trim() ? value.trim() : null;

const notifySafely = async (task: () => Promise<unknown>): Promise<void> => {
  try {
    await task();
  } catch {
    // Notification writes must not block the source business flow.
  }
};

const handleOrderCreated = async (event: InternalEventEnvelope): Promise<void> => {
  const vendorUserId = toString(event.payload.vendorUserId ?? event.payload.storeId);
  const adminUserId = toString(event.payload.adminUserId);

  if (vendorUserId) {
    await notifySafely(() =>
      notifyVendorOrderUpdate(vendorUserId, {
        dataPayload: event.payload,
        message: 'A new store order has been created.',
        title: 'New order',
      }),
    );
  }

  if (adminUserId) {
    await notifySafely(() =>
      notifyAdminSlaAlert(adminUserId, {
        dataPayload: event.payload,
        message: 'A new order is visible in the control tower.',
        priority: IN_APP_NOTIFICATION_PRIORITY.NORMAL,
        title: 'New order',
      }),
    );
  }
};

const handleOutForDelivery = async (event: InternalEventEnvelope): Promise<void> => {
  const customerId = toString(event.payload.customerId);
  if (!customerId) {
    return;
  }

  await notifySafely(() =>
    notifyCustomerOrderUpdate(customerId, {
      dataPayload: event.payload,
      message: 'Your order is out for delivery.',
      title: 'Order out for delivery',
    }),
  );
};

const handleAssignmentCreated = async (event: InternalEventEnvelope): Promise<void> => {
  const deliveryAgentId = toString(event.payload.deliveryAgentId);
  if (!deliveryAgentId) {
    return;
  }

  await notifySafely(() =>
    notifyDeliveryAssignment(deliveryAgentId, {
      dataPayload: event.payload,
      title: 'New delivery assignment',
    }),
  );
};

const handleDeliveryCompleted = async (event: InternalEventEnvelope): Promise<void> => {
  const customerId = toString(event.payload.customerId);
  if (!customerId) {
    return;
  }

  await notifySafely(() =>
    notifyCustomerOrderUpdate(customerId, {
      dataPayload: event.payload,
      message: 'Your order has been delivered.',
      title: 'Order delivered',
    }),
  );
};

const handleDeliveryFailed = async (event: InternalEventEnvelope): Promise<void> => {
  const customerId = toString(event.payload.customerId);
  const supportAdminId = toString(event.payload.supportAdminId ?? event.payload.adminUserId);

  if (customerId) {
    await notifySafely(() =>
      notifyCustomerOrderUpdate(customerId, {
        dataPayload: event.payload,
        message: 'There was a delivery issue with your order.',
        priority: IN_APP_NOTIFICATION_PRIORITY.HIGH,
        title: 'Delivery update',
      }),
    );
  }

  if (supportAdminId) {
    await notifySafely(() =>
      notifyAdminSlaAlert(supportAdminId, {
        dataPayload: event.payload,
        message: 'A delivery failed and may require support review.',
        title: 'Delivery failed',
      }),
    );
  }
};

const handleSlaBreachCreated = async (event: InternalEventEnvelope): Promise<void> => {
  const adminUserId = toString(event.payload.adminUserId);
  if (!adminUserId) {
    return;
  }

  await notifySafely(() =>
    notifyAdminSlaAlert(adminUserId, {
      dataPayload: event.payload,
      title: 'Delivery SLA breach',
    }),
  );
};

export const registerInAppNotificationSubscriber = (): void => {
  if (inAppNotificationSubscriberRegistered) {
    return;
  }

  subscribeToInternalEvent(INTERNAL_EVENT_NAMES.ORDER_CREATED, handleOrderCreated);
  subscribeToInternalEvent(INTERNAL_EVENT_NAMES.ORDER_OUT_FOR_DELIVERY, handleOutForDelivery);
  subscribeToInternalEvent(
    INTERNAL_EVENT_NAMES.DELIVERY_ASSIGNMENT_CREATED,
    handleAssignmentCreated,
  );
  subscribeToInternalEvent(INTERNAL_EVENT_NAMES.DELIVERY_COMPLETED, handleDeliveryCompleted);
  subscribeToInternalEvent(INTERNAL_EVENT_NAMES.DELIVERY_FAILED, handleDeliveryFailed);
  subscribeToInternalEvent(
    INTERNAL_EVENT_NAMES.DELIVERY_SLA_BREACH_CREATED,
    handleSlaBreachCreated,
  );
  inAppNotificationSubscriberRegistered = true;
};

export const unregisterInAppNotificationSubscriber = (): void => {
  unsubscribeFromInternalEvent(INTERNAL_EVENT_NAMES.ORDER_CREATED, handleOrderCreated);
  unsubscribeFromInternalEvent(INTERNAL_EVENT_NAMES.ORDER_OUT_FOR_DELIVERY, handleOutForDelivery);
  unsubscribeFromInternalEvent(
    INTERNAL_EVENT_NAMES.DELIVERY_ASSIGNMENT_CREATED,
    handleAssignmentCreated,
  );
  unsubscribeFromInternalEvent(INTERNAL_EVENT_NAMES.DELIVERY_COMPLETED, handleDeliveryCompleted);
  unsubscribeFromInternalEvent(INTERNAL_EVENT_NAMES.DELIVERY_FAILED, handleDeliveryFailed);
  unsubscribeFromInternalEvent(
    INTERNAL_EVENT_NAMES.DELIVERY_SLA_BREACH_CREATED,
    handleSlaBreachCreated,
  );
  inAppNotificationSubscriberRegistered = false;
};
