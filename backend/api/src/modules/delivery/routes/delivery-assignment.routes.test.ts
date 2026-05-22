import assert from 'node:assert/strict';
import { test } from 'node:test';
import deliveryAssignmentAdminRoutes from './delivery-assignment-admin.routes';
import deliveryAgentRoutes from './delivery-agent.routes';
import {
  dispatchParamSchema,
  pendingListQuerySchema,
  assignmentParamSchema,
  pickedUpBodySchema,
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

