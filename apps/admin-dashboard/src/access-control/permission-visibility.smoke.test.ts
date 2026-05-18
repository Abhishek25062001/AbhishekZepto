import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  shouldRenderAnyPermissionGatedContent,
  shouldRenderPermissionGatedContent,
} from './permission-visibility.util';

test('CanAccess hides controls when permission is missing', () => {
  assert.equal(shouldRenderPermissionGatedContent(['users:read'], 'auth:manage'), false);
  assert.equal(shouldRenderPermissionGatedContent(['users:read'], 'users:read'), true);
});

test('CanAccessAny allows any matching permission', () => {
  assert.equal(
    shouldRenderAnyPermissionGatedContent(['auth:read'], ['auth:manage', 'auth:read']),
    true,
  );
  assert.equal(
    shouldRenderAnyPermissionGatedContent(['settings:read'], ['auth:manage', 'users:read']),
    false,
  );
  assert.equal(shouldRenderAnyPermissionGatedContent(['*:*'], ['auth:manage']), true);
});
