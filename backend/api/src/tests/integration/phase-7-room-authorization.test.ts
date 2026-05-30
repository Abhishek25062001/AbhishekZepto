import assert from 'node:assert/strict';
import { test } from 'node:test';

import { SOCKET_ERROR_CODES } from '../../modules/realtime/constants/socket-error-codes.constant';
import {
  buildAssignmentSocketRoom,
  buildCitySocketRoom,
  buildOrderSocketRoom,
  buildVendorSocketRoom,
} from '../../modules/realtime/utils/socket-room-name.util';

test('Phase 7 room authorization uses scoped room names', () => {
  assert.equal(buildOrderSocketRoom('order-1'), 'order:order-1');
  assert.equal(buildAssignmentSocketRoom('assignment-1'), 'assignment:assignment-1');
  assert.equal(buildVendorSocketRoom('store-1'), 'vendor:store-1');
  assert.equal(buildCitySocketRoom('city-1'), 'city:city-1');
});

test('Phase 7 denied room joins use ROOM_JOIN_DENIED', () => {
  assert.equal(SOCKET_ERROR_CODES.ROOM_JOIN_DENIED, 'ROOM_JOIN_DENIED');
});
