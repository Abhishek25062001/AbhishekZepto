"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const strict_1 = __importDefault(require("node:assert/strict"));
const node_fs_1 = require("node:fs");
const node_path_1 = require("node:path");
const node_test_1 = require("node:test");
const apiSource = () => (0, node_fs_1.readFileSync)((0, node_path_1.resolve)(process.cwd(), 'src/modules/audit-logs/api/audit-log.api.ts'), 'utf8');
const readModuleSource = (directory) => (0, node_fs_1.readdirSync)(directory)
    .flatMap((entry) => {
    const entryPath = (0, node_path_1.resolve)(directory, entry);
    if ((0, node_fs_1.statSync)(entryPath).isDirectory())
        return [readModuleSource(entryPath)];
    if (entryPath.endsWith('.test.ts'))
        return [];
    if (!/\.(ts|tsx)$/.test(entryPath))
        return [];
    return [(0, node_fs_1.readFileSync)(entryPath, 'utf8')];
})
    .join('\n');
(0, node_test_1.test)('audit log API client uses Module 16 read-only endpoints only', () => {
    const source = apiSource();
    strict_1.default.match(source, /const BASE = '\/api\/v1\/admin\/audit-logs'/);
    strict_1.default.match(source, /apiClient\.get<ApiSuccessResponse<AuditLogsListResponse>>\(BASE/);
    strict_1.default.match(source, /apiClient\.get<ApiSuccessResponse<AuditLogRecord>>/);
    strict_1.default.match(source, /`\$\{BASE\}\/\$\{auditLogId\}`/);
    strict_1.default.doesNotMatch(source, /apiClient\.(post|patch|put|delete)/);
    strict_1.default.doesNotMatch(source, /exportAudit|dataExport|analytics|replay|restore|refund|payout|commission|promotion|tax|\/orders|\/delivery|\/customers|\/support|\/catalog|\/vendors|\/stores|\/settings/i);
});
(0, node_test_1.test)('audit log hooks expose read-only list and detail queries', () => {
    const listHookSource = (0, node_fs_1.readFileSync)((0, node_path_1.resolve)(process.cwd(), 'src/modules/audit-logs/hooks/useAuditLogs.ts'), 'utf8');
    const detailHookSource = (0, node_fs_1.readFileSync)((0, node_path_1.resolve)(process.cwd(), 'src/modules/audit-logs/hooks/useAuditLogDetail.ts'), 'utf8');
    strict_1.default.match(listHookSource, /all: \['audit-logs'\] as const/);
    strict_1.default.match(listHookSource, /list: \(query: AuditLogsListQuery\)/);
    strict_1.default.match(listHookSource, /detail: \(auditLogId: string\)/);
    strict_1.default.match(listHookSource, /queryFn: \(\) => listAuditLogs\(query\)/);
    strict_1.default.match(detailHookSource, /queryFn: \(\) => getAuditLog\(auditLogId\)/);
    strict_1.default.match(detailHookSource, /enabled: auditLogId\.length > 0/);
    strict_1.default.doesNotMatch(`${listHookSource}\n${detailHookSource}`, /useMutation|invalidateQueries|apiClient\.(post|patch|put|delete)/);
});
(0, node_test_1.test)('audit log list page wires documented filters pagination and route gate', () => {
    const pageSource = (0, node_fs_1.readFileSync)((0, node_path_1.resolve)(process.cwd(), 'src/pages/audit-logs/AuditLogsPage.tsx'), 'utf8');
    const filterSource = (0, node_fs_1.readFileSync)((0, node_path_1.resolve)(process.cwd(), 'src/modules/audit-logs/components/AuditLogFilterBar.tsx'), 'utf8');
    const tableSource = (0, node_fs_1.readFileSync)((0, node_path_1.resolve)(process.cwd(), 'src/modules/audit-logs/components/AuditLogTable.tsx'), 'utf8');
    const routesSource = (0, node_fs_1.readFileSync)((0, node_path_1.resolve)(process.cwd(), 'src/routes/admin.routes.tsx'), 'utf8');
    strict_1.default.match(pageSource, /useAuditLogs\(filters\)/);
    strict_1.default.match(pageSource, /AUDIT_LOG_DEFAULT_FILTERS/);
    strict_1.default.match(pageSource, /pagination\.hasPreviousPage/);
    strict_1.default.match(pageSource, /pagination\.hasNextPage/);
    strict_1.default.match(filterSource, /adminId:/);
    strict_1.default.match(filterSource, /actionType:/);
    strict_1.default.match(filterSource, /entityType:/);
    strict_1.default.match(filterSource, /entityId:/);
    strict_1.default.match(filterSource, /from:/);
    strict_1.default.match(filterSource, /to:/);
    strict_1.default.match(tableSource, /\/audit-logs\/\$\{row\.id\}/);
    strict_1.default.match(routesSource, /path: '\/audit-logs'/);
    strict_1.default.match(routesSource, /permission="audit_logs:read"/);
    strict_1.default.doesNotMatch(`${pageSource}\n${tableSource}`, /Export|Replay|Restore|Delete|Edit|Reveal|useMutation|apiClient\.(post|patch|put|delete)/);
});
(0, node_test_1.test)('audit log detail page renders read-only metadata and state panels', () => {
    const detailSource = (0, node_fs_1.readFileSync)((0, node_path_1.resolve)(process.cwd(), 'src/modules/audit-logs/pages/AuditLogDetailPage.tsx'), 'utf8');
    const statePanelSource = (0, node_fs_1.readFileSync)((0, node_path_1.resolve)(process.cwd(), 'src/modules/audit-logs/components/AuditLogStatePanel.tsx'), 'utf8');
    const routesSource = (0, node_fs_1.readFileSync)((0, node_path_1.resolve)(process.cwd(), 'src/routes/admin.routes.tsx'), 'utf8');
    strict_1.default.match(detailSource, /useAuditLogDetail\(auditLogId\)/);
    strict_1.default.match(detailSource, /<AuditLogStatePanel state=\{auditLog\.beforeState\} title="Before state" \/>/);
    strict_1.default.match(detailSource, /<AuditLogStatePanel state=\{auditLog\.afterState\} title="After state" \/>/);
    strict_1.default.match(statePanelSource, /JSON\.stringify\(state, null, 2\)/);
    strict_1.default.match(routesSource, /path: '\/audit-logs\/:auditLogId'/);
    strict_1.default.match(routesSource, /permission="audit_logs:read"/);
    strict_1.default.doesNotMatch(`${detailSource}\n${statePanelSource}`, /Export|Replay|Restore|Delete|Edit|Reveal|useMutation|apiClient\.(post|patch|put|delete)/);
});
(0, node_test_1.test)('audit log UI navigation and module source stay read-only', () => {
    const sidebarSource = (0, node_fs_1.readFileSync)((0, node_path_1.resolve)(process.cwd(), 'src/components/layout/Sidebar.tsx'), 'utf8');
    const routesSource = (0, node_fs_1.readFileSync)((0, node_path_1.resolve)(process.cwd(), 'src/routes/admin.routes.tsx'), 'utf8');
    const moduleSource = readModuleSource((0, node_path_1.resolve)(process.cwd(), 'src/modules/audit-logs'));
    strict_1.default.match(sidebarSource, /\{ label: 'Audit Logs', to: '\/audit-logs', permission: 'audit_logs:read' \}/);
    strict_1.default.match(routesSource, /path: '\/audit-logs'/);
    strict_1.default.match(routesSource, /path: '\/audit-logs\/:auditLogId'/);
    strict_1.default.match(routesSource, /permission="audit_logs:read"/);
    strict_1.default.doesNotMatch(moduleSource, /useMutation|invalidateQueries|apiClient\.(post|patch|put|delete)/);
    strict_1.default.doesNotMatch(moduleSource, /exportAudit|dataExport|analytics|replay|restore|refund|payout|commission|promotion|tax|\/orders|\/delivery|\/customers|\/support|\/catalog|\/vendors|\/stores|\/settings/i);
});
