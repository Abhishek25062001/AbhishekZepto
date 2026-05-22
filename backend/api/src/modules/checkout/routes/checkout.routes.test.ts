import assert from 'node:assert/strict';
import { test } from 'node:test';
import checkoutRoutes from './checkout.routes';
import {
  cancelCheckoutBodyValidator,
  initiateCheckoutBodyValidator,
} from '../validators/checkout.validators';

const listRoutes = (
  router: typeof checkoutRoutes,
): Array<{ path: string; methods: string[] }> => {
  const stack = (router as unknown as { stack: Array<{ route?: { path: string; methods: Record<string, boolean> } }> })
    .stack;

  return stack
    .filter((layer) => layer.route)
    .map((layer) => ({
      path: layer.route!.path,
      methods: Object.keys(layer.route!.methods),
    }));
};

test('checkout routes expose expected endpoints', () => {
  const routes = listRoutes(checkoutRoutes);

  assert.deepEqual(routes, [
    { path: '/initiate', methods: ['post'] },
    { path: '/summary', methods: ['get'] },
    { path: '/cancel', methods: ['post'] },
  ]);
});

test('initiateCheckoutBodyValidator requires addressId', () => {
  assert.throws(() => initiateCheckoutBodyValidator.parse({}));
});

test('cancelCheckoutBodyValidator requires checkoutSessionId', () => {
  assert.throws(() => cancelCheckoutBodyValidator.parse({}));
});
