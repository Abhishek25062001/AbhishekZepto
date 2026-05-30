import type { InAppNotification } from '../../../../../../packages/shared/api';

export const getNotificationTarget = (notification: InAppNotification): string | null => {
  if (notification.notificationType === 'sla_alert') {
    return '/realtime-control-tower';
  }

  if (notification.notificationType === 'order_update') {
    return typeof notification.dataPayload.orderId === 'string'
      ? `/orders/${notification.dataPayload.orderId}`
      : '/orders';
  }

  if (notification.notificationType === 'delivery_update') {
    return typeof notification.dataPayload.deliveryId === 'string'
      ? `/deliveries/${notification.dataPayload.deliveryId}`
      : '/deliveries';
  }

  return null;
};
