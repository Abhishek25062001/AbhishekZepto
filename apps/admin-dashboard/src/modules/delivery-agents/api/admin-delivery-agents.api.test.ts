import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { test } from 'node:test';

const readSource = (path: string): string => readFileSync(resolve(process.cwd(), path), 'utf8');

test('delivery agents API client uses existing Module 5 endpoints only', () => {
  const source = readSource('src/modules/delivery-agents/api/admin-delivery-agents.api.ts');

  assert.match(source, /const BASE = '\/api\/v1\/admin\/delivery-agents'/);
  assert.match(source, /apiClient\.get<ApiSuccessResponse<AdminDeliveryAgentListResponse>>/);
  assert.match(source, /`\$\{BASE\}\/\$\{deliveryAgentId\}`/);
  assert.match(source, /`\$\{BASE\}\/\$\{deliveryAgentId\}\/status`/);
  assert.match(source, /`\$\{BASE\}\/\$\{deliveryAgentId\}\/verification`/);
  assert.match(source, /`\$\{BASE\}\/\$\{deliveryAgentId\}\/assignments`/);
  assert.match(source, /`\$\{BASE\}\/\$\{deliveryAgentId\}\/audit`/);
});

test('delivery agent mutations refresh delivery-agent query keys', () => {
  const source = readSource('src/modules/delivery-agents/hooks/useAdminDeliveryAgentMutations.ts');

  assert.match(source, /invalidateQueries\(\{ queryKey: adminDeliveryAgentsQueryKeys\.all \}\)/);
  assert.match(source, /adminDeliveryAgentsQueryKeys\.detail\(deliveryAgentId\)/);
  assert.match(source, /useUpdateAdminDeliveryAgentStatusMutation/);
  assert.match(source, /useUpdateAdminDeliveryAgentVerificationMutation/);
});

test('delivery agents list page wires documented filters and pagination', () => {
  const pageSource = readSource('src/pages/delivery-agents/DeliveryAgentsPage.tsx');
  const filterSource = readSource(
    'src/modules/delivery-agents/components/DeliveryAgentsFilterBar.tsx',
  );

  assert.match(pageSource, /useAdminDeliveryAgents\(filters\)/);
  assert.match(pageSource, /page: 1, limit: 20/);
  assert.match(pageSource, /pagination\.hasPreviousPage/);
  assert.match(pageSource, /pagination\.hasNextPage/);
  assert.match(filterSource, /status:/);
  assert.match(filterSource, /availabilityStatus:/);
  assert.match(filterSource, /verificationStatus:/);
  assert.match(filterSource, /cityId:/);
  assert.match(filterSource, /search:/);
});

test('delivery agent detail route and page use read-only detail contract', () => {
  const routeSource = readSource('src/routes/admin.routes.tsx');
  const detailSource = readSource('src/pages/delivery-agents/DeliveryAgentDetailPage.tsx');
  const summarySource = readSource(
    'src/modules/delivery-agents/components/DeliveryAgentSummary.tsx',
  );

  assert.match(routeSource, /path: '\/delivery-agents\/:deliveryAgentId'/);
  assert.match(routeSource, /permission="delivery:read"/);
  assert.match(detailSource, /useParams<\{ deliveryAgentId: string \}>/);
  assert.match(detailSource, /useAdminDeliveryAgentDetail\(deliveryAgentId\)/);
  assert.match(detailSource, /<DeliveryAgentSummary agent=\{detailQuery\.data\} \/>/);
  assert.match(summarySource, /forcedOfflineReason/);
  assert.match(summarySource, /currentAssignmentId/);
  assert.doesNotMatch(detailSource, /useUpdateAdminDeliveryAgentStatusMutation/);
  assert.doesNotMatch(detailSource, /useUpdateAdminDeliveryAgentVerificationMutation/);
});

test('delivery agent detail page exposes read-only assignment inspection', () => {
  const detailSource = readSource('src/pages/delivery-agents/DeliveryAgentDetailPage.tsx');
  const filterSource = readSource(
    'src/modules/delivery-agents/components/DeliveryAgentAssignmentsFilterBar.tsx',
  );
  const tableSource = readSource(
    'src/modules/delivery-agents/components/DeliveryAgentAssignmentsTable.tsx',
  );

  assert.match(detailSource, /useAdminDeliveryAgentAssignments\(deliveryAgentId, assignmentFilters\)/);
  assert.match(detailSource, /page: 1,\s+limit: 20/);
  assert.match(detailSource, /assignmentPagination\.hasPreviousPage/);
  assert.match(detailSource, /assignmentPagination\.hasNextPage/);
  assert.match(filterSource, /status:/);
  assert.match(filterSource, /fromDate:/);
  assert.match(filterSource, /toDate:/);
  assert.match(tableSource, /deliveryId/);
  assert.match(tableSource, /orderId/);
  assert.match(tableSource, /deliveryStatus/);
  assert.match(tableSource, /assignmentSource/);
  assert.match(tableSource, /assignedAt/);
  assert.match(tableSource, /pickedUpAt/);
  assert.match(tableSource, /completedAt/);
  assert.doesNotMatch(detailSource, /reassign|unassign|override/);
});

