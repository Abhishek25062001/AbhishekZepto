import assert from 'node:assert/strict';
import { test } from 'node:test';
import customerProfileRoutes from './customer-profile.routes';
import { updateProfileBodyValidator } from '../validators/profile.validators';

const listRoutes = (
  router: typeof customerProfileRoutes,
): Array<{ path: string; methods: string[] }> => {
  const stack = (
    router as unknown as {
      stack: Array<{ route?: { path: string; methods: Record<string, boolean> } }>;
    }
  ).stack;

  return stack
    .filter((layer) => layer.route)
    .map((layer) => ({
      path: layer.route!.path,
      methods: Object.keys(layer.route!.methods),
    }));
};

test('customer profile routes expose expected endpoints', () => {
  const routes = listRoutes(customerProfileRoutes);

  assert.deepEqual(routes, [
    { path: '/', methods: ['get'] },
    { path: '/', methods: ['patch'] },
  ]);
});

test('updateProfileBodyValidator requires at least one field', () => {
  assert.throws(() => updateProfileBodyValidator.parse({}));
});

test('updateProfileBodyValidator accepts valid email', () => {
  const parsed = updateProfileBodyValidator.parse({ email: 'user@example.com' });
  assert.equal(parsed.email, 'user@example.com');
});

test('updateProfileBodyValidator rejects invalid email', () => {
  assert.throws(() => updateProfileBodyValidator.parse({ email: 'not-an-email' }));
});
