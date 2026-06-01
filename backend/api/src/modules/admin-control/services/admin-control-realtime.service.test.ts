import assert from 'node:assert/strict';
import { test } from 'node:test';

import { REALTIME_EVENTS, REALTIME_NAMESPACE } from '../../realtime/constants/realtime-events.constant';

test('admin control realtime namespace and events are registered', () => {
  assert.equal(REALTIME_NAMESPACE.ADMIN_CONTROL, '/admin-control');
  assert.equal(REALTIME_EVENTS.ADMIN_LIVE_ORDER_UPDATED, 'admin.live_order_updated');
  assert.equal(REALTIME_EVENTS.ADMIN_AGENT_STATUS_CHANGED, 'admin.agent_status_changed');
  assert.equal(REALTIME_EVENTS.ADMIN_STORE_OPERATIONAL_CHANGED, 'admin.store_operational_changed');
  assert.equal(REALTIME_EVENTS.ADMIN_SLA_ESCALATION_CREATED, 'admin.sla_escalation_created');
});
