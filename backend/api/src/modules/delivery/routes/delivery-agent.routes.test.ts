/* eslint-disable @typescript-eslint/no-explicit-any */
import assert from 'node:assert/strict';
import { test } from 'node:test';
import deliveryAgentRoutes from './delivery-agent.routes';
import deliveryAgentAdminRoutes from './delivery-agent-admin.routes';
import {
  updateProfileBodySchema,
  adminAgentListQuerySchema,
  agentIdParamSchema,
  updateAvailabilityBodySchema,
} from '../validators/delivery-agent.validators';
import { VEHICLE_TYPE_VALUES } from '../constants/delivery-agent-status.constant';

// ---------------------------------------------------------------------------
// Route inspection helper (matches existing test pattern)
// ---------------------------------------------------------------------------

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

// ---------------------------------------------------------------------------
// Route shape tests
// ---------------------------------------------------------------------------

test('delivery agent routes expose GET /profile and PATCH /profile', () => {
  const routes = listRoutes(deliveryAgentRoutes);

  assert.ok(
    routes.some((r) => r.path === '/profile' && r.methods.includes('get')),
    'GET /profile not found',
  );
  assert.ok(
    routes.some((r) => r.path === '/profile' && r.methods.includes('patch')),
    'PATCH /profile not found',
  );
});

test('delivery agent routes expose PATCH /availability and GET /status (Module 3)', () => {
  const routes = listRoutes(deliveryAgentRoutes);

  assert.ok(
    routes.some((r) => r.path === '/availability' && r.methods.includes('patch')),
    'PATCH /availability not found',
  );
  assert.ok(
    routes.some((r) => r.path === '/status' && r.methods.includes('get')),
    'GET /status not found',
  );
});

test('admin delivery agent routes expose GET / and GET /:agentId', () => {
  const routes = listRoutes(deliveryAgentAdminRoutes);

  assert.ok(
    routes.some((r) => r.path === '/' && r.methods.includes('get')),
    'GET / (agent list) not found',
  );
  assert.ok(
    routes.some((r) => r.path === '/:agentId' && r.methods.includes('get')),
    'GET /:agentId not found',
  );
});

// ---------------------------------------------------------------------------
// Validator tests
// ---------------------------------------------------------------------------

test('updateProfileBodySchema accepts empty body (all fields optional)', () => {
  const result = updateProfileBodySchema.parse({});

  assert.deepEqual(result, {});
});

test('updateProfileBodySchema rejects invalid vehicleType with 422-level error', () => {
  assert.throws(() =>
    updateProfileBodySchema.parse({ vehicleType: 'spaceship' }),
  );
});

test('updateProfileBodySchema accepts valid vehicleType values', () => {
  for (const vt of VEHICLE_TYPE_VALUES) {
    const result = updateProfileBodySchema.parse({ vehicleType: vt });

    assert.equal(result.vehicleType, vt);
  }
});

test('adminAgentListQuerySchema coerces page and limit strings to numbers', () => {
  const result = adminAgentListQuerySchema.parse({ page: '2', limit: '50' });

  assert.equal(result.page, 2);
  assert.equal(result.limit, 50);
});

test('adminAgentListQuerySchema applies defaults page=1 limit=20', () => {
  const result = adminAgentListQuerySchema.parse({});

  assert.equal(result.page, 1);
  assert.equal(result.limit, 20);
});

test('adminAgentListQuerySchema rejects limit > 100', () => {
  assert.throws(() => adminAgentListQuerySchema.parse({ limit: '101' }));
});

test('agentIdParamSchema rejects non-ObjectId agentId', () => {
  assert.throws(() => agentIdParamSchema.parse({ agentId: 'not-an-id' }));
});

test('agentIdParamSchema accepts valid 24-char hex agentId', () => {
  const id = 'a'.repeat(24);
  const result = agentIdParamSchema.parse({ agentId: id });

  assert.equal(result.agentId, id);
});

// ---------------------------------------------------------------------------
// updateAvailabilityBodySchema tests
// ---------------------------------------------------------------------------

