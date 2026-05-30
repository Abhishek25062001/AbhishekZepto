import type { InAppNotificationType } from '../../../shared/api';

const NOTIFICATION_ICON_BY_TYPE: Record<InAppNotificationType, string> = {
  assignment_update: 'clipboard-list',
  delivery_update: 'truck',
  order_update: 'shopping-bag',
  payment_update: 'credit-card',
  refund_update: 'rotate-ccw',
  sla_alert: 'timer-warning',
  system_alert: 'bell',
};

export const getNotificationIconName = (
  notificationType: InAppNotificationType,
): string => NOTIFICATION_ICON_BY_TYPE[notificationType];
