import type { Types } from 'mongoose';
import type {
  DeliveryNotificationEvent,
  DeliveryNotificationStatus,
  DeliveryNotificationRecipient,
} from '../constants/delivery-notification-events.constant';

export type DeliveryNotificationPlaceholderRecipient = {
  recipientId: Types.ObjectId | null;
  recipientType: DeliveryNotificationRecipient;
};

export type DeliveryNotificationPlaceholderPayload = {
  body: string;
  customerId: Types.ObjectId | null;
  event: DeliveryNotificationEvent;
  metadata: Record<string, unknown>;
  orderId: Types.ObjectId;
  recipient: DeliveryNotificationPlaceholderRecipient;
  status: DeliveryNotificationStatus;
  storeId: Types.ObjectId | null;
  title: string;
};

export type DeliveryNotificationPlaceholderRecord = {
  body: string;
  customerId: Types.ObjectId | null;
  event: DeliveryNotificationEvent;
  metadata: Record<string, unknown>;
  orderId: Types.ObjectId;
  processedAt: Date | null;
  recipientId: Types.ObjectId | null;
  recipientType: DeliveryNotificationRecipient;
  status: DeliveryNotificationStatus;
  storeId: Types.ObjectId | null;
  title: string;
  createdAt: Date;
  updatedAt: Date;
};
