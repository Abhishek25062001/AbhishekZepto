import { findOrderById } from '../../orders/repositories/order.repository';
import { createOrderNotificationPlaceholders } from '../../orders/repositories/order-notification-placeholder.repository';
import {
  ORDER_NOTIFICATION_RECIPIENT_TYPES,
  ORDER_NOTIFICATION_PLACEHOLDER_STATUS,
  type OrderNotificationEvent,
} from '../../orders/constants/order-notification-events.constant';
import type { IDeliveryAssignmentDocument } from '../types/delivery-assignment.types';

/**
 * Publish a mock placeholder notification for delivery agent events.
 */
export const publishDeliveryNotificationPlaceholders = async (
  delivery: IDeliveryAssignmentDocument,
  eventType: string,
): Promise<void> => {
  try {
    const order = await findOrderById(delivery.orderId.toString());
    if (!order) {
      console.warn(`Order not found for delivery ${delivery._id} notification publishing`);
      return;
    }

    const orderNumber = order.orderNumber;
    const agentId = delivery.deliveryAgentId;

    if (!agentId) {
      console.warn(`No deliveryAgentId assigned for delivery ${delivery._id} notification publishing`);
      return;
    }

    let title = 'New Assignment';
    let body = `Order #${orderNumber} is assigned to you`;

    if (eventType === 'assigned') {
      title = 'New Assignment';
      body = `Order #${orderNumber} is assigned to you`;
    } else if (eventType === 'picked_up') {
      title = 'Order Picked Up';
      body = `Order #${orderNumber} has been picked up`;
    } else if (eventType === 'delivered') {
      title = 'Order Delivered';
      body = `Order #${orderNumber} has been delivered successfully`;
    }

    await createOrderNotificationPlaceholders([
      {
        body,
        customerId: delivery.customerId,
        event: eventType as OrderNotificationEvent,
        metadata: {
          deliveryId: delivery._id,
          orderNumber,
        },
        orderId: delivery.orderId,
        recipient: {
          recipientId: agentId,
          recipientType: ORDER_NOTIFICATION_RECIPIENT_TYPES.AGENT,
        },
        status: ORDER_NOTIFICATION_PLACEHOLDER_STATUS.QUEUED_PLACEHOLDER,
        storeId: delivery.storeId,
        title,
      },
    ]);
  } catch (error) {
    console.warn('Failed to publish delivery notification placeholder:', error);
  }
};