test('updateAvailabilityBodySchema accepts valid online/offline values', () => {
  const onlineResult = updateAvailabilityBodySchema.parse({ status: 'online' });
  assert.equal(onlineResult.status, 'online');

  const offlineResult = updateAvailabilityBodySchema.parse({ status: 'offline' });
  assert.equal(offlineResult.status, 'offline');
});

test('updateAvailabilityBodySchema rejects invalid status values', () => {
  assert.throws(() => updateAvailabilityBodySchema.parse({ status: 'something-else' }));
  assert.throws(() => updateAvailabilityBodySchema.parse({ status: '' }));
  assert.throws(() => updateAvailabilityBodySchema.parse({}));
});

// ---------------------------------------------------------------------------
// Composed middleware access control and JWT scenarios tests
// ---------------------------------------------------------------------------

import { Types } from 'mongoose';
import { runAccessControlMiddleware } from '../../../testing/access-control';
import { authenticateDeliveryAgent } from '../middlewares/delivery-agent-auth.middleware';
import { DeliveryAgentModel } from '../models/delivery-agent.model';
import * as authSessionRepositoryModule from '../../auth/repositories/auth-session.repository';
import * as userIdentityRepositoryModule from '../../auth/repositories/user-identity.repository';
import * as roleRepositoryModule from '../../auth/repositories/role.repository';
import * as tokenServiceModule from '../../auth/services/token.service';
import { ERROR_CODES } from '../../../errors/error-codes';
import { HTTP_STATUS } from '../../../utils/http-status';
import { AUTH_ROLE } from '../../auth/constants/auth-role.constants';
import { AUTH_ACCOUNT_STATUS } from '../../auth/constants/auth-status.constants';

const sessionRepository = authSessionRepositoryModule as any;
const userIdentityRepository = userIdentityRepositoryModule as any;
const roleRepository = roleRepositoryModule as any;
const tokenService = tokenServiceModule as any;

const originalFindOne = DeliveryAgentModel.findOne;
const originalFindActiveSessionById = sessionRepository.findActiveSessionById;
const originalFindActiveUserIdentityById = userIdentityRepository.findActiveUserIdentityById;
const originalFindRoleByCode = roleRepository.findRoleByCode;
const originalVerifyAccessToken = tokenService.verifyAccessToken;

const restoreMocks = () => {
  DeliveryAgentModel.findOne = originalFindOne;
  sessionRepository.findActiveSessionById = originalFindActiveSessionById;
  userIdentityRepository.findActiveUserIdentityById = originalFindActiveUserIdentityById;
  roleRepository.findRoleByCode = originalFindRoleByCode;
  tokenService.verifyAccessToken = originalVerifyAccessToken;
};

const runMiddlewareChain = async (
  middlewares: any[],
  req: any,
): Promise<any> => {
  for (const mw of middlewares) {
    const result = await runAccessControlMiddleware(mw, req);
    if (!result.allowed) {
      return result;
    }
  }
  return { allowed: true };
};

test('authenticateDeliveryAgent allows valid session + valid JWT and binds identity to req context', async () => {
  const userId = new Types.ObjectId().toString();
  const sessionId = new Types.ObjectId().toString();
  const agentId = new Types.ObjectId().toString();

  tokenService.verifyAccessToken = () => ({
    userId,
    role: AUTH_ROLE.DELIVERY_AGENT,
    sessionId,
    permissions: [],
    tokenType: 'access',
  });

  sessionRepository.findActiveSessionById = async () => ({
    _id: new Types.ObjectId(sessionId),
    userId: new Types.ObjectId(userId),
    expiresAt: new Date(Date.now() + 60_000),
  });

  userIdentityRepository.findActiveUserIdentityById = async () => ({
    _id: new Types.ObjectId(userId),
    role: AUTH_ROLE.DELIVERY_AGENT,
    permissions: [],
    accountStatus: AUTH_ACCOUNT_STATUS.ACTIVE,
    vendorId: null,
    storeId: null,
    cityId: null,
  });

  roleRepository.findRoleByCode = async () => ({
    permissions: [],
  });

  // Mock Mongoose model findOne
  DeliveryAgentModel.findOne = (() => ({
    _id: new Types.ObjectId(agentId),
    userId: new Types.ObjectId(userId),
    isDeleted: false,
  })) as any;

  const req: any = {
    headers: { authorization: 'Bearer valid-jwt-token' },
  };

  try {
    const result = await runMiddlewareChain(authenticateDeliveryAgent(), req);
    assert.equal(result.allowed, true);
    assert.equal(req.deliveryAgentId, agentId);
    assert.ok(req.deliveryAgent);
  } finally {
    restoreMocks();
  }
});

