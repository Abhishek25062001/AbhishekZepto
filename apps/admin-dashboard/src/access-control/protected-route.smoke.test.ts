import assert from 'node:assert/strict';
import { test } from 'node:test';
import { resolveAdminProtectedRoute } from './protected-route.util';

test('ProtectedRoute blocks unauthenticated admin users', () => {
  assert.equal(
    resolveAdminProtectedRoute({
      isAuthenticated: false,
      role: null,
    }),
    'redirect-login',
  );
});

test('ProtectedRoute blocks non-admin roles', () => {
  assert.equal(
    resolveAdminProtectedRoute({
      isAuthenticated: true,
      role: 'vendor_owner',
    }),
    'redirect-login',
  );
});

test('ProtectedRoute allows authenticated admin roles', () => {
  assert.equal(
    resolveAdminProtectedRoute({
      isAuthenticated: true,
      role: 'operations_admin',
    }),
    'allow',
  );
});
