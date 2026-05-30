import assert from 'node:assert/strict';
import { test } from 'node:test';
import deliveryAssignmentAdminRoutes from './delivery-assignment-admin.routes';
import deliveryAgentRoutes from './delivery-agent.routes';
import {
  dispatchParamSchema,
  pendingListQuerySchema,
  assignmentParamSchema,
  pickedUpBodySchema,
  deliveredBodySchema,
  failedBodySchema,
  adminDeliveryListQuerySchema,
  deliveryIdParamSchema,
  adminOverrideBodySchema,
} from '../validators/delivery-assignment.validators';

// Route inspection helper
type RouterLike = {
  stack: Array<{ route?: { path: string; methods: Record<string, boolean> } }>;
};

const listRoutes = (
  router: unknown,
): Array<{ path: string; methods: string[] }> => {
  const stack = (router as RouterLike).stack;

  return stack
    .filter((layer) => layer.route)
    .map((layer) => ({
      path: layer.route!.path,
      methods: Object.keys(layer.route!.methods),
    }));
};

test('admin delivery assignment routes expose GET /pending and POST /:deliveryId/dispatch', () => {
  const routes = listRoutes(deliveryAssignmentAdminRoutes);

  assert.ok(
    routes.some((r) => r.path === '/pending' && r.methods.includes('get')),
    'GET /pending not found',
  );
  assert.ok(
    routes.some((r) => r.path === '/:deliveryId/dispatch' && r.methods.includes('post')),
    'POST /:deliveryId/dispatch not found',
  );
});

test('delivery agent routes expose POST /assignments/:assignmentId/arrived-at-store and POST /assignments/:assignmentId/picked-up', () => {
  const routes = listRoutes(deliveryAgentRoutes);

  assert.ok(
    routes.some((r) => r.path === '/assignments/:assignmentId/arrived-at-store' && r.methods.includes('post')),
    'POST /assignments/:assignmentId/arrived-at-store not found',
  );
  assert.ok(
    routes.some((r) => r.path === '/assignments/:assignmentId/picked-up' && r.methods.includes('post')),
    'POST /assignments/:assignmentId/picked-up not found',
  );
});

test('dispatchParamSchema accepts a valid MongoDB ObjectId', () => {
  const validId = '507f1f77bcf86cd799439011';
  const result = dispatchParamSchema.parse({ deliveryId: validId });
  assert.equal(result.deliveryId, validId);
});

test('dispatchParamSchema rejects an invalid MongoDB ObjectId', () => {
  assert.throws(() =>
    dispatchParamSchema.parse({ deliveryId: 'invalid-id' }),
  );
});

test('pendingListQuerySchema accepts optional valid cityId', () => {
  const resultEmpty = pendingListQuerySchema.parse({});
  assert.deepEqual(resultEmpty, {});

  const validId = '507f1f77bcf86cd799439011';
  const resultWithCity = pendingListQuerySchema.parse({ cityId: validId });
  assert.equal(resultWithCity.cityId, validId);
});

test('pendingListQuerySchema rejects invalid cityId', () => {
  assert.throws(() =>
    pendingListQuerySchema.parse({ cityId: 'invalid-city-id' }),
  );
});

test('assignmentParamSchema accepts a valid MongoDB ObjectId', () => {
  const validId = '507f1f77bcf86cd799439011';
  const result = assignmentParamSchema.parse({ assignmentId: validId });
  assert.equal(result.assignmentId, validId);
});

test('assignmentParamSchema rejects an invalid MongoDB ObjectId', () => {
  assert.throws(() =>
    assignmentParamSchema.parse({ assignmentId: 'invalid-id' }),
  );
});

test('pickedUpBodySchema accepts a valid pickup confirmation payload', () => {
  const result = pickedUpBodySchema.parse({
    verificationMethod: 'otp',
    verificationValue: '123456',
    notes: 'verified with customer otp',
  });
  assert.equal(result?.verificationMethod, 'otp');
  assert.equal(result?.verificationValue, '123456');
  assert.equal(result?.notes, 'verified with customer otp');
});

