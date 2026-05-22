import assert from 'node:assert/strict';
import { test } from 'node:test';

import cartRoutes from './cart.routes';
import {
  addCartItemBodyValidator,
  getCartQueryValidator,
} from '../validators/cart.validators';

type RouterLayer = {
  route?: {
    path: string;
    methods: Record<string, boolean>;
  };
};

const listRoutes = (router: { stack: RouterLayer[] }) =>
  router.stack
    .filter((layer) => layer.route)
    .map((layer) => ({
      path: layer.route?.path ?? '',
      methods: Object.keys(layer.route?.methods ?? {}).sort(),
    }));

const groupRoutesByPath = (routes: { path: string; methods: string[] }[]) => {
  const grouped = new Map<string, Set<string>>();

  for (const route of routes) {
    const methods = grouped.get(route.path) ?? new Set<string>();
    route.methods.forEach((method) => methods.add(method));
    grouped.set(route.path, methods);
  }

  return [...grouped.entries()]
    .map(([path, methods]) => ({ path, methods: [...methods].sort() }))
    .sort((left, right) => left.path.localeCompare(right.path));
};

test('cart routes expose expected endpoints', () => {
  const routes = groupRoutesByPath(
    listRoutes(cartRoutes as unknown as { stack: RouterLayer[] }),
  );

  assert.deepEqual(routes, [
    { path: '/', methods: ['delete', 'get'] },
    { path: '/items', methods: ['post'] },
    { path: '/items/:itemId', methods: ['delete', 'patch'] },
    { path: '/recalculate', methods: ['post'] },
  ]);
});

test('getCartQueryValidator accepts validatePrices', () => {
  const parsed = getCartQueryValidator.parse({
    storeId: '65f0a0000000000000000001',
    validatePrices: 'true',
  });

  assert.equal(parsed.validatePrices, true);
});

test('addCartItemBodyValidator rejects invalid quantity', () => {
  assert.throws(() =>
    addCartItemBodyValidator.parse({
      storeId: '65f0a0000000000000000001',
      variantId: '65f0a0000000000000000002',
      quantity: 0,
    }),
  );
});
