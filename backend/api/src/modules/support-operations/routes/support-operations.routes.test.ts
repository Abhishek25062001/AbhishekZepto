import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { test } from 'node:test';

import { COLLECTION_NAMES } from '../../../database/constants/collection-names.constants';
import { ERROR_CODES } from '../../../errors/error-codes';
import { SUPPORT_OPERATIONS_PERMISSION_CODES } from '../constants/support-operations-permissions.constants';
import {
  SUPPORT_TICKET_CATEGORY,
  SUPPORT_TICKET_PRIORITY,
  SUPPORT_TICKET_STATUS,
} from '../constants/support-ticket.constants';
import { buildSupportTicketNumber } from '../repositories/support-ticket.repository';
import {
  createSupportTicketValidator,
  listSupportTicketsQueryValidator,
  supportTicketIdParamValidator,
  updateSupportTicketAssignmentValidator,
  updateSupportTicketPriorityValidator,
  updateSupportTicketStatusValidator,
} from '../validators/support-ticket.validator';

const routeSource = (): string => readFileSync(
  resolve(process.cwd(), 'backend/api/src/modules/support-operations/routes/support-operations.routes.ts'),
  'utf8',
);

test('support operations foundation registers collections and error codes', () => {
  assert.equal(COLLECTION_NAMES.SUPPORT_TICKETS, 'support_tickets');
  assert.equal(COLLECTION_NAMES.SUPPORT_TICKET_NOTES, 'support_ticket_notes');
  assert.equal(ERROR_CODES.SUPPORT_TICKET_NOT_FOUND, 'SUPPORT_TICKET_NOT_FOUND');
  assert.equal(
    ERROR_CODES.SUPPORT_TICKET_INVALID_STATUS_TRANSITION,
    'SUPPORT_TICKET_INVALID_STATUS_TRANSITION',
  );
  assert.equal(ERROR_CODES.SUPPORT_TICKET_SCOPE_DENIED, 'SUPPORT_TICKET_SCOPE_DENIED');
  assert.equal(ERROR_CODES.SUPPORT_TICKET_ASSIGNMENT_INVALID, 'SUPPORT_TICKET_ASSIGNMENT_INVALID');
});

test('support operations permission codes use support resource', () => {
  assert.equal(SUPPORT_OPERATIONS_PERMISSION_CODES.READ, 'support:read');
  assert.equal(SUPPORT_OPERATIONS_PERMISSION_CODES.CREATE, 'support:create');
  assert.equal(SUPPORT_OPERATIONS_PERMISSION_CODES.UPDATE, 'support:update');
  assert.equal(SUPPORT_OPERATIONS_PERMISSION_CODES.ASSIGN, 'support:assign');
});

test('admin support routes are mounted behind admin route group', () => {
  const adminRoutesSource = readFileSync(
    resolve(process.cwd(), 'backend/api/src/routes/v1/admin.routes.ts'),
    'utf8',
  );

  assert.match(adminRoutesSource, /supportOperationsRoutes/);
  assert.match(adminRoutesSource, /router\.use\('\/support', authenticate\(\), requireRole\(adminRoles\), supportOperationsRoutes\)/);
});

test('support ticket validators accept documented filters and reject invalid ids', () => {
  assert.throws(() => supportTicketIdParamValidator.params.parse({ ticketId: 'bad-id' }));
  const parsed = listSupportTicketsQueryValidator.query.parse({
    status: SUPPORT_TICKET_STATUS.OPEN,
    priority: SUPPORT_TICKET_PRIORITY.HIGH,
    category: SUPPORT_TICKET_CATEGORY.ORDER,
    customerId: '507f1f77bcf86cd799439011',
    orderId: '507f1f77bcf86cd799439012',
    assignedAdminId: '507f1f77bcf86cd799439013',
    search: 'late order',
    page: '2',
    limit: '25',
  });

  assert.equal(parsed.page, 2);
  assert.equal(parsed.limit, 25);
  assert.equal(parsed.search, 'late order');
});

