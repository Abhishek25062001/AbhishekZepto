import assert from 'node:assert/strict';
import { test } from 'node:test';
import internalRoutes from './internal.routes';

type RouterLayer = {
  regexp?: {
    toString: () => string;
  };
};

test('internal routes mount tenant-access test routes', () => {
  const stack = (internalRoutes as unknown as { stack: RouterLayer[] }).stack;
  const mountedRegexes = stack
    .map((layer) => layer.regexp?.toString() ?? '')
    .filter(Boolean);

  assert.ok(
    mountedRegexes.some((value) => value.includes('tenant-access')),
    'Expected /tenant-access mount to be present under internal routes',
  );
});
