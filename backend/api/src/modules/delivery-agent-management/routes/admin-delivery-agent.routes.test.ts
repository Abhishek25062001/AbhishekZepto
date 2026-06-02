import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { test } from 'node:test';

import { ADMIN_ACTION_TYPE } from '../../admin-control/constants/admin-action-types';
import { DELIVERY_AGENT_MANAGEMENT_PERMISSION_GROUPS } from '../constants/admin-delivery-agent-permissions.constants';
import {
  deliveryAgentIdParamValidator,
  listDeliveryAgentAssignmentsQueryValidator,
  listDeliveryAgentAuditQueryValidator,
  listDeliveryAgentsQueryValidator,
  updateDeliveryAgentStatusValidator,
  updateDeliveryAgentVerificationValidator,
} from '../validators/admin-delivery-agent.validator';

const source = (): string => readFileSync(
  resolve(process.cwd(), 'backend/api/src/modules/delivery-agent-management/routes/admin-delivery-agent.routes.ts'),
  'utf8',
);

test('delivery agent management routes expose list and detail endpoints', () => {
  const routeSource = source();
  assert.match(routeSource, /router\.get\('\/'/);
  assert.match(routeSource, /router\.get\('\/:deliveryAgentId'/);
  assert.match(routeSource, /router\.get\('\/:deliveryAgentId\/assignments'/);
  assert.match(routeSource, /router\.get\('\/:deliveryAgentId\/audit'/);
  assert.match(routeSource, /router\.patch\('\/:deliveryAgentId\/status'/);
  assert.match(routeSource, /router\.patch\('\/:deliveryAgentId\/verification'/);
});

test('delivery agent management routes are permission-gated', () => {
  const routeSource = source();
  assert.match(routeSource, /requireAnyPermission\(DELIVERY_AGENT_MANAGEMENT_PERMISSION_GROUPS\.READ\)/);
  assert.match(routeSource, /requireAnyPermission\(DELIVERY_AGENT_MANAGEMENT_PERMISSION_GROUPS\.STATUS\)/);
  assert.match(routeSource, /requireAnyPermission\(DELIVERY_AGENT_MANAGEMENT_PERMISSION_GROUPS\.VERIFICATION\)/);
  assert.match(routeSource, /requireAnyPermission\(DELIVERY_AGENT_MANAGEMENT_PERMISSION_GROUPS\.AUDIT\)/);
  assert.deepEqual(DELIVERY_AGENT_MANAGEMENT_PERMISSION_GROUPS.READ, ['delivery:read', 'settings:manage']);
  assert.deepEqual(DELIVERY_AGENT_MANAGEMENT_PERMISSION_GROUPS.STATUS, [
    'delivery:update-status',
    'settings:manage',
  ]);
  assert.deepEqual(DELIVERY_AGENT_MANAGEMENT_PERMISSION_GROUPS.VERIFICATION, [
    'delivery:update',
    'settings:manage',
  ]);
});

test('delivery agent management validators accept pagination and reject invalid ids', () => {
  assert.throws(() => deliveryAgentIdParamValidator.params.parse({ deliveryAgentId: 'bad-id' }));
  const parsed = listDeliveryAgentsQueryValidator.query.parse({
    status: 'active',
    availabilityStatus: 'online',
    verificationStatus: 'verified',
    cityId: '507f1f77bcf86cd799439011',
    search: 'DA+01',
    page: '2',
    limit: '10',
  });

  assert.equal(parsed.status, 'active');
  assert.equal(parsed.availabilityStatus, 'online');
  assert.equal(parsed.verificationStatus, 'verified');
  assert.equal(parsed.cityId, '507f1f77bcf86cd799439011');
  assert.equal(parsed.search, 'DA+01');
  assert.equal(parsed.page, 2);
  assert.equal(parsed.limit, 10);
  assert.throws(() => listDeliveryAgentsQueryValidator.query.parse({ status: 'deleted' }));
  assert.throws(() => listDeliveryAgentsQueryValidator.query.parse({ verificationStatus: 'pending' }));
});

test('delivery agent management controllers pass admin city scope to services', () => {
  const controllerSource = readFileSync(
    resolve(process.cwd(), 'backend/api/src/modules/delivery-agent-management/controllers/admin-delivery-agent.controller.ts'),
    'utf8',
  );

  assert.match(controllerSource, /actorCityId: req\.user\?\.cityId \?\? null/);
  assert.match(controllerSource, /getDeliveryAgentForAdmin\(deliveryAgentId, req\.user\?\.cityId \?\? null\)/);
});

test('delivery agent assignment and audit validators remain read-only list filters', () => {
  const assignmentFilters = listDeliveryAgentAssignmentsQueryValidator.query.parse({
    status: 'assigned',
    fromDate: '2026-01-01T00:00:00.000Z',
    toDate: '2026-01-31T23:59:59.000Z',
    page: '3',
    limit: '25',
  });
  const auditFilters = listDeliveryAgentAuditQueryValidator.query.parse({
    page: '2',
    limit: '10',
  });

  assert.equal(assignmentFilters.status, 'assigned');
  assert.equal(assignmentFilters.fromDate?.toISOString(), '2026-01-01T00:00:00.000Z');
  assert.equal(assignmentFilters.toDate?.toISOString(), '2026-01-31T23:59:59.000Z');
  assert.equal(assignmentFilters.page, 3);
  assert.equal(assignmentFilters.limit, 25);
  assert.equal(auditFilters.page, 2);
  assert.equal(auditFilters.limit, 10);
  assert.throws(() => listDeliveryAgentAssignmentsQueryValidator.query.parse({ status: 'reassigned' }));
});

test('delivery agent status and verification validators require reason capture', () => {
  assert.throws(() => updateDeliveryAgentStatusValidator.body.parse({ status: 'inactive' }));
  assert.throws(() => updateDeliveryAgentVerificationValidator.body.parse({ verificationStatus: 'verified' }));
  assert.equal(
    updateDeliveryAgentStatusValidator.body.parse({ status: 'inactive', reason: 'Compliance review' }).reason,
    'Compliance review',
  );
  assert.equal(
    updateDeliveryAgentVerificationValidator.body.parse({
      verificationStatus: 'unverified',
      reason: 'Document mismatch',
    }).verificationStatus,
    'unverified',
  );
});

test('delivery agent status and verification audit action types are registered', () => {
  assert.equal(
    ADMIN_ACTION_TYPE.DELIVERY_AGENT_STATUS_CHANGED,
    'DELIVERY_AGENT_STATUS_CHANGED',
  );
  assert.equal(
    ADMIN_ACTION_TYPE.DELIVERY_AGENT_VERIFICATION_CHANGED,
    'DELIVERY_AGENT_VERIFICATION_CHANGED',
  );
});
