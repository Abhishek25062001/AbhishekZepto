import type { Types } from 'mongoose';
import type {
  OrderNotificationEvent,
  OrderNotificationPlaceholderStatus,
  OrderNotificationRecipientType,
} from '../constants/order-notification-events.constant';

export type OrderNotificationPlaceholderRecipient = {
  recipientId: Types.ObjectId | null;
  recipientType: OrderNotificationRecipientType;
};

export type OrderNotificationPlaceholderPayload = {
  body: string;
  customerId: Types.ObjectId | null;
  event: OrderNotificationEvent;
  metadata: Record<string, unknown>;
  orderId: Types.ObjectId;
  recipient: OrderNotificationPlaceholderRecipient;
  status: OrderNotificationPlaceholderStatus;
  storeId: Types.ObjectId | null;
  title: string;
};

export type OrderNotificationPlaceholderRecord = {
  body: string;
  customerId: Types.ObjectId | null;
  event: OrderNotificationEvent;
  metadata: Record<string, unknown>;
  orderId: Types.ObjectId;
  processedAt: Date | null;
  recipientId: Types.ObjectId | null;
  recipientType: OrderNotificationRecipientType;
  status: OrderNotificationPlaceholderStatus;
  storeId: Types.ObjectId | null;
  title: string;
  createdAt: Date;
  updatedAt: Date;
};
