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
  title: 'Admin notification',
  message: 'Control tower update',
  dataPayload,
  priority: 'critical',
  isRead: false,
  readAt: null,
  createdAt: '2026-05-30T10:00:00.000Z',
});

test('admin notification dropdown routes SLA and delivery updates', () => {
  assert.equal(
    getNotificationTarget(createNotification('sla_alert', { orderId: 'order-1' })),
    '/realtime-control-tower',
  );
  assert.equal(
    getNotificationTarget(createNotification('delivery_update', { deliveryId: 'delivery-1' })),
    '/deliveries/delivery-1',
  );
});

test('admin notification dropdown prepends realtime critical notification and unread count', () => {
  useNotificationCenterStore.getState().clearNotificationState();

  useNotificationCenterStore
    .getState()
    .prependNotification(createNotification('sla_alert', { orderId: 'order-1' }));

  assert.equal(useNotificationCenterStore.getState().notifications[0]?.priority, 'critical');
  assert.equal(useNotificationCenterStore.getState().unreadCount, 1);
});
