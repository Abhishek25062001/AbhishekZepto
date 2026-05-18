import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  resolveMobileAuthGuardSurface,
  shouldExposeProtectedMobileContent,
} from './mobile-auth-guard.util';

test('unauthenticated users stay on auth flow', () => {
  assert.equal(
    resolveMobileAuthGuardSurface({
      isRestoringSession: false,
      isAuthenticated: false,
    }),
    'auth',
  );
  assert.equal(
    shouldExposeProtectedMobileContent({
      isRestoringSession: false,
      isAuthenticated: false,
    }),
    false,
  );
});

test('authenticated users reach protected main flow', () => {
  assert.equal(
    resolveMobileAuthGuardSurface({
      isRestoringSession: false,
      isAuthenticated: true,
    }),
    'main',
  );
  assert.equal(
    shouldExposeProtectedMobileContent({
      isRestoringSession: false,
      isAuthenticated: true,
    }),
    true,
  );
});

test('session restore keeps splash until loading completes', () => {
  assert.equal(
    resolveMobileAuthGuardSurface({
      isRestoringSession: true,
      isAuthenticated: true,
    }),
    'splash',
  );
  assert.equal(
    shouldExposeProtectedMobileContent({
      isRestoringSession: true,
      isAuthenticated: true,
    }),
    false,
  );
});
