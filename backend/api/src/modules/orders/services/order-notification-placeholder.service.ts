import type { Types } from 'mongoose';
import {
  ORDER_NOTIFICATION_EVENTS,
  ORDER_NOTIFICATION_PLACEHOLDER_STATUS,
  ORDER_NOTIFICATION_RECIPIENT_TYPES,
  type OrderNotificationEvent,
} from '../constants/order-notification-events.constant';
import { createOrderNotificationPlaceholders } from '../repositories/order-notification-placeholder.repository';
import type {
  OrderNotificationPlaceholderPayload,
  OrderNotificationPlaceholderRecord,
} from '../types/order-notification.types';
import type { OrderRecord, OrderTimelineEvent } from '../types/order.types';

type NotificationOrder = Pick<OrderRecord, 'customerId' | 'orderNumber' | 'storeId'> & {
  _id: Types.ObjectId;
};

export type PublishOrderNotificationPlaceholderInput = {
  event: OrderNotificationEvent;
  metadata?: Record<string, unknown>;
  order: NotificationOrder;
  timelineEvent?: Pick<OrderTimelineEvent, 'actorId' | 'actorType' | 'reason'> | null;
};

const EVENT_MESSAGES: Record<OrderNotificationEvent, { body: string; title: string }> = {
  [ORDER_NOTIFICATION_EVENTS.CANCELLED]: {
    body: 'Order operation cancellation was recorded.',
    title: 'Order cancelled',
  },
  [ORDER_NOTIFICATION_EVENTS.ITEM_MISSING]: {
    body: 'A missing item was recorded while picking the order.',
    title: 'Order item missing',
  },
  [ORDER_NOTIFICATION_EVENTS.PACKING_COMPLETED]: {
    body: 'Packing was completed for the order.',
    title: 'Packing complete',
  },
  [ORDER_NOTIFICATION_EVENTS.PACKING_STARTED]: {
    body: 'Packing started for the order.',
    title: 'Packing started',
  },
  [ORDER_NOTIFICATION_EVENTS.PICKING_COMPLETED]: {
    body: 'Picking was completed for the order.',
    title: 'Picking complete',
  },
  [ORDER_NOTIFICATION_EVENTS.PICKING_STARTED]: {
    body: 'Picking started for the order.',
    title: 'Picking started',
  },
  [ORDER_NOTIFICATION_EVENTS.READY_FOR_PICKUP]: {
    body: 'The order is ready for pickup.',
    title: 'Ready for pickup',
  },
  [ORDER_NOTIFICATION_EVENTS.STORE_ACCEPTED]: {
    body: 'The store accepted the order.',
    title: 'Order accepted',
  },
  [ORDER_NOTIFICATION_EVENTS.STORE_REJECTED]: {
    body: 'The store rejected the order.',
    title: 'Order rejected',
  },
  [ORDER_NOTIFICATION_EVENTS.ASSIGNED]: {
    body: 'Order has been assigned to a delivery partner.',
    title: 'Order Assigned',
  },
  [ORDER_NOTIFICATION_EVENTS.PICKED_UP]: {
    body: 'Order has been picked up by the delivery partner.',
    title: 'Order Picked Up',
  },
  [ORDER_NOTIFICATION_EVENTS.DELIVERED]: {
    body: 'Order has been delivered successfully.',
    title: 'Order Delivered',
  },
};

const buildBaseMetadata = ({
  metadata,
  order,
  timelineEvent,
}: PublishOrderNotificationPlaceholderInput): Record<string, unknown> => ({
  actorType: timelineEvent?.actorType ?? 'system',
  orderNumber: order.orderNumber,
  reason: timelineEvent?.reason ?? null,
  ...metadata,
});

const buildPlaceholderPayloads = (
  input: PublishOrderNotificationPlaceholderInput,
): OrderNotificationPlaceholderPayload[] => {
  const message = EVENT_MESSAGES[input.event];
  const metadata = buildBaseMetadata(input);

  return [
    {
      body: message.body,
      customerId: input.order.customerId,
      event: input.event,
      metadata,
      orderId: input.order._id,
      recipient: {
        recipientId: input.order.customerId,
        recipientType: ORDER_NOTIFICATION_RECIPIENT_TYPES.CUSTOMER,
      },
      status: ORDER_NOTIFICATION_PLACEHOLDER_STATUS.QUEUED_PLACEHOLDER,
      storeId: input.order.storeId,
      title: message.title,
    },
    {
      body: message.body,
      customerId: input.order.customerId,
      event: input.event,
      metadata,
      orderId: input.order._id,
      recipient: {
        recipientId: input.order.storeId,
        recipientType: ORDER_NOTIFICATION_RECIPIENT_TYPES.VENDOR,
      },
      status: ORDER_NOTIFICATION_PLACEHOLDER_STATUS.QUEUED_PLACEHOLDER,
      storeId: input.order.storeId,
      title: message.title,
    },
    {
      body: message.body,
      customerId: input.order.customerId,
      event: input.event,
      metadata,
      orderId: input.order._id,
      recipient: {
        recipientId: null,
        recipientType: ORDER_NOTIFICATION_RECIPIENT_TYPES.ADMIN,
      },
      status: ORDER_NOTIFICATION_PLACEHOLDER_STATUS.QUEUED_PLACEHOLDER,
      storeId: input.order.storeId,
      title: message.title,
    },
  ];
};

export const publishOrderNotificationPlaceholders = async (
  input: PublishOrderNotificationPlaceholderInput,
): Promise<OrderNotificationPlaceholderRecord[]> => {
  const payloads = buildPlaceholderPayloads(input);
  return createOrderNotificationPlaceholders(payloads);
};
