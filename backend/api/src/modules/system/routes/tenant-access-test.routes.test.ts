import assert from 'node:assert/strict';
import { test } from 'node:test';
import tenantAccessTestRoutes from './tenant-access-test.routes';

type RouterLayer = {
  route?: {
    path: string;
    methods: Record<string, boolean>;
  };
};

test('tenant access test routes expose the expected internal endpoints', () => {
  const stack = (tenantAccessTestRoutes as unknown as { stack: RouterLayer[] }).stack;
  const routes = stack
    .filter((layer) => layer.route)
    .map((layer) => ({
      path: layer.route?.path ?? '',
      methods: layer.route?.methods ?? {},
    }));

  assert.deepEqual(
    routes.map((route) => ({
      path: route.path,
      methods: Object.keys(route.methods).sort(),
    })),
    [
      {
        path: '/test-records',
        methods: ['post'],
      },
      {
        path: '/vendor/:vendorId/store/:storeId/test-records',
        methods: ['get'],
      },
      {
        path: '/customer/:customerId/test-records',
        methods: ['get'],
      },
      {
        path: '/delivery-agent/:deliveryAgentId/test-records',
        methods: ['get'],
      },
    ],
  );
});
