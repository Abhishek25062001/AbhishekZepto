import assert from 'node:assert/strict';
import { test } from 'node:test';

import { ERROR_CODES } from '../../../errors/error-codes';
import {
  ADMIN_CONTROL_ACTIVE_MODULE,
  ADMIN_CONTROL_SESSION_TYPE,
} from '../constants/admin-control-session.constants';
import {
  adminActionReasonBodyValidator,
  forceAssignAgentBodyValidator,
  orderIdParamValidator,
  slaEscalationBodyValidator,
} from '../validators/admin-control-operation.validator';
import { adminControlLiveQueryValidator } from '../validators/admin-control-live.validator';
import {
  adminControlSessionBodyValidator,
  createAdminControlSessionBodyValidator,
} from '../validators/admin-control-session.validator';
import adminControlRoutes from './admin-control.routes';

const listRoutes = (
  router: typeof adminControlRoutes,
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

test('admin control routes expose session endpoints', () => {
  const routes = listRoutes(adminControlRoutes);

  assert.deepEqual(routes, [
    { path: '/session/start', methods: ['post'], handlers: 2 },
    { path: '/session/end', methods: ['post'], handlers: 2 },
    { path: '/session/heartbeat', methods: ['post'], handlers: 2 },
    { path: '/sessions/active', methods: ['get'], handlers: 1 },
    { path: '/live-overview', methods: ['get'], handlers: 2 },
    { path: '/live-orders', methods: ['get'], handlers: 2 },
    { path: '/live-agents', methods: ['get'], handlers: 2 },
    { path: '/live-stores', methods: ['get'], handlers: 2 },
    { path: '/escalations', methods: ['get'], handlers: 2 },
    { path: '/order/:orderId/force-cancel', methods: ['post'], handlers: 2 },
    { path: '/order/:orderId/force-assign-agent', methods: ['post'], handlers: 2 },
    { path: '/order/:orderId/unassign-agent', methods: ['post'], handlers: 2 },
    { path: '/store/:storeId/force-close', methods: ['post'], handlers: 2 },
    { path: '/store/:storeId/reopen', methods: ['post'], handlers: 2 },
    { path: '/agent/:agentId/force-offline', methods: ['post'], handlers: 2 },
    { path: '/agent/:agentId/restore-online', methods: ['post'], handlers: 2 },
    { path: '/sla/:slaId/escalate', methods: ['post'], handlers: 2 },
  ]);
});

test('create admin control session validator accepts documented payload', () => {
  const parsed = createAdminControlSessionBodyValidator.parse({
    sessionType: ADMIN_CONTROL_SESSION_TYPE.MONITORING,
    cityScope: ['507f1f77bcf86cd799439011'],
    activeModules: [ADMIN_CONTROL_ACTIVE_MODULE.LIVE_OVERVIEW],
  });

  assert.deepEqual(parsed, {
    sessionType: ADMIN_CONTROL_SESSION_TYPE.MONITORING,
    cityScope: ['507f1f77bcf86cd799439011'],
    activeModules: [ADMIN_CONTROL_ACTIVE_MODULE.LIVE_OVERVIEW],
  });
});

test('create admin control session validator rejects missing scope and modules', () => {
  assert.throws(() =>
    createAdminControlSessionBodyValidator.parse({
      sessionType: ADMIN_CONTROL_SESSION_TYPE.MONITORING,
      cityScope: [],
      activeModules: [],
    }),
  );
});

test('admin control session body validator requires sessionId', () => {
  assert.throws(() => adminControlSessionBodyValidator.parse({}));
  assert.deepEqual(
    adminControlSessionBodyValidator.parse({
      sessionId: '507f1f77bcf86cd799439011',
    }),
    { sessionId: '507f1f77bcf86cd799439011' },
  );
});

test('admin control action validators require reason capture', () => {
  assert.throws(() => adminActionReasonBodyValidator.parse({ reason: 'bad' }));
  assert.deepEqual(
    adminActionReasonBodyValidator.parse({ reason: 'Operational override' }),
    { reason: 'Operational override' },
  );
});

test('force assignment validator requires deliveryAgentId', () => {
  assert.throws(() =>
    forceAssignAgentBodyValidator.parse({ reason: 'Manual assignment' }),
  );
  assert.deepEqual(
    forceAssignAgentBodyValidator.parse({
      deliveryAgentId: '507f1f77bcf86cd799439011',
      reason: 'Manual assignment',
    }),
    {
      deliveryAgentId: '507f1f77bcf86cd799439011',
      reason: 'Manual assignment',
    },
  );
});

test('SLA escalation validator defaults escalation level', () => {
  assert.deepEqual(
    slaEscalationBodyValidator.parse({ reason: 'Escalate delayed delivery' }),
    { reason: 'Escalate delayed delivery', escalationLevel: 1 },
  );
});

test('live query validator accepts documented filters', () => {
  const parsed = adminControlLiveQueryValidator.parse({
    cityId: '507f1f77bcf86cd799439011',
    status: 'accepted',
    slaRisk: 'breached',
    storeId: '507f1f77bcf86cd799439012',
  });

  assert.equal(parsed.status, 'accepted');
  assert.equal(parsed.slaRisk, 'breached');
});

test('admin control validation and error codes expose documented boundaries', () => {
  assert.throws(() => orderIdParamValidator.parse({ orderId: 'bad-id' }));
  assert.equal(ERROR_CODES.INVALID_ADMIN_SCOPE, 'INVALID_ADMIN_SCOPE');
  assert.equal(ERROR_CODES.FORCE_ACTION_DENIED, 'FORCE_ACTION_DENIED');
  assert.equal(ERROR_CODES.STORE_ALREADY_CLOSED, 'STORE_ALREADY_CLOSED');
  assert.equal(ERROR_CODES.AGENT_ALREADY_OFFLINE, 'AGENT_ALREADY_OFFLINE');
  assert.equal(ERROR_CODES.ORDER_ALREADY_CANCELLED, 'ORDER_ALREADY_CANCELLED');
});
