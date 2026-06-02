import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { test } from 'node:test';

const apiSource = () => readFileSync(
  resolve(process.cwd(), 'src/modules/support/api/support.api.ts'),
  'utf8',
);

const hooksSource = () => readFileSync(
  resolve(process.cwd(), 'src/modules/support/hooks/useSupportTicketMutations.ts'),
  'utf8',
);

test('support API client uses Module 12 support endpoints only', () => {
  const source = apiSource();

  assert.match(source, /const BASE = '\/api\/v1\/admin\/support\/tickets'/);
  assert.match(source, /apiClient\.get<ApiSuccessResponse<SupportTicketListResponse>>\(BASE/);
  assert.match(source, /apiClient\.post<ApiSuccessResponse<SupportTicket>>\(BASE, payload\)/);
  assert.match(source, /`\$\{BASE\}\/\$\{ticketId\}`/);
  assert.match(source, /`\$\{BASE\}\/\$\{ticketId\}\/status`/);
  assert.match(source, /`\$\{BASE\}\/\$\{ticketId\}\/priority`/);
  assert.match(source, /`\$\{BASE\}\/\$\{ticketId\}\/assignment`/);
  assert.match(source, /`\$\{BASE\}\/\$\{ticketId\}\/notes`/);
  assert.match(source, /`\$\{BASE\}\/\$\{ticketId\}\/audit`/);
  assert.doesNotMatch(source, /refund|chat|attachment|realtime|\/orders\/.*\/status|\/delivery|\/customers\/.*\/status/i);
});

test('support mutations refresh list detail notes and audit query keys', () => {
  const source = hooksSource();

  assert.match(source, /invalidateQueries\(\{ queryKey: supportQueryKeys\.all \}\)/);
  assert.match(source, /invalidateQueries\(\{ queryKey: supportQueryKeys\.detail\(ticketId\) \}\)/);
  assert.match(source, /invalidateQueries\(\{ queryKey: supportQueryKeys\.notes\(ticketId\) \}\)/);
  assert.match(source, /invalidateQueries\(\{ queryKey: supportQueryKeys\.audit\(ticketId\) \}\)/);
});

test('support list page wires documented filters and pagination', () => {
  const pageSource = readFileSync(resolve(process.cwd(), 'src/pages/support/SupportPage.tsx'), 'utf8');
  const filterSource = readFileSync(
    resolve(process.cwd(), 'src/modules/support/components/SupportTicketFilterBar.tsx'),
    'utf8',
  );
  const tableSource = readFileSync(
    resolve(process.cwd(), 'src/modules/support/components/SupportTicketTable.tsx'),
    'utf8',
  );

  assert.match(pageSource, /useSupportTickets\(filters\)/);
  assert.match(pageSource, /page: 1, limit: 20/);
  assert.match(pageSource, /pagination\.hasPreviousPage/);
  assert.match(pageSource, /pagination\.hasNextPage/);
  assert.match(filterSource, /status:/);
  assert.match(filterSource, /priority:/);
  assert.match(filterSource, /category:/);
  assert.match(filterSource, /customerId:/);
  assert.match(filterSource, /orderId:/);
  assert.match(filterSource, /assignedAdminId:/);
  assert.match(filterSource, /search:/);
  assert.match(tableSource, /\/support\/tickets\/\$\{row\.ticketId\}/);
});

test('support detail route fetches ticket detail endpoint only', () => {
  const routesSource = readFileSync(resolve(process.cwd(), 'src/routes/admin.routes.tsx'), 'utf8');
  const detailSource = readFileSync(
    resolve(process.cwd(), 'src/modules/support/pages/SupportTicketDetailPage.tsx'),
    'utf8',
  );
  const summarySource = readFileSync(
    resolve(process.cwd(), 'src/modules/support/components/SupportTicketSummary.tsx'),
    'utf8',
  );

  assert.match(routesSource, /path: '\/support\/tickets\/:ticketId'/);
  assert.match(routesSource, /permission="support:read"/);
  assert.match(detailSource, /useSupportTicketDetail\(ticketId\)/);
  assert.match(summarySource, /SupportTicketStatusBadge/);
  assert.match(summarySource, /SupportTicketPriorityBadge/);
  assert.doesNotMatch(detailSource, /useUpdateSupportTicket|useCreateSupportTicketNote/);
});

test('create support ticket UI is permission gated and submits create payload only', () => {
  const pageSource = readFileSync(resolve(process.cwd(), 'src/pages/support/SupportPage.tsx'), 'utf8');
  const modalSource = readFileSync(
    resolve(process.cwd(), 'src/modules/support/components/CreateSupportTicketModal.tsx'),
    'utf8',
  );

  assert.match(pageSource, /SUPPORT_TICKET_CREATE_PERMISSIONS = \['support:create', 'settings:manage'\]/);
  assert.match(pageSource, /<CreateSupportTicketModal/);
  assert.match(modalSource, /useCreateSupportTicketMutation/);
  assert.match(modalSource, /createSupportTicketFormSchema\.safeParse\(values\)/);
  assert.match(modalSource, /mutation\.mutate\(payload/);
  assert.match(modalSource, /customerId: parsed\.data\.customerId/);
  assert.match(modalSource, /orderId: parsed\.data\.orderId/);
  assert.doesNotMatch(modalSource, /reason:/);
  assert.doesNotMatch(modalSource, /refund|chat|attachment|realtime/i);
});

test('support ticket mutation controls are permission gated and require reason', () => {
  const detailSource = readFileSync(
    resolve(process.cwd(), 'src/modules/support/pages/SupportTicketDetailPage.tsx'),
    'utf8',
  );
  const statusSource = readFileSync(
    resolve(process.cwd(), 'src/modules/support/components/SupportTicketStatusControl.tsx'),
    'utf8',
  );
  const prioritySource = readFileSync(
    resolve(process.cwd(), 'src/modules/support/components/SupportTicketPriorityControl.tsx'),
    'utf8',
  );
  const assignmentSource = readFileSync(
    resolve(process.cwd(), 'src/modules/support/components/SupportTicketAssignmentControl.tsx'),
    'utf8',
  );

  assert.match(detailSource, /SUPPORT_TICKET_UPDATE_PERMISSIONS = \['support:update', 'settings:manage'\]/);
  assert.match(detailSource, /SUPPORT_TICKET_ASSIGN_PERMISSIONS = \['support:assign', 'settings:manage'\]/);
  assert.match(statusSource, /useUpdateSupportTicketStatusMutation\(ticket\.ticketId\)/);
  assert.match(statusSource, /supportTicketStatusFormSchema\.safeParse\(values\)/);
  assert.match(statusSource, /reason: parsed\.data\.reason/);
  assert.match(prioritySource, /useUpdateSupportTicketPriorityMutation\(ticket\.ticketId\)/);
  assert.match(prioritySource, /supportTicketPriorityFormSchema\.safeParse\(values\)/);
  assert.match(prioritySource, /reason: parsed\.data\.reason/);
  assert.match(assignmentSource, /useUpdateSupportTicketAssignmentMutation\(ticket\.ticketId\)/);
  assert.match(assignmentSource, /supportTicketAssignmentFormSchema\.safeParse\(values\)/);
  assert.match(assignmentSource, /assignedAdminId: parsed\.data\.assignedAdminId/);
  assert.match(assignmentSource, /reason: parsed\.data\.reason/);
});

test('support ticket notes and audit panels use notes and audit endpoints only', () => {
  const detailSource = readFileSync(
    resolve(process.cwd(), 'src/modules/support/pages/SupportTicketDetailPage.tsx'),
    'utf8',
  );
  const notesSource = readFileSync(
    resolve(process.cwd(), 'src/modules/support/components/SupportTicketNotesPanel.tsx'),
    'utf8',
  );
  const auditSource = readFileSync(
    resolve(process.cwd(), 'src/modules/support/components/SupportTicketAuditTable.tsx'),
    'utf8',
  );

  assert.match(detailSource, /<SupportTicketNotesPanel ticketId=\{ticket\.ticketId\}/);
  assert.match(detailSource, /<SupportTicketAuditTable ticketId=\{ticket\.ticketId\}/);
  assert.match(notesSource, /useSupportTicketNotes\(ticketId\)/);
  assert.match(notesSource, /useCreateSupportTicketNoteMutation\(ticketId\)/);
  assert.match(notesSource, /SUPPORT_TICKET_NOTE_CREATE_PERMISSIONS = \['support:update', 'settings:manage'\]/);
  assert.match(notesSource, /supportTicketNoteFormSchema\.safeParse\(values\)/);
  assert.match(auditSource, /useSupportTicketAudit\(ticketId\)/);
  assert.doesNotMatch(auditSource, /useCreate|useUpdate|apiClient\.(post|patch|put|delete)/);
});

test('support operations UI is permission gated and excludes future-module workflows', () => {
  const routesSource = readFileSync(resolve(process.cwd(), 'src/routes/admin.routes.tsx'), 'utf8');
  const sidebarSource = readFileSync(resolve(process.cwd(), 'src/components/layout/Sidebar.tsx'), 'utf8');
  const pageSource = readFileSync(resolve(process.cwd(), 'src/pages/support/SupportPage.tsx'), 'utf8');
  const detailSource = readFileSync(
    resolve(process.cwd(), 'src/modules/support/pages/SupportTicketDetailPage.tsx'),
    'utf8',
  );
  const apiSourceText = apiSource();

  assert.match(routesSource, /path: '\/support'/);
  assert.match(routesSource, /path: '\/support\/tickets\/:ticketId'/);
  assert.match(routesSource, /permission="support:read"/);
  assert.match(sidebarSource, /\{ label: 'Support', to: '\/support', permission: 'support:read' \}/);
  assert.match(pageSource, /SUPPORT_TICKET_CREATE_PERMISSIONS = \['support:create', 'settings:manage'\]/);
  assert.match(detailSource, /SUPPORT_TICKET_UPDATE_PERMISSIONS = \['support:update', 'settings:manage'\]/);
  assert.match(detailSource, /SUPPORT_TICKET_ASSIGN_PERMISSIONS = \['support:assign', 'settings:manage'\]/);
  assert.doesNotMatch(apiSourceText, /refund|chat|attachment|realtime|\/orders\/.*\/status|\/delivery|\/customers\/.*\/status/i);
  assert.doesNotMatch(`${pageSource}\n${detailSource}`, /Refund|Chat|Attachment|Realtime|Customer status/i);
});
