import assert from 'node:assert/strict';
import { test } from 'node:test';

import { INTERNAL_EVENT_NAMES } from '../../modules/internal-events/constants/internal-event-names.constant';

test('Phase 7 internal events include order, delivery, tracking, and SLA fanout inputs', () => {
  assert.equal(INTERNAL_EVENT_NAMES.ORDER_CREATED, 'order.created');
  assert.equal(INTERNAL_EVENT_NAMES.DELIVERY_ASSIGNMENT_CREATED, 'delivery.assignment_created');
  assert.equal(INTERNAL_EVENT_NAMES.DELIVERY_LOCATION_UPDATED, 'delivery.location_updated');
  assert.equal(INTERNAL_EVENT_NAMES.DELIVERY_SLA_BREACH_CREATED, 'delivery.sla_breach_created');
});
