/* eslint-disable @typescript-eslint/no-explicit-any */
import { findOrderById } from '../../orders/repositories/order.repository';
import { createOrderNotificationPlaceholders } from '../../orders/repositories/order-notification-placeholder.repository';
import {
  ORDER_NOTIFICATION_RECIPIENT_TYPES,
  ORDER_NOTIFICATION_PLACEHOLDER_STATUS,
  type OrderNotificationEvent,
} from '../../orders/constants/order-notification-events.constant';
import type { IDeliveryAssignmentDocument } from '../types/delivery-assignment.types';

/**
 * Publish mock placeholder notifications for delivery agent and operational events.
 * Wrap in a robust try/catch block so that notification publishing failures do not
 * interrupt the primary state transition.
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
    const payloads = [];

    if (eventType === 'assigned') {
      if (agentId) {
        payloads.push({
          body: `Order #${orderNumber} is assigned to you`,
          customerId: delivery.customerId,
          event: 'assigned' as OrderNotificationEvent,
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
          title: 'New Assignment',
        });
      }
    } else if (eventType === 'arrived_at_store') {
      // Notify Vendor of rider arrival
      payloads.push({
        body: `Rider is at the store for Order #${orderNumber}`,
        customerId: delivery.customerId,
        event: 'arrived_at_store' as any,
        metadata: {
          deliveryId: delivery._id,
          orderNumber,
        },
        orderId: delivery.orderId,
        recipient: {
          recipientId: delivery.storeId,
          recipientType: ORDER_NOTIFICATION_RECIPIENT_TYPES.VENDOR,
        },
        status: ORDER_NOTIFICATION_PLACEHOLDER_STATUS.QUEUED_PLACEHOLDER,
        storeId: delivery.storeId,
        title: 'Rider Arrived at Store',
      });
    } else if (eventType === 'picked_up') {
      // Notify Customer of order dispatch
      payloads.push({
        body: `Order #${orderNumber} has been picked up`,
        customerId: delivery.customerId,
        event: 'picked_up' as OrderNotificationEvent,
        metadata: {
          deliveryId: delivery._id,
          orderNumber,
        },
        orderId: delivery.orderId,
        recipient: {
          recipientId: delivery.customerId,
          recipientType: ORDER_NOTIFICATION_RECIPIENT_TYPES.CUSTOMER,
        },
        status: ORDER_NOTIFICATION_PLACEHOLDER_STATUS.QUEUED_PLACEHOLDER,
        storeId: delivery.storeId,
        title: 'Order Picked Up',
      });
    } else if (eventType === 'arrived_at_customer') {
      // Notify Customer of rider arrival at building
      payloads.push({
        body: `Rider has arrived at your location for Order #${orderNumber}`,
        customerId: delivery.customerId,
        event: 'arrived_at_customer' as any,
        metadata: {
          deliveryId: delivery._id,
          orderNumber,
        },
        orderId: delivery.orderId,
        recipient: {
          recipientId: delivery.customerId,
          recipientType: ORDER_NOTIFICATION_RECIPIENT_TYPES.CUSTOMER,
        },
        status: ORDER_NOTIFICATION_PLACEHOLDER_STATUS.QUEUED_PLACEHOLDER,
        storeId: delivery.storeId,
        title: 'Rider Arrived',
      });
    } else if (eventType === 'delivered') {
      // Notify Customer and Admin of completed journey
      payloads.push({
        body: `Order #${orderNumber} has been delivered successfully`,
        customerId: delivery.customerId,
        event: 'delivered' as OrderNotificationEvent,
        metadata: {
          deliveryId: delivery._id,
          orderNumber,
        },
        orderId: delivery.orderId,
        recipient: {
          recipientId: delivery.customerId,
          recipientType: ORDER_NOTIFICATION_RECIPIENT_TYPES.CUSTOMER,
        },
        status: ORDER_NOTIFICATION_PLACEHOLDER_STATUS.QUEUED_PLACEHOLDER,
        storeId: delivery.storeId,
        title: 'Order Delivered',
      });
    } else if (eventType === 'failed') {
      // Notify Customer and Admin of delivery issue
      payloads.push({
        body: `Delivery attempt failed for Order #${orderNumber}`,
        customerId: delivery.customerId,
        event: 'failed' as any,
        metadata: {
          deliveryId: delivery._id,
          orderNumber,
        },
        orderId: delivery.orderId,
        recipient: {
          recipientId: delivery.customerId,
          recipientType: ORDER_NOTIFICATION_RECIPIENT_TYPES.CUSTOMER,
        },
        status: ORDER_NOTIFICATION_PLACEHOLDER_STATUS.QUEUED_PLACEHOLDER,
        storeId: delivery.storeId,
        title: 'Delivery Failed',
      });
    } else if (eventType === 'cancelled') {
      // Notify Customer of delivery cancellation
      payloads.push({
        body: `Delivery assignment has been cancelled for Order #${orderNumber}`,
        customerId: delivery.customerId,
        event: 'cancelled' as any,
        metadata: {
          deliveryId: delivery._id,
          orderNumber,
        },
        orderId: delivery.orderId,
        recipient: {
          recipientId: delivery.customerId,
          recipientType: ORDER_NOTIFICATION_RECIPIENT_TYPES.CUSTOMER,
        },
        status: ORDER_NOTIFICATION_PLACEHOLDER_STATUS.QUEUED_PLACEHOLDER,
        storeId: delivery.storeId,
        title: 'Delivery Cancelled',
      });
    } else if (eventType === 'sla_breached') {
      // Notify Admin operations queue
      payloads.push({
        body: `SLA breach detected on delivery for Order #${orderNumber}`,
        customerId: delivery.customerId,
        event: 'sla_breached' as any,
        metadata: {
          deliveryId: delivery._id,
          orderNumber,
        },
        orderId: delivery.orderId,
        recipient: {
          recipientId: null,
          recipientType: ORDER_NOTIFICATION_RECIPIENT_TYPES.ADMIN,
        },
        status: ORDER_NOTIFICATION_PLACEHOLDER_STATUS.QUEUED_PLACEHOLDER,
        storeId: delivery.storeId,
        title: 'Delivery SLA Breach',
      });
    }

    if (payloads.length > 0) {
      await createOrderNotificationPlaceholders(payloads);
    }
  } catch (error) {
    console.warn('Failed to publish delivery notification placeholder:', error);
  }
};
