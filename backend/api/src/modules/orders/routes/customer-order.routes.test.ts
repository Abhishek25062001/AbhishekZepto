import assert from 'node:assert/strict';
import { test } from 'node:test';
import customerOrderRoutes from './customer-order.routes';
import storeOrderRoutes from './store-order.routes';
import {
  placeOrderBodyValidator,
  cancelOrderBodyValidator,
  listStoreOrdersQueryValidator,
  rejectStoreOrderBodyValidator,
  storeOrderItemPickingBodyValidator,
} from '../validators/order.validators';

const listRoutes = (
  router: typeof customerOrderRoutes,
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

test('customer order routes expose expected endpoints', () => {
  const routes = listRoutes(customerOrderRoutes);

  assert.deepEqual(routes, [
    { path: '/', methods: ['post'] },
    { path: '/', methods: ['get'] },
    { path: '/:orderId/state', methods: ['get'] },
    { path: '/:orderId/lifecycle', methods: ['get'] },
    { path: '/:orderId/delivery', methods: ['get'] },
    { path: '/:orderId', methods: ['get'] },
    { path: '/:orderId/cancel', methods: ['post'] },
  ]);
});

test('placeOrderBodyValidator requires paymentId', () => {
  assert.throws(() => placeOrderBodyValidator.parse({}));
});

test('store order routes expose accept and reject endpoints', () => {
  const routes = listRoutes(storeOrderRoutes);

  assert.deepEqual(routes, [
    { path: '/', methods: ['get'] },
    { path: '/:orderId', methods: ['get'] },
    { path: '/:orderId/delivery-status', methods: ['get'] },
    { path: '/:orderId/accept', methods: ['post'] },
    { path: '/:orderId/reject', methods: ['post'] },
    { path: '/:orderId/picking/start', methods: ['post'] },
    { path: '/:orderId/items/:itemId/picked', methods: ['post'] },
    { path: '/:orderId/items/:itemId/missing', methods: ['post'] },
    { path: '/:orderId/picking/complete', methods: ['post'] },
    { path: '/:orderId/packing/start', methods: ['post'] },
    { path: '/:orderId/packing/complete', methods: ['post'] },
    { path: '/:orderId/ready-for-pickup', methods: ['post'] },
    { path: '/:orderId/cancel', methods: ['post'] },
  ]);
});

test('listStoreOrdersQueryValidator accepts store order filters', () => {
  assert.deepEqual(
    listStoreOrdersQueryValidator.parse({
      page: '2',
      limit: '10',
      status: 'placed',
      storeStatus: 'pending_acceptance',
      paymentStatus: 'paid',
      slaStatus: 'breached',
      slaBreachedStage: 'acceptance',
    }),
    {
      page: 2,
      limit: 10,
      status: 'placed',
      storeStatus: 'pending_acceptance',
      paymentStatus: 'paid',
      slaStatus: 'breached',
      slaBreachedStage: 'acceptance',
    },
  );
  assert.throws(() => listStoreOrdersQueryValidator.parse({ storeStatus: 'unknown' }));
  assert.throws(() => listStoreOrdersQueryValidator.parse({ slaStatus: 'unknown' }));
});

test('rejectStoreOrderBodyValidator requires a reason', () => {
  assert.throws(() => rejectStoreOrderBodyValidator.parse({}));
  assert.throws(() => rejectStoreOrderBodyValidator.parse({ reason: '   ' }));
  assert.deepEqual(rejectStoreOrderBodyValidator.parse({ reason: 'Out of stock' }), {
    reason: 'Out of stock',
  });
});

test('cancelOrderBodyValidator requires a reason', () => {
  assert.throws(() => cancelOrderBodyValidator.parse({}));
  assert.throws(() => cancelOrderBodyValidator.parse({ reason: '   ' }));
  assert.deepEqual(cancelOrderBodyValidator.parse({ reason: 'Changed plans' }), {
    reason: 'Changed plans',
  });
});

test('storeOrderItemPickingBodyValidator requires positive quantity', () => {
  assert.throws(() => storeOrderItemPickingBodyValidator.parse({}));
  assert.throws(() => storeOrderItemPickingBodyValidator.parse({ quantity: 0 }));
  assert.deepEqual(storeOrderItemPickingBodyValidator.parse({ quantity: 1 }), {
    quantity: 1,
  });
});
