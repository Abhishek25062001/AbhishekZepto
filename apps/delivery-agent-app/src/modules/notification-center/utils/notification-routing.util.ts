import type { InAppNotification } from '../../../../../../packages/shared/api';

export const getNotificationTarget = (notification: InAppNotification): string | null => {
  if (notification.notificationType === 'assignment_update') {
    return typeof notification.dataPayload.assignmentId === 'string'
      ? `assignment:${notification.dataPayload.assignmentId}`
      : 'assignments';
  }

  if (notification.notificationType === 'delivery_update') {
    return 'active-delivery';
  }

  return null;
};
