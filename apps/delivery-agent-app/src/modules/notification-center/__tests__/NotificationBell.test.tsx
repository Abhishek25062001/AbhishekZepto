import assert from 'node:assert/strict';
import { test } from 'node:test';

import { useNotificationCenterStore } from '../store/notification-center.store';

test('delivery notification bell store exposes unread badge count', () => {
  useNotificationCenterStore.getState().clearNotificationState();
  useNotificationCenterStore.getState().setUnreadCount(2);

  assert.equal(useNotificationCenterStore.getState().unreadCount, 2);
});
