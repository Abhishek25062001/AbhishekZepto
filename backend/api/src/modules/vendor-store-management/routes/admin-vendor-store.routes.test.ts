import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { test } from 'node:test';

import { ADMIN_ACTION_TYPE } from '../../admin-control/constants/admin-action-types';
import { VENDOR_STORE_MANAGEMENT_PERMISSION_GROUPS } from '../constants/admin-vendor-store-permissions.constants';
import {
  listStoresQueryValidator,
  listVendorsQueryValidator,
  storeIdParamValidator,
  storeInspectionQueryValidator,
  updateStoreStatusValidator,
  updateVendorStatusValidator,
  vendorIdParamValidator,
} from '../validators/admin-vendor-store.validator';

const source = (): string => readFileSync(
  resolve(process.cwd(), 'backend/api/src/modules/vendor-store-management/routes/admin-vendor-store.routes.ts'),
  'utf8',
);

test('vendor and store management routes expose read-only list and detail endpoints', () => {
  const routeSource = source();
  assert.match(routeSource, /router\.get\('\/vendors'/);
  assert.match(routeSource, /router\.get\('\/vendors\/:vendorId'/);
  assert.match(routeSource, /router\.get\('\/stores'/);
  assert.match(routeSource, /router\.get\('\/stores\/:storeId\/orders'/);
  assert.match(routeSource, /router\.get\('\/stores\/:storeId\/inventory'/);
  assert.match(routeSource, /router\.get\('\/stores\/:storeId\/audit'/);
  assert.match(routeSource, /router\.get\('\/stores\/:storeId'/);
  assert.match(routeSource, /router\.patch\('\/vendors\/:vendorId\/status'/);
  assert.match(routeSource, /router\.patch\('\/stores\/:storeId\/status'/);
  assert.doesNotMatch(routeSource, /router\.(post|put|delete)\(/);
});

test('vendor and store management routes are permission-gated', () => {
  const routeSource = source();

  assert.match(routeSource, /requireAnyPermission\(VENDOR_STORE_MANAGEMENT_PERMISSION_GROUPS\.VENDOR_READ\)/);
  assert.match(routeSource, /requireAnyPermission\(VENDOR_STORE_MANAGEMENT_PERMISSION_GROUPS\.VENDOR_STATUS\)/);
  assert.match(routeSource, /requireAnyPermission\(VENDOR_STORE_MANAGEMENT_PERMISSION_GROUPS\.STORE_READ\)/);
  assert.match(routeSource, /requireAnyPermission\(VENDOR_STORE_MANAGEMENT_PERMISSION_GROUPS\.STORE_STATUS\)/);
  assert.match(routeSource, /requireAnyPermission\(VENDOR_STORE_MANAGEMENT_PERMISSION_GROUPS\.STORE_AUDIT\)/);
  assert.deepEqual(VENDOR_STORE_MANAGEMENT_PERMISSION_GROUPS.STORE_READ, [
    'stores:read',
    'settings:manage',
  ]);
  assert.deepEqual(VENDOR_STORE_MANAGEMENT_PERMISSION_GROUPS.STORE_STATUS, [
    'stores:update',
    'settings:manage',
  ]);
});

test('vendor and store management controllers pass admin city scope to services', () => {
  const controllerSource = readFileSync(
    resolve(process.cwd(), 'backend/api/src/modules/vendor-store-management/controllers/admin-vendor-store.controller.ts'),
    'utf8',
  );

  assert.match(controllerSource, /actorCityId: req\.user\?\.cityId \?\? null/);
  assert.match(controllerSource, /getVendorForAdmin\(vendorId, req\.user\?\.cityId \?\? null\)/);
  assert.match(controllerSource, /getStoreForAdmin\(storeId, req\.user\?\.cityId \?\? null\)/);
});

test('vendor and store status updates are audited', () => {
  const controllerSource = readFileSync(
    resolve(process.cwd(), 'backend/api/src/modules/vendor-store-management/controllers/admin-vendor-store.controller.ts'),
    'utf8',
  );

  assert.equal(ADMIN_ACTION_TYPE.VENDOR_STATUS_CHANGED, 'VENDOR_STATUS_CHANGED');
  assert.equal(ADMIN_ACTION_TYPE.STORE_STATUS_CHANGED, 'STORE_STATUS_CHANGED');
  assert.match(controllerSource, /audit: auditContext\(req, reason\)/);
});

test('store operational inspection validator remains pagination-only', () => {
  const parsed = storeInspectionQueryValidator.query.parse({ page: '4', limit: '30' });

  assert.equal(parsed.page, 4);
  assert.equal(parsed.limit, 30);
  assert.throws(() => storeInspectionQueryValidator.query.parse({ page: '0' }));
  assert.throws(() => storeInspectionQueryValidator.query.parse({ limit: '101' }));
});

test('vendor and store management validators accept pagination and reject invalid ids', () => {
  const vendorQuery = listVendorsQueryValidator.query.parse({
    status: 'active',
    cityId: '507f1f77bcf86cd799439011',
    search: 'Vendor+01',
    page: '2',
    limit: '10',
  });
  const storeQuery = listStoresQueryValidator.query.parse({
    status: 'active',
    vendorId: '507f1f77bcf86cd799439011',
    cityId: '507f1f77bcf86cd799439012',
    search: 'Store+01',
    page: '3',
    limit: '25',
  });

  assert.equal(vendorQuery.status, 'active');
  assert.equal(vendorQuery.cityId, '507f1f77bcf86cd799439011');
  assert.equal(vendorQuery.search, 'Vendor+01');
  assert.equal(vendorQuery.page, 2);
  assert.equal(vendorQuery.limit, 10);
  assert.equal(storeQuery.status, 'active');
  assert.equal(storeQuery.vendorId, '507f1f77bcf86cd799439011');
  assert.equal(storeQuery.cityId, '507f1f77bcf86cd799439012');
  assert.equal(storeQuery.search, 'Store+01');
  assert.equal(storeQuery.page, 3);
  assert.equal(storeQuery.limit, 25);
  assert.throws(() => listVendorsQueryValidator.query.parse({ status: 'archived' }));
  assert.throws(() => listStoresQueryValidator.query.parse({ status: 'blocked' }));
  assert.throws(() => vendorIdParamValidator.params.parse({ vendorId: 'bad-id' }));
  assert.throws(() => storeIdParamValidator.params.parse({ storeId: 'bad-id' }));
});

test('vendor and store status validators require reason capture', () => {
  assert.throws(() => updateVendorStatusValidator.body.parse({ status: 'inactive' }));
  assert.throws(() => updateStoreStatusValidator.body.parse({ status: 'inactive' }));
  assert.throws(() => updateVendorStatusValidator.body.parse({
    status: 'deleted',
    reason: 'Deletion is not a status control',
  }));
  assert.equal(
    updateVendorStatusValidator.body.parse({
      status: 'blocked',
      reason: 'Compliance review',
    }).status,
    'blocked',
  );
  assert.equal(
    updateStoreStatusValidator.body.parse({
      status: 'suspended',
      reason: 'Operations review',
    }).reason,
    'Operations review',
  );
});
