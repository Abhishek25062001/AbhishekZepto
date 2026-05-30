import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  buildAdminSocketRoom,
  buildAssignmentSocketRoom,
  buildCitySocketRoom,
  buildCustomerSocketRoom,
  buildDeliverySocketRoom,
  buildOrderSocketRoom,
  buildVendorSocketRoom,
} from '../utils/socket-room-name.util';

test('socket room name util builds stable room names', () => {
  assert.equal(buildCustomerSocketRoom('customer-1'), 'customer:customer-1');
  assert.equal(buildDeliverySocketRoom('agent-1'), 'delivery:agent-1');
  assert.equal(buildVendorSocketRoom('store-1'), 'vendor:store-1');
  assert.equal(buildAdminSocketRoom('admin-1'), 'admin:admin-1');
  assert.equal(buildOrderSocketRoom('order-1'), 'order:order-1');
  assert.equal(buildAssignmentSocketRoom('assignment-1'), 'assignment:assignment-1');
  assert.equal(buildCitySocketRoom('city-1'), 'city:city-1');
});
