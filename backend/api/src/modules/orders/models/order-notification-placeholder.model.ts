import { model, Schema } from 'mongoose';
import type { SchemaOptions } from 'mongoose';
import { baseSchemaOptions } from '../../../database/base-schema-options';
import { COLLECTION_NAMES } from '../../../database/constants/collection-names.constants';
import {
  ORDER_NOTIFICATION_EVENT_VALUES,
  ORDER_NOTIFICATION_PLACEHOLDER_STATUS,
  ORDER_NOTIFICATION_PLACEHOLDER_STATUS_VALUES,
  ORDER_NOTIFICATION_RECIPIENT_TYPE_VALUES,
} from '../constants/order-notification-events.constant';
import type { OrderNotificationPlaceholderRecord } from '../types/order-notification.types';

const OrderNotificationPlaceholderSchema = new Schema<OrderNotificationPlaceholderRecord>(
  {
    body: { type: String, required: true, trim: true },
    customerId: { type: Schema.Types.ObjectId, default: null },
    event: { type: String, enum: ORDER_NOTIFICATION_EVENT_VALUES, required: true },
    metadata: { type: Schema.Types.Mixed, default: {} },
    orderId: { type: Schema.Types.ObjectId, required: true },
    processedAt: { type: Date, default: null },
    recipientId: { type: Schema.Types.ObjectId, default: null },
    recipientType: {
      type: String,
      enum: ORDER_NOTIFICATION_RECIPIENT_TYPE_VALUES,
      required: true,
    },
    status: {
      type: String,
      enum: ORDER_NOTIFICATION_PLACEHOLDER_STATUS_VALUES,
      default: ORDER_NOTIFICATION_PLACEHOLDER_STATUS.QUEUED_PLACEHOLDER,
    },
    storeId: { type: Schema.Types.ObjectId, default: null },
    title: { type: String, required: true, trim: true },
  },
  baseSchemaOptions as SchemaOptions<OrderNotificationPlaceholderRecord>,
);

OrderNotificationPlaceholderSchema.index({ orderId: 1, createdAt: -1 });
OrderNotificationPlaceholderSchema.index({ recipientType: 1, createdAt: -1 });
OrderNotificationPlaceholderSchema.index({ status: 1, createdAt: -1 });
OrderNotificationPlaceholderSchema.index({ createdAt: -1 });

export const OrderNotificationPlaceholderModel = model<OrderNotificationPlaceholderRecord>(
  'OrderNotificationPlaceholder',
  OrderNotificationPlaceholderSchema,
  COLLECTION_NAMES.ORDER_NOTIFICATION_PLACEHOLDERS,
);
