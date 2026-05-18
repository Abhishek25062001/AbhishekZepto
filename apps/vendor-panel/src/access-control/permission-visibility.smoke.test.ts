import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  shouldRenderAnyPermissionGatedContent,
  shouldRenderPermissionGatedContent,
} from './permission-visibility.util';

test('CanAccess hides controls when permission is missing', () => {
  assert.equal(shouldRenderPermissionGatedContent(['vendor:read_store'], 'users:read'), false);
  assert.equal(shouldRenderPermissionGatedContent(['vendor:read_store'], 'vendor:read_store'), true);
  assert.equal(shouldRenderPermissionGatedContent(['*:*'], 'users:read'), true);
});

test('permission visibility supports any-of checks for shared controls', () => {
  assert.equal(
    shouldRenderAnyPermissionGatedContent(['settings:read'], ['users:read', 'settings:read']),
    true,
  );
  assert.equal(
    shouldRenderAnyPermissionGatedContent(['vendor:read_store'], ['users:read', 'settings:read']),
    false,
  );
});
