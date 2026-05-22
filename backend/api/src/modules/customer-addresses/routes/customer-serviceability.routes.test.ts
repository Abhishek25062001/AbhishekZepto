import assert from 'node:assert/strict';
import { test } from 'node:test';

import customerServiceabilityRoutes, {
  customerStoreSelectionRouter,
} from './customer-serviceability.routes';

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

test('serviceability and store-selection routes expose POST handlers', () => {
  assert.deepEqual(
    listRoutes(customerServiceabilityRoutes as unknown as { stack: RouterLayer[] }),
    [{ path: '/', methods: ['post'] }],
  );
  assert.deepEqual(
    listRoutes(customerStoreSelectionRouter as unknown as { stack: RouterLayer[] }),
    [{ path: '/', methods: ['post'] }],
  );
});
