import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  resolveMobileAuthGuardSurface,
  shouldExposeProtectedMobileContent,
} from './mobile-auth-guard.util';

test('unauthenticated delivery agents stay on auth flow', () => {
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

test('authenticated delivery agents reach protected main flow', () => {
  assert.equal(
    resolveMobileAuthGuardSurface({
      isRestoringSession: false,
      isAuthenticated: true,
    }),
    'main',
  );
});

test('session restore keeps splash until loading completes', () => {
  assert.equal(
    resolveMobileAuthGuardSurface({
      isRestoringSession: true,
      isAuthenticated: false,
    }),
    'splash',
  );
  assert.equal(
    shouldExposeProtectedMobileContent({
      isRestoringSession: true,
      isAuthenticated: false,
    }),
    false,
  );
});