test('support ticket mutation validators require reason capture where needed', () => {
  assert.throws(() => updateSupportTicketStatusValidator.body.parse({ status: 'closed' }));
  assert.throws(() => updateSupportTicketPriorityValidator.body.parse({ priority: 'urgent' }));
  assert.throws(() => updateSupportTicketAssignmentValidator.body.parse({ assignedAdminId: null }));
  assert.equal(
    updateSupportTicketStatusValidator.body.parse({
      status: 'in_progress',
      reason: 'Started support review',
    }).status,
    'in_progress',
  );
});

test('create support ticket validator keeps support context bounded', () => {
  const parsed = createSupportTicketValidator.body.parse({
    customerId: '507f1f77bcf86cd799439011',
    subject: 'Delayed order',
    description: 'Customer reported a delayed order',
    category: 'order',
    tags: ['delay'],
  });

  assert.equal(parsed.priority, 'medium');
  assert.deepEqual(parsed.tags, ['delay']);
});

test('support ticket number helper uses documented prefix', () => {
  assert.match(buildSupportTicketNumber(new Date('2026-06-01T00:00:00.000Z')), /^SUP-20260601-[A-Z0-9]{6}$/);
});

test('support operations create list and detail routes are exposed', () => {
  const source = routeSource();
  assert.match(source, /router\.post\('\/tickets'/);
  assert.match(source, /router\.get\('\/tickets'/);
  assert.match(source, /router\.get\('\/tickets\/:ticketId'/);
  assert.match(source, /SUPPORT_OPERATIONS_PERMISSION_GROUPS\.CREATE/);
  assert.match(source, /SUPPORT_OPERATIONS_PERMISSION_GROUPS\.READ/);
});

test('support operations status and priority routes are exposed', async () => {
  const source = routeSource();
  assert.match(source, /router\.patch\('\/tickets\/:ticketId\/status'/);
  assert.match(source, /router\.patch\('\/tickets\/:ticketId\/priority'/);
  assert.match(source, /SUPPORT_OPERATIONS_PERMISSION_GROUPS\.UPDATE/);
  const { ADMIN_ACTION_TYPE } = await import('../../admin-control/constants/admin-action-types');
  assert.equal(ADMIN_ACTION_TYPE.SUPPORT_TICKET_STATUS_CHANGED, 'SUPPORT_TICKET_STATUS_CHANGED');
  assert.equal(ADMIN_ACTION_TYPE.SUPPORT_TICKET_PRIORITY_CHANGED, 'SUPPORT_TICKET_PRIORITY_CHANGED');
});

test('support operations assignment route is exposed', async () => {
  const source = routeSource();
  assert.match(source, /router\.patch\('\/tickets\/:ticketId\/assignment'/);
  assert.match(source, /SUPPORT_OPERATIONS_PERMISSION_GROUPS\.ASSIGN/);
  const { ADMIN_ACTION_TYPE } = await import('../../admin-control/constants/admin-action-types');
  assert.equal(ADMIN_ACTION_TYPE.SUPPORT_TICKET_ASSIGNED, 'SUPPORT_TICKET_ASSIGNED');
});

test('support operations notes routes are exposed', async () => {
  const source = routeSource();
  assert.match(source, /router\.get\('\/tickets\/:ticketId\/notes'/);
  assert.match(source, /router\.post\('\/tickets\/:ticketId\/notes'/);
  assert.match(source, /createSupportTicketNoteValidator/);
  const { ADMIN_ACTION_TYPE } = await import('../../admin-control/constants/admin-action-types');
  assert.equal(ADMIN_ACTION_TYPE.SUPPORT_TICKET_NOTE_CREATED, 'SUPPORT_TICKET_NOTE_CREATED');
});

test('support operations audit route is exposed as read-only', () => {
  const source = routeSource();
  assert.match(source, /router\.get\('\/tickets\/:ticketId\/audit'/);
  assert.match(source, /SUPPORT_OPERATIONS_PERMISSION_GROUPS\.AUDIT/);
  assert.doesNotMatch(source, /router\.(post|patch|put|delete)\('\/tickets\/:ticketId\/audit'/);
});
