import assert from 'node:assert/strict';
import { test } from 'node:test';

import type { InAppNotification } from '../../../../../../packages/shared/api';
import { useNotificationCenterStore } from '../store/notification-center.store';
import { getNotificationTarget } from '../utils/notification-routing.util';

const createNotification = (
  notificationType: InAppNotification['notificationType'],
  dataPayload: Record<string, unknown>,
): InAppNotification => ({
  id: `${notificationType}-1`,
  notificationType,
  title: 'Assignment updated',
  message: 'Assignment status changed',
  dataPayload,
  priority: 'normal',
  isRead: false,
  readAt: null,
  createdAt: '2026-05-30T10:00:00.000Z',
});

test('delivery notification center routes assignment updates', () => {
  assert.equal(
    getNotificationTarget(
      createNotification('assignment_update', { assignmentId: 'assignment-1' }),
    ),
    'assignment:assignment-1',
  );
});

test('delivery notification center marks a tapped notification read', () => {
  useNotificationCenterStore.getState().clearNotificationState();
  useNotificationCenterStore
    .getState()
    .setNotifications([
      createNotification('assignment_update', { assignmentId: 'assignment-1' }),
    ]);
  useNotificationCenterStore.getState().setUnreadCount(1);

  useNotificationCenterStore.getState().markNotificationRead('assignment_update-1');

  assert.equal(useNotificationCenterStore.getState().notifications[0]?.isRead, true);
  assert.equal(useNotificationCenterStore.getState().unreadCount, 0);
});
