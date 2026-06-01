import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { test } from 'node:test';

import { ERROR_CODES } from '../../../errors/error-codes';
import { ADMIN_ACTION_TYPE } from '../../admin-control/constants/admin-action-types';
import {
  customerIdParamValidator,
  customerOrdersQueryValidator,
  listCustomersQueryValidator,
  updateCustomerStatusValidator,
} from '../validators/customer-management.validator';

const source = (): string => readFileSync(
  resolve(process.cwd(), 'backend/api/src/modules/customer-management/routes/customer-management.routes.ts'),
  'utf8',
);

test('customer management routes expose planned endpoints', () => {
  const routeSource = source();
  assert.match(routeSource, /requireAnyPermission\(CUSTOMER_MANAGEMENT_PERMISSION_GROUPS\.READ\)/);
  assert.match(routeSource, /requireAnyPermission\(CUSTOMER_MANAGEMENT_PERMISSION_GROUPS\.STATUS\)/);
  assert.match(routeSource, /requireAnyPermission\(CUSTOMER_MANAGEMENT_PERMISSION_GROUPS\.NOTES\)/);
  assert.match(routeSource, /requireAnyPermission\(CUSTOMER_MANAGEMENT_PERMISSION_GROUPS\.AUDIT\)/);
  assert.match(routeSource, /router\.get\('\/'/);
  assert.match(routeSource, /router\.get\('\/:customerId'/);
  assert.match(routeSource, /router\.patch\('\/:customerId\/status'/);
  assert.match(routeSource, /router\.patch\('\/:customerId\/notes'/);
  assert.match(routeSource, /router\.get\('\/:customerId\/orders'/);
  assert.match(routeSource, /router\.get\('\/:customerId\/addresses'/);
  assert.match(routeSource, /router\.get\('\/:customerId\/audit'/);
  assert.doesNotMatch(routeSource, /router\.(post|put|patch|delete)\('\/:customerId\/orders'/);
  assert.doesNotMatch(routeSource, /router\.(post|put|patch|delete)\('\/:customerId\/addresses'/);
});

test('customer management validators accept documented filters and reject invalid ids', () => {
  assert.throws(() => customerIdParamValidator.params.parse({ customerId: 'bad-id' }));
  const parsed = listCustomersQueryValidator.query.parse({
    status: 'active',
    cityId: '507f1f77bcf86cd799439011',
    search: 'customer',
    createdFrom: '2026-01-01T00:00:00.000Z',
    createdTo: '2026-01-31T23:59:59.000Z',
    page: '2',
    limit: '10',
  });
  assert.equal(parsed.page, 2);
  assert.equal(parsed.limit, 10);
  assert.equal(parsed.createdFrom, '2026-01-01T00:00:00.000Z');
  assert.equal(parsed.createdTo, '2026-01-31T23:59:59.000Z');
  assert.equal(listCustomersQueryValidator.query.parse({ search: 'a+b@example.com' }).search, 'a+b@example.com');
});

test('customer status validator requires reason capture', () => {
  assert.throws(() => updateCustomerStatusValidator.body.parse({ status: 'blocked' }));
  assert.throws(() => updateCustomerStatusValidator.body.parse({ status: 'deleted', reason: 'Delete account' }));
  assert.equal(
    updateCustomerStatusValidator.body.parse({ status: 'blocked', reason: 'Fraud review' }).reason,
    'Fraud review',
  );
});

test('customer orders validator accepts read filters only', () => {
  const parsed = customerOrdersQueryValidator.query.parse({
    status: 'delivered',
    fromDate: '2026-02-01T00:00:00.000Z',
    toDate: '2026-02-28T23:59:59.000Z',
    page: '3',
    limit: '25',
  });

  assert.equal(parsed.status, 'delivered');
  assert.equal(parsed.page, 3);
  assert.equal(parsed.limit, 25);
  assert.throws(() => customerOrdersQueryValidator.query.parse({ status: 'refunded' }));
});

test('customer management error codes are registered', () => {
  assert.equal(ERROR_CODES.CUSTOMER_NOT_FOUND, 'CUSTOMER_NOT_FOUND');
  assert.equal(ERROR_CODES.CUSTOMER_SCOPE_DENIED, 'CUSTOMER_SCOPE_DENIED');
});

test('customer management audit action types are registered', () => {
  assert.equal(ADMIN_ACTION_TYPE.CUSTOMER_STATUS_CHANGED, 'CUSTOMER_STATUS_CHANGED');
  assert.equal(ADMIN_ACTION_TYPE.CUSTOMER_NOTE_UPDATED, 'CUSTOMER_NOTE_UPDATED');
});
