import assert from 'node:assert/strict';
import { test } from 'node:test';
import deliverySlaInternalRoutes from './delivery-sla-internal.routes';

const listRoutes = (
  router: typeof deliverySlaInternalRoutes,
): Array<{ path: string; methods: string[]; handlers: number }> => {
  const stack = (router as unknown as {
    stack: Array<{
      route?: {
        path: string;
        methods: Record<string, boolean>;
        stack: unknown[];
      };
    }>;
  }).stack;

  return stack
    .filter((layer) => layer.route)
    .map((layer) => ({
      path: layer.route!.path,
      methods: Object.keys(layer.route!.methods),
      handlers: layer.route!.stack.length,
    }));
};

test('delivery SLA internal routes expose evaluate endpoint', () => {
  const routes = listRoutes(deliverySlaInternalRoutes);

  assert.deepEqual(routes, [
    { path: '/evaluate', methods: ['post'], handlers: 1 },
  ]);
});
