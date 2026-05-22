import { OrderNotificationPlaceholderModel } from '../models/order-notification-placeholder.model';
import type {
  OrderNotificationPlaceholderPayload,
  OrderNotificationPlaceholderRecord,
} from '../types/order-notification.types';

export const createOrderNotificationPlaceholders = async (
  payloads: OrderNotificationPlaceholderPayload[],
): Promise<OrderNotificationPlaceholderRecord[]> => {
  if (payloads.length === 0) {
    return [];
  }

  const created = await OrderNotificationPlaceholderModel.insertMany(
    payloads.map((payload) => ({
      body: payload.body,
      customerId: payload.customerId,
      event: payload.event,
      metadata: payload.metadata,
      orderId: payload.orderId,
      recipientId: payload.recipient.recipientId,
      recipientType: payload.recipient.recipientType,
      status: payload.status,
      storeId: payload.storeId,
      title: payload.title,
    })),
  );

  return created.map((record) => record.toObject() as OrderNotificationPlaceholderRecord);
};
