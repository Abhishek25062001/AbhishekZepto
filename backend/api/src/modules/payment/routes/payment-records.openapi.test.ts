import assert from 'node:assert/strict';
import { test } from 'node:test';
import { openApiDocument } from '../../../docs/openapi';

test('OpenAPI document includes payment records admin finance paths', () => {
  const paths = openApiDocument.paths as Record<string, unknown>;

  assert.ok(paths['/admin/finance/payments']);
  assert.ok(paths['/admin/finance/payments/{paymentId}']);
  assert.ok(paths['/customer/payments/{paymentId}']);
  assert.ok(paths['/public/webhooks/payments/razorpay']);
});
