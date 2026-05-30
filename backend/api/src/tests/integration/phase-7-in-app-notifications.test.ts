import assert from 'node:assert/strict';
import { test } from 'node:test';

import { IN_APP_NOTIFICATION_PRIORITY } from '../../modules/in-app-notifications/constants/in-app-notification-priority.constant';
import { IN_APP_NOTIFICATION_SURFACE } from '../../modules/in-app-notifications/constants/in-app-notification-surface.constant';
import { IN_APP_NOTIFICATION_TYPE } from '../../modules/in-app-notifications/constants/in-app-notification-type.constant';

test('Phase 7 in-app notification validation covers all app surfaces', () => {
  assert.deepEqual(Object.values(IN_APP_NOTIFICATION_SURFACE).sort(), [
    'admin_dashboard',
    'customer_app',
    'delivery_agent_app',
    'vendor_panel',
  ]);
});

test('Phase 7 in-app notification validation covers required types and priorities', () => {
  assert.equal(IN_APP_NOTIFICATION_TYPE.ORDER_UPDATE, 'order_update');
  assert.equal(IN_APP_NOTIFICATION_TYPE.DELIVERY_UPDATE, 'delivery_update');
  assert.equal(IN_APP_NOTIFICATION_TYPE.ASSIGNMENT_UPDATE, 'assignment_update');
  assert.equal(IN_APP_NOTIFICATION_TYPE.SLA_ALERT, 'sla_alert');
  assert.equal(IN_APP_NOTIFICATION_PRIORITY.CRITICAL, 'critical');
});