test('pickedUpBodySchema accepts empty/optional fields', () => {
  const resultEmpty = pickedUpBodySchema.parse({});
  assert.deepEqual(resultEmpty, {});

  const resultUndefined = pickedUpBodySchema.parse(undefined);
  assert.equal(resultUndefined, undefined);
});

test('pickedUpBodySchema rejects invalid verificationMethod', () => {
  assert.throws(() =>
    pickedUpBodySchema.parse({
      verificationMethod: 'invalid-method',
    }),
  );
});

test('delivery agent routes expose POST /assignments/:assignmentId/en-route-to-customer', () => {
  const routes = listRoutes(deliveryAgentRoutes);

  assert.ok(
    routes.some((r) => r.path === '/assignments/:assignmentId/en-route-to-customer' && r.methods.includes('post')),
    'POST /assignments/:assignmentId/en-route-to-customer not found in router',
  );
});

test('delivery agent routes expose POST /assignments/:assignmentId/arrived-at-customer', () => {
  const routes = listRoutes(deliveryAgentRoutes);

  assert.ok(
    routes.some((r) => r.path === '/assignments/:assignmentId/arrived-at-customer' && r.methods.includes('post')),
    'POST /assignments/:assignmentId/arrived-at-customer not found in router',
  );
});

test('en-route-to-customer route rejects malformed assignmentId via assignmentParamSchema', () => {
  assert.throws(() =>
    assignmentParamSchema.parse({ assignmentId: 'not-a-mongo-id' }),
  );
});

test('arrived-at-customer route rejects malformed assignmentId via assignmentParamSchema', () => {
  assert.throws(() =>
    assignmentParamSchema.parse({ assignmentId: 'bad-id-value' }),
  );
});

test('delivery agent routes expose POST /assignments/:assignmentId/delivered', () => {
  const routes = listRoutes(deliveryAgentRoutes);

  assert.ok(
    routes.some((r) => r.path === '/assignments/:assignmentId/delivered' && r.methods.includes('post')),
    'POST /assignments/:assignmentId/delivered not found in router',
  );
});

test('delivery agent routes expose POST /assignments/:assignmentId/failed', () => {
  const routes = listRoutes(deliveryAgentRoutes);

  assert.ok(
    routes.some((r) => r.path === '/assignments/:assignmentId/failed' && r.methods.includes('post')),
    'POST /assignments/:assignmentId/failed not found in router',
  );
});

test('deliveredBodySchema accepts a valid delivered verification payload', () => {
  const result = deliveredBodySchema.parse({
    verificationMethod: 'photo',
    verificationValue: 'http://example.com/handover.jpg',
    notes: 'left at front door',
  });
  assert.equal(result?.verificationMethod, 'photo');
  assert.equal(result?.verificationValue, 'http://example.com/handover.jpg');
  assert.equal(result?.notes, 'left at front door');
});

test('deliveredBodySchema accepts empty/optional fields', () => {
  const resultEmpty = deliveredBodySchema.parse({});
  assert.deepEqual(resultEmpty, {});

  const resultUndefined = deliveredBodySchema.parse(undefined);
  assert.equal(resultUndefined, undefined);
});

test('deliveredBodySchema rejects invalid verificationMethod', () => {
  assert.throws(() =>
    deliveredBodySchema.parse({
      verificationMethod: 'invalid-method',
    }),
  );
});

test('failedBodySchema accepts a valid failureReason payload', () => {
  const result = failedBodySchema.parse({
    failureReason: 'Gate locked, customer unresponsive',
  });
  assert.equal(result.failureReason, 'Gate locked, customer unresponsive');
});

test('failedBodySchema rejects empty failureReason', () => {
  assert.throws(() =>
    failedBodySchema.parse({
      failureReason: '',
    }),
  );
  assert.throws(() =>
    failedBodySchema.parse({
      failureReason: '    ',
    }),
  );
});

test('failedBodySchema rejects missing failureReason', () => {
  assert.throws(() =>
    failedBodySchema.parse({}),
  );
});

