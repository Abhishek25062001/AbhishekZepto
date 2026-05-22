import assert from 'node:assert/strict';
import { test } from 'node:test';

import customerAddressRoutes from './customer-address.routes';

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

test('customer address routes expose CRUD and set-default', () => {
  const routes = listRoutes(customerAddressRoutes as unknown as { stack: RouterLayer[] });

  assert.deepEqual(routes, [
    { path: '/', methods: ['get'] },
    { path: '/', methods: ['post'] },
    { path: '/:addressId', methods: ['patch'] },
    { path: '/:addressId', methods: ['delete'] },
    { path: '/:addressId/set-default', methods: ['post'] },
  ]);
});
