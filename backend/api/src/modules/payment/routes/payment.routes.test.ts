import assert from 'node:assert/strict';
import { test } from 'node:test';
import paymentRoutes from './payment.routes';
import {
  createPaymentOrderBodyValidator,
  paymentIdParamsValidator,
  verifyPaymentBodyValidator,
  verifyPaymentByIdBodyValidator,
} from '../validators/payment.validators';

const listRoutes = (
  router: typeof paymentRoutes,
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

test('payment routes expose expected endpoints', () => {
  const routes = listRoutes(paymentRoutes);

  assert.deepEqual(routes, [
    { path: '/create-order', methods: ['post'] },
    { path: '/verify', methods: ['post'] },
    { path: '/:paymentId/verify', methods: ['post'] },
    { path: '/:paymentId', methods: ['get'] },
  ]);
});

test('createPaymentOrderBodyValidator requires checkoutSessionId and idempotencyKey', () => {
  assert.throws(() => createPaymentOrderBodyValidator.parse({}));
});

test('verifyPaymentBodyValidator requires payment fields', () => {
  assert.throws(() => verifyPaymentBodyValidator.parse({ paymentId: '65f0a0000000000000000001' }));
});

test('verifyPaymentByIdBodyValidator accepts gateway field names', () => {
  const parsed = verifyPaymentByIdBodyValidator.parse({
    gatewayOrderId: 'order_1',
    gatewayPaymentId: 'pay_1',
    gatewaySignature: 'sig_1',
  });

  assert.equal(parsed.gatewayOrderId, 'order_1');
});

test('paymentIdParamsValidator requires valid ObjectId', () => {
  assert.throws(() => paymentIdParamsValidator.parse({ paymentId: 'bad-id' }));
});