// ---------------------------------------------------------------------------
// Module 15 — Admin Delivery Operations Route & Validator Tests
// ---------------------------------------------------------------------------

test('admin delivery routes expose GET / (list all deliveries)', () => {
  const routes = listRoutes(deliveryAssignmentAdminRoutes);

  assert.ok(
    routes.some((r) => r.path === '/' && r.methods.includes('get')),
    'GET / (list all deliveries) not found in admin delivery router',
  );
});

test('admin delivery routes expose GET /:deliveryId (detail)', () => {
  const routes = listRoutes(deliveryAssignmentAdminRoutes);

  assert.ok(
    routes.some((r) => r.path === '/:deliveryId' && r.methods.includes('get')),
    'GET /:deliveryId not found in admin delivery router',
  );
});

test('admin delivery routes expose POST /:deliveryId/override', () => {
  const routes = listRoutes(deliveryAssignmentAdminRoutes);

  assert.ok(
    routes.some((r) => r.path === '/:deliveryId/override' && r.methods.includes('post')),
    'POST /:deliveryId/override not found in admin delivery router',
  );
});

test('/pending route is registered before /:deliveryId (route ordering guard)', () => {
  const routes = listRoutes(deliveryAssignmentAdminRoutes);
  const pendingIdx = routes.findIndex((r) => r.path === '/pending');
  const detailIdx = routes.findIndex((r) => r.path === '/:deliveryId');
  assert.ok(pendingIdx < detailIdx, '/pending must come before /:deliveryId to avoid route shadowing');
});

test('deliveryIdParamSchema accepts a valid MongoDB ObjectId', () => {
  const validId = '507f1f77bcf86cd799439011';
  const result = deliveryIdParamSchema.parse({ deliveryId: validId });
  assert.equal(result.deliveryId, validId);
});

test('deliveryIdParamSchema rejects an invalid MongoDB ObjectId', () => {
  assert.throws(() =>
    deliveryIdParamSchema.parse({ deliveryId: 'not-a-valid-id' }),
  );
});

test('adminDeliveryListQuerySchema accepts no filters (all optional)', () => {
  const result = adminDeliveryListQuerySchema.parse({});
  assert.equal(result.page, 1);
  assert.equal(result.limit, 20);
  assert.equal(result.status, undefined);
});

test('adminDeliveryListQuerySchema accepts valid status filter', () => {
  const result = adminDeliveryListQuerySchema.parse({ status: 'pending_assignment' });
  assert.equal(result.status, 'pending_assignment');
});

test('adminDeliveryListQuerySchema rejects invalid status value', () => {
  assert.throws(() =>
    adminDeliveryListQuerySchema.parse({ status: 'invalid-status-value' }),
  );
});

test('adminDeliveryListQuerySchema rejects limit > 100', () => {
  assert.throws(() =>
    adminDeliveryListQuerySchema.parse({ limit: 200 }),
  );
});

test('adminOverrideBodySchema accepts cancelled with a valid reason', () => {
  const result = adminOverrideBodySchema.parse({ targetStatus: 'cancelled', reason: 'Admin cancelled per ops request' });
  assert.equal(result.targetStatus, 'cancelled');
  assert.equal(result.reason, 'Admin cancelled per ops request');
});

test('adminOverrideBodySchema accepts failed with a valid reason', () => {
  const result = adminOverrideBodySchema.parse({ targetStatus: 'failed', reason: 'Rider unresponsive for 30 minutes' });
  assert.equal(result.targetStatus, 'failed');
});

test('adminOverrideBodySchema rejects targetStatus other than cancelled/failed', () => {
  assert.throws(() =>
    adminOverrideBodySchema.parse({ targetStatus: 'delivered', reason: 'Admin override' }),
  );
});

test('adminOverrideBodySchema rejects reason shorter than 5 characters', () => {
  assert.throws(() =>
    adminOverrideBodySchema.parse({ targetStatus: 'cancelled', reason: 'OK' }),
  );
});

test('adminOverrideBodySchema rejects missing reason', () => {
  assert.throws(() =>
    adminOverrideBodySchema.parse({ targetStatus: 'failed' }),
  );
});
