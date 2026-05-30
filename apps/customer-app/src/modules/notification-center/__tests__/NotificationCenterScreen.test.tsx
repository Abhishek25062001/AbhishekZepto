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
  title: 'Order updated',
  message: 'Order status changed',
  dataPayload,
  priority: 'normal',
  isRead: false,
  readAt: null,
  createdAt: '2026-05-30T10:00:00.000Z',
});

test('customer notification center routes order and delivery updates', () => {
  assert.equal(
    getNotificationTarget(createNotification('order_update', { orderId: 'order-1' })),
    'order:order-1',
  );
  assert.equal(
    getNotificationTarget(createNotification('delivery_update', { orderId: 'order-1' })),
    'tracking:order-1',
  );
});

test('customer notification center marks a tapped notification read', () => {
  useNotificationCenterStore.getState().clearNotificationState();
  useNotificationCenterStore
    .getState()
    .setNotifications([createNotification('order_update', { orderId: 'order-1' })]);
  useNotificationCenterStore.getState().setUnreadCount(1);

  useNotificationCenterStore.getState().markNotificationRead('order_update-1');

  assert.equal(useNotificationCenterStore.getState().notifications[0]?.isRead, true);
  assert.equal(useNotificationCenterStore.getState().unreadCount, 0);
});
