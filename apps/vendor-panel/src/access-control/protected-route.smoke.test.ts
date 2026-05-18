import assert from 'node:assert/strict';
import { test } from 'node:test';
import { resolveVendorProtectedRoute } from './protected-route.util';

test('ProtectedRoute blocks unauthenticated vendor users', () => {
  assert.equal(
    resolveVendorProtectedRoute({
      isAuthenticated: false,
      role: null,
      vendorId: null,
      storeId: null,
    }),
    'redirect-login',
  );
});

test('ProtectedRoute blocks non-vendor roles and missing scope', () => {
  assert.equal(
    resolveVendorProtectedRoute({
      isAuthenticated: true,
      role: 'customer',
      vendorId: 'vendor-1',
      storeId: 'store-1',
    }),
    'redirect-login',
  );
  assert.equal(
    resolveVendorProtectedRoute({
      isAuthenticated: true,
      role: 'vendor_owner',
      vendorId: '',
      storeId: 'store-1',
    }),
    'redirect-login',
  );
});

test('ProtectedRoute allows authenticated vendor scope', () => {
  assert.equal(
    resolveVendorProtectedRoute({
      isAuthenticated: true,
      role: 'store_manager',
      vendorId: 'vendor-1',
      storeId: 'store-1',
    }),
    'allow',
  );
});
