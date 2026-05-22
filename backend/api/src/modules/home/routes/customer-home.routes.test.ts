import assert from 'node:assert/strict';
import { test } from 'node:test';

import customerHomeRoutes from './customer-home.routes';
import { customerHomeQueryValidator } from '../validators/customer-home.validators';

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

test('customer home routes expose GET /', () => {
  const routes = listRoutes(customerHomeRoutes as unknown as { stack: RouterLayer[] });
  assert.deepEqual(routes, [{ path: '/', methods: ['get'] }]);
});

test('customerHomeQueryValidator requires storeId', () => {
  assert.throws(() => customerHomeQueryValidator.parse({}));
});
