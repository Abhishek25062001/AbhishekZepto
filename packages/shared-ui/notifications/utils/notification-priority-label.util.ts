import type { InAppNotificationPriority } from '../../../shared/api';

const NOTIFICATION_PRIORITY_LABEL: Record<InAppNotificationPriority, string> = {
  critical: 'Critical',
  high: 'High',
  low: 'Low',
  normal: 'Normal',
};

export const getNotificationPriorityLabel = (
  priority: InAppNotificationPriority,
): string => NOTIFICATION_PRIORITY_LABEL[priority];
