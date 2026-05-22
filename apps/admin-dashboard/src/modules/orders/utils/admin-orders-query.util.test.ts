import assert from 'node:assert/strict';
import { test } from 'node:test';

import {
  buildAdminOrderListQuery,
  parseAdminOrderNumberParam,
  setAdminOrderSearchParams,
} from './admin-orders-query.util';

test('buildAdminOrderListQuery maps documented admin filters', () => {
  const query = buildAdminOrderListQuery(
    new URLSearchParams(
      'status=accepted&storeStatus=accepted&storeId=store-1&cityId=city-1&paymentStatus=paid&customerId=customer-1&slaStatus=on_track&slaBreachedStage=acceptance&fromDate=2026-05-01&toDate=2026-05-21&page=2&limit=25&sort=createdAt_asc',
    ),
  );

  assert.equal(query.status, 'accepted');
  assert.equal(query.storeId, 'store-1');
  assert.equal(query.cityId, 'city-1');
  assert.equal(query.page, 2);
  assert.equal(query.limit, 25);
  assert.equal(query.sort, 'createdAt_asc');
});

test('parseAdminOrderNumberParam falls back for invalid values', () => {
  assert.equal(parseAdminOrderNumberParam(null, 20), 20);
  assert.equal(parseAdminOrderNumberParam('0', 20), 20);
  assert.equal(parseAdminOrderNumberParam('10', 20), 10);
});

test('setAdminOrderSearchParams clears empty filters', () => {
  const params = new URLSearchParams('status=placed&page=2');
  setAdminOrderSearchParams(params, { status: undefined, page: 1 });

  assert.equal(params.toString(), 'page=1');
});
