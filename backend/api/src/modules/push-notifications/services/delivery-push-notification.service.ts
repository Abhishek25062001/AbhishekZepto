import { APP_SURFACE } from '../constants/app-surface.constant';
import { sendPushToUser } from './push-notification.service';
import {
  mapDeliveryAssignmentPushPayload,
  mapOrderDeliveryPushPayload,
} from '../utils/push-payload.mapper';

export const sendAssignmentCreatedPush = (
  deliveryAgentId: string,
  assignmentPayload: Record<string, unknown>,
) =>
  sendPushToUser(deliveryAgentId, APP_SURFACE.DELIVERY_AGENT_APP, {
    body: 'A new delivery has been assigned to you.',
    dataPayload: mapDeliveryAssignmentPushPayload(assignmentPayload),
    notificationType: 'assignment_created',
    title: 'New delivery assigned',
  });

export const sendOrderOutForDeliveryPush = (
  customerId: string,
  orderPayload: Record<string, unknown>,
) =>
  sendPushToUser(customerId, APP_SURFACE.CUSTOMER_APP, {
    body: 'Your order is out for delivery.',
    dataPayload: mapOrderDeliveryPushPayload('order_out_for_delivery', orderPayload),
    notificationType: 'order_out_for_delivery',
    title: 'Order out for delivery',
  });

export const sendOrderDeliveredPush = (
  customerId: string,
  orderPayload: Record<string, unknown>,
) =>
  sendPushToUser(customerId, APP_SURFACE.CUSTOMER_APP, {
    body: 'Your order has been delivered.',
    dataPayload: mapOrderDeliveryPushPayload('order_delivered', orderPayload),
    notificationType: 'order_delivered',
    title: 'Order delivered',
  });

export const sendDeliveryFailedPush = (
  customerId: string,
  orderPayload: Record<string, unknown>,
) =>
  sendPushToUser(customerId, APP_SURFACE.CUSTOMER_APP, {
    body: 'We could not complete your delivery.',
    dataPayload: mapOrderDeliveryPushPayload('delivery_failed', orderPayload),
    notificationType: 'delivery_failed',
    title: 'Delivery failed',
  });