test('delivery agent detail page exposes read-only audit inspection', () => {
  const detailSource = readSource('src/pages/delivery-agents/DeliveryAgentDetailPage.tsx');
  const tableSource = readSource(
    'src/modules/delivery-agents/components/DeliveryAgentAuditTable.tsx',
  );

  assert.match(detailSource, /useAdminDeliveryAgentAudit\(deliveryAgentId, auditFilters\)/);
  assert.match(detailSource, /setAuditFilters/);
  assert.match(detailSource, /auditPagination\.hasPreviousPage/);
  assert.match(detailSource, /auditPagination\.hasNextPage/);
  assert.match(tableSource, /actionType/);
  assert.match(tableSource, /adminId/);
  assert.match(tableSource, /reason/);
  assert.match(tableSource, /ipAddress/);
  assert.match(tableSource, /deviceInfo/);
  assert.match(tableSource, /createdAt/);
  assert.doesNotMatch(tableSource, /beforeState|afterState/);
});

test('delivery agent status control is permission-gated and submits status reason only', () => {
  const detailSource = readSource('src/pages/delivery-agents/DeliveryAgentDetailPage.tsx');
  const controlSource = readSource(
    'src/modules/delivery-agents/components/DeliveryAgentStatusControl.tsx',
  );
  const schemaSource = readSource(
    'src/modules/delivery-agents/validators/delivery-agent-form.schema.ts',
  );

  assert.match(detailSource, /DELIVERY_AGENT_STATUS_PERMISSIONS/);
  assert.match(detailSource, /'delivery:update-status'/);
  assert.match(detailSource, /'settings:manage'/);
  assert.match(detailSource, /<CanAccessAny permissions=\{DELIVERY_AGENT_STATUS_PERMISSIONS\}>/);
  assert.match(detailSource, /<DeliveryAgentStatusControl/);
  assert.match(controlSource, /useUpdateAdminDeliveryAgentStatusMutation\(agent\.agentId\)/);
  assert.match(controlSource, /status: parsed\.data\.status/);
  assert.match(controlSource, /reason: parsed\.data\.reason/);
  assert.match(controlSource, /role="alert"/);
  assert.match(schemaSource, /deliveryAgentStatusFormSchema/);
  assert.match(schemaSource, /z\.string\(\)\.trim\(\)\.min\(5\)\.max\(500\)/);
  assert.doesNotMatch(controlSource, /verificationStatus/);
});

test('delivery agent verification control is permission-gated and submits verification reason only', () => {
  const detailSource = readSource('src/pages/delivery-agents/DeliveryAgentDetailPage.tsx');
  const controlSource = readSource(
    'src/modules/delivery-agents/components/DeliveryAgentVerificationControl.tsx',
  );
  const schemaSource = readSource(
    'src/modules/delivery-agents/validators/delivery-agent-form.schema.ts',
  );

  assert.match(detailSource, /DELIVERY_AGENT_VERIFICATION_PERMISSIONS/);
  assert.match(detailSource, /'delivery:update'/);
  assert.match(detailSource, /'settings:manage'/);
  assert.match(detailSource, /<CanAccessAny permissions=\{DELIVERY_AGENT_VERIFICATION_PERMISSIONS\}>/);
  assert.match(detailSource, /<DeliveryAgentVerificationControl/);
  assert.match(controlSource, /useUpdateAdminDeliveryAgentVerificationMutation\(agent\.agentId\)/);
  assert.match(controlSource, /verificationStatus: parsed\.data\.verificationStatus/);
  assert.match(controlSource, /reason: parsed\.data\.reason/);
  assert.match(controlSource, /role="alert"/);
  assert.match(schemaSource, /deliveryAgentVerificationFormSchema/);
  assert.match(schemaSource, /verificationStatus: z\.enum\(verificationValues\)/);
  assert.doesNotMatch(controlSource, /status: parsed\.data\.status/);
});

test('delivery agent management UI keeps mutations guarded and avoids unsupported operations', () => {
  const pageSource = readSource('src/pages/delivery-agents/DeliveryAgentDetailPage.tsx');
  const statusControlSource = readSource(
    'src/modules/delivery-agents/components/DeliveryAgentStatusControl.tsx',
  );
  const verificationControlSource = readSource(
    'src/modules/delivery-agents/components/DeliveryAgentVerificationControl.tsx',
  );
  const assignmentsTableSource = readSource(
    'src/modules/delivery-agents/components/DeliveryAgentAssignmentsTable.tsx',
  );
  const apiSource = readSource('src/modules/delivery-agents/api/admin-delivery-agents.api.ts');

  assert.match(pageSource, /ErrorView/);
  assert.match(pageSource, /EmptyState/);
  assert.match(statusControlSource, /disabled=\{mutation\.isPending\}/);
  assert.match(statusControlSource, /loading=\{mutation\.isPending\}/);
  assert.match(verificationControlSource, /disabled=\{mutation\.isPending\}/);
  assert.match(verificationControlSource, /loading=\{mutation\.isPending\}/);
  assert.doesNotMatch(assignmentsTableSource, /reassign|unassign|override|dispatch/i);
  assert.doesNotMatch(apiSource, /payroll|incentive|exportCsv|exportPdf|analytics|supportTicket/i);
});