test('authenticateDeliveryAgent rejects missing or malformed headers with 401', async () => {
  const req: any = {
    headers: {},
  };

  try {
    const result = await runMiddlewareChain(authenticateDeliveryAgent(), req);
    assert.equal(result.allowed, false);
    assert.equal(result.errorCode, ERROR_CODES.UNAUTHORIZED);
    assert.equal(result.statusCode, HTTP_STATUS.UNAUTHORIZED);
  } finally {
    restoreMocks();
  }
});

test('authenticateDeliveryAgent rejects revoked or expired sessions with 401', async () => {
  const userId = new Types.ObjectId().toString();
  const sessionId = new Types.ObjectId().toString();

  tokenService.verifyAccessToken = () => ({
    userId,
    role: AUTH_ROLE.DELIVERY_AGENT,
    sessionId,
    permissions: [],
    tokenType: 'access',
  });

  // Return null for revoked session
  sessionRepository.findActiveSessionById = async () => null;

  userIdentityRepository.findActiveUserIdentityById = async () => ({
    _id: new Types.ObjectId(userId),
    role: AUTH_ROLE.DELIVERY_AGENT,
    permissions: [],
    accountStatus: AUTH_ACCOUNT_STATUS.ACTIVE,
  });

  const req: any = {
    headers: { authorization: 'Bearer revoked-token' },
  };

  try {
    const result = await runMiddlewareChain(authenticateDeliveryAgent(), req);
    assert.equal(result.allowed, false);
    assert.equal(result.errorCode, ERROR_CODES.SESSION_REVOKED);
    assert.equal(result.statusCode, HTTP_STATUS.UNAUTHORIZED);
  } finally {
    restoreMocks();
  }
});

test('authenticateDeliveryAgent rejects valid JWT but unlinked DeliveryAgent user with 404', async () => {
  const userId = new Types.ObjectId().toString();
  const sessionId = new Types.ObjectId().toString();

  tokenService.verifyAccessToken = () => ({
    userId,
    role: AUTH_ROLE.DELIVERY_AGENT,
    sessionId,
    permissions: [],
    tokenType: 'access',
  });

  sessionRepository.findActiveSessionById = async () => ({
    _id: new Types.ObjectId(sessionId),
    userId: new Types.ObjectId(userId),
    expiresAt: new Date(Date.now() + 60_000),
  });

  userIdentityRepository.findActiveUserIdentityById = async () => ({
    _id: new Types.ObjectId(userId),
    role: AUTH_ROLE.DELIVERY_AGENT,
    permissions: [],
    accountStatus: AUTH_ACCOUNT_STATUS.ACTIVE,
  });

  roleRepository.findRoleByCode = async () => ({
    permissions: [],
  });

  // Delivery agent record not found
  DeliveryAgentModel.findOne = (() => null) as any;

  const req: any = {
    headers: { authorization: 'Bearer valid-jwt-unlinked' },
  };

  try {
    const result = await runMiddlewareChain(authenticateDeliveryAgent(), req);
    assert.equal(result.allowed, false);
    assert.equal(result.errorCode, ERROR_CODES.DELIVERY_AGENT_NOT_FOUND);
    assert.equal(result.statusCode, HTTP_STATUS.NOT_FOUND);
  } finally {
    restoreMocks();
  }
});

