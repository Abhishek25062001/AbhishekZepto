"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const strict_1 = __importDefault(require("node:assert/strict"));
const node_fs_1 = require("node:fs");
const node_path_1 = require("node:path");
const node_test_1 = require("node:test");
const apiSource = () => (0, node_fs_1.readFileSync)((0, node_path_1.resolve)(process.cwd(), 'src/modules/platform-settings/api/platform-settings.api.ts'), 'utf8');
const hooksSource = () => (0, node_fs_1.readFileSync)((0, node_path_1.resolve)(process.cwd(), 'src/modules/platform-settings/hooks/usePlatformSettingMutations.ts'), 'utf8');
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
(0, node_test_1.test)('platform settings API client uses Module 14 settings endpoints only', () => {
    const source = apiSource();
    strict_1.default.match(source, /const BASE = '\/api\/v1\/admin\/settings'/);
    strict_1.default.match(source, /apiClient\.get<ApiSuccessResponse<PlatformSettingsListResponse>>\(BASE/);
    strict_1.default.match(source, /`\$\{BASE\}\/\$\{settingKey\}`/);
    strict_1.default.match(source, /apiClient\.patch<ApiSuccessResponse<PlatformSetting>>/);
    strict_1.default.match(source, /`\$\{BASE\}\/\$\{settingKey\}\/audit`/);
    strict_1.default.doesNotMatch(source, /pricing|finance|refund|payout|commission|promotion|tax|\/orders|\/delivery|\/customers|\/support|\/catalog|\/vendors|\/stores/i);
});
(0, node_test_1.test)('platform settings mutations refresh list detail and audit query keys', () => {
    const source = hooksSource();
    strict_1.default.match(source, /invalidateQueries\(\{ queryKey: platformSettingsQueryKeys\.all \}\)/);
    strict_1.default.match(source, /invalidateQueries\(\{ queryKey: platformSettingsQueryKeys\.detail\(settingKey\) \}\)/);
    strict_1.default.match(source, /invalidateQueries\(\{ queryKey: platformSettingsQueryKeys\.audit\(settingKey\) \}\)/);
    strict_1.default.match(source, /UpdatePlatformSettingPayload/);
    strict_1.default.doesNotMatch(source, /pricing|finance|refund|payout|commission|promotion|tax|orders|delivery|customers|support|catalog|vendors|stores/i);
});
(0, node_test_1.test)('platform settings list page wires documented filters and pagination', () => {
    const pageSource = (0, node_fs_1.readFileSync)((0, node_path_1.resolve)(process.cwd(), 'src/pages/settings/PlatformSettingsPage.tsx'), 'utf8');
    const filterSource = (0, node_fs_1.readFileSync)((0, node_path_1.resolve)(process.cwd(), 'src/modules/platform-settings/components/PlatformSettingsFilterBar.tsx'), 'utf8');
    const tableSource = (0, node_fs_1.readFileSync)((0, node_path_1.resolve)(process.cwd(), 'src/modules/platform-settings/components/PlatformSettingsTable.tsx'), 'utf8');
    const routesSource = (0, node_fs_1.readFileSync)((0, node_path_1.resolve)(process.cwd(), 'src/routes/admin.routes.tsx'), 'utf8');
    strict_1.default.match(pageSource, /usePlatformSettings\(filters\)/);
    strict_1.default.match(pageSource, /PLATFORM_SETTING_DEFAULT_FILTERS/);
    strict_1.default.match(pageSource, /pagination\.hasPreviousPage/);
    strict_1.default.match(pageSource, /pagination\.hasNextPage/);
    strict_1.default.match(filterSource, /category:/);
    strict_1.default.match(filterSource, /scopeType:/);
    strict_1.default.match(filterSource, /scopeId:/);
    strict_1.default.match(filterSource, /search:/);
    strict_1.default.match(tableSource, /\/settings\/platform\/\$\{encodeURIComponent\(row\.key\)\}/);
    strict_1.default.match(routesSource, /path: '\/settings\/platform'/);
    strict_1.default.match(routesSource, /permission="settings:read"/);
});
(0, node_test_1.test)('platform setting detail route fetches detail and audit endpoints only', () => {
    const routesSource = (0, node_fs_1.readFileSync)((0, node_path_1.resolve)(process.cwd(), 'src/routes/admin.routes.tsx'), 'utf8');
    const detailSource = (0, node_fs_1.readFileSync)((0, node_path_1.resolve)(process.cwd(), 'src/modules/platform-settings/pages/PlatformSettingDetailPage.tsx'), 'utf8');
    const auditSource = (0, node_fs_1.readFileSync)((0, node_path_1.resolve)(process.cwd(), 'src/modules/platform-settings/components/PlatformSettingAuditTable.tsx'), 'utf8');
    strict_1.default.match(routesSource, /path: '\/settings\/platform\/:settingKey'/);
    strict_1.default.match(routesSource, /permission="settings:read"/);
    strict_1.default.match(detailSource, /usePlatformSettingDetail\(decodedSettingKey\)/);
    strict_1.default.match(detailSource, /usePlatformSettingAudit\(decodedSettingKey\)/);
    strict_1.default.doesNotMatch(detailSource, /useUpdatePlatformSettingMutation/);
    strict_1.default.doesNotMatch(auditSource, /apiClient\.(post|patch|put|delete)|useMutation/);
});
(0, node_test_1.test)('platform setting update form is manage-gated and submits value with reason only', () => {
    const detailSource = (0, node_fs_1.readFileSync)((0, node_path_1.resolve)(process.cwd(), 'src/modules/platform-settings/pages/PlatformSettingDetailPage.tsx'), 'utf8');
    const formSource = (0, node_fs_1.readFileSync)((0, node_path_1.resolve)(process.cwd(), 'src/modules/platform-settings/components/PlatformSettingUpdateForm.tsx'), 'utf8');
    const schemaSource = (0, node_fs_1.readFileSync)((0, node_path_1.resolve)(process.cwd(), 'src/modules/platform-settings/validators/platform-setting-form.schema.ts'), 'utf8');
    strict_1.default.match(detailSource, /<CanAccess permission="settings:manage">/);
    strict_1.default.match(detailSource, /<PlatformSettingUpdateForm setting=\{setting\}/);
    strict_1.default.match(formSource, /useUpdatePlatformSettingMutation\(setting\.key\)/);
    strict_1.default.match(formSource, /if \(!setting\.isEditable\) return null/);
    strict_1.default.match(formSource, /platformSettingUpdateFormSchema\.safeParse/);
    strict_1.default.match(formSource, /mutation\.mutate\(parsed\.data/);
    strict_1.default.match(schemaSource, /reason: z\.string\(\)\.trim\(\)\.min\(1\)\.max\(500\)/);
    strict_1.default.match(schemaSource, /value: z\.union/);
    strict_1.default.doesNotMatch(formSource, /apiClient|pricing|finance|refund|payout|commission|promotion|tax|orders|delivery|customers|support|catalog|vendors|stores/i);
});
(0, node_test_1.test)('platform settings UI navigation and guardrails stay permission-scoped', () => {
    const routesSource = (0, node_fs_1.readFileSync)((0, node_path_1.resolve)(process.cwd(), 'src/routes/admin.routes.tsx'), 'utf8');
    const sidebarSource = (0, node_fs_1.readFileSync)((0, node_path_1.resolve)(process.cwd(), 'src/components/layout/Sidebar.tsx'), 'utf8');
    const settingsSource = (0, node_fs_1.readFileSync)((0, node_path_1.resolve)(process.cwd(), 'src/pages/settings/SettingsPage.tsx'), 'utf8');
    const detailSource = (0, node_fs_1.readFileSync)((0, node_path_1.resolve)(process.cwd(), 'src/modules/platform-settings/pages/PlatformSettingDetailPage.tsx'), 'utf8');
    const moduleSource = readModuleSource((0, node_path_1.resolve)(process.cwd(), 'src/modules/platform-settings'));
    strict_1.default.match(sidebarSource, /\{ label: 'Platform Settings', to: '\/settings\/platform', permission: 'settings:read' \}/);
    strict_1.default.match(settingsSource, /to="\/settings\/platform"/);
    strict_1.default.match(routesSource, /path: '\/settings\/platform'/);
    strict_1.default.match(routesSource, /path: '\/settings\/platform\/:settingKey'/);
    strict_1.default.match(routesSource, /permission="settings:read"/);
    strict_1.default.match(detailSource, /<CanAccess permission="settings:manage">/);
    strict_1.default.doesNotMatch(moduleSource, /pricing|finance|refund|payout|commission|promotion|tax|\/orders|\/delivery|\/customers|\/support|\/catalog|\/vendors|\/stores/i);
});
