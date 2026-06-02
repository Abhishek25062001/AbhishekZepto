import assert from 'node:assert/strict';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { resolve } from 'node:path';
import { test } from 'node:test';

const apiSource = () => readFileSync(
  resolve(process.cwd(), 'src/modules/platform-settings/api/platform-settings.api.ts'),
  'utf8',
);

const hooksSource = () => readFileSync(
  resolve(process.cwd(), 'src/modules/platform-settings/hooks/usePlatformSettingMutations.ts'),
  'utf8',
);

const readModuleSource = (directory: string): string => readdirSync(directory)
  .flatMap((entry) => {
    const entryPath = resolve(directory, entry);
    if (statSync(entryPath).isDirectory()) return [readModuleSource(entryPath)];
    if (entryPath.endsWith('.test.ts')) return [];
    if (!/\.(ts|tsx)$/.test(entryPath)) return [];
    return [readFileSync(entryPath, 'utf8')];
  })
  .join('\n');

test('platform settings API client uses Module 14 settings endpoints only', () => {
  const source = apiSource();

  assert.match(source, /const BASE = '\/api\/v1\/admin\/settings'/);
  assert.match(source, /apiClient\.get<ApiSuccessResponse<PlatformSettingsListResponse>>\(BASE/);
  assert.match(source, /`\$\{BASE\}\/\$\{settingKey\}`/);
  assert.match(source, /apiClient\.patch<ApiSuccessResponse<PlatformSetting>>/);
  assert.match(source, /`\$\{BASE\}\/\$\{settingKey\}\/audit`/);
  assert.doesNotMatch(
    source,
    /pricing|finance|refund|payout|commission|promotion|tax|\/orders|\/delivery|\/customers|\/support|\/catalog|\/vendors|\/stores/i,
  );
});

test('platform settings mutations refresh list detail and audit query keys', () => {
  const source = hooksSource();

  assert.match(source, /invalidateQueries\(\{ queryKey: platformSettingsQueryKeys\.all \}\)/);
  assert.match(source, /invalidateQueries\(\{ queryKey: platformSettingsQueryKeys\.detail\(settingKey\) \}\)/);
  assert.match(source, /invalidateQueries\(\{ queryKey: platformSettingsQueryKeys\.audit\(settingKey\) \}\)/);
  assert.match(source, /UpdatePlatformSettingPayload/);
  assert.doesNotMatch(source, /pricing|finance|refund|payout|commission|promotion|tax|orders|delivery|customers|support|catalog|vendors|stores/i);
});

test('platform settings list page wires documented filters and pagination', () => {
  const pageSource = readFileSync(resolve(process.cwd(), 'src/pages/settings/PlatformSettingsPage.tsx'), 'utf8');
  const filterSource = readFileSync(
    resolve(process.cwd(), 'src/modules/platform-settings/components/PlatformSettingsFilterBar.tsx'),
    'utf8',
  );
  const tableSource = readFileSync(
    resolve(process.cwd(), 'src/modules/platform-settings/components/PlatformSettingsTable.tsx'),
    'utf8',
  );
  const routesSource = readFileSync(resolve(process.cwd(), 'src/routes/admin.routes.tsx'), 'utf8');

  assert.match(pageSource, /usePlatformSettings\(filters\)/);
  assert.match(pageSource, /PLATFORM_SETTING_DEFAULT_FILTERS/);
  assert.match(pageSource, /pagination\.hasPreviousPage/);
  assert.match(pageSource, /pagination\.hasNextPage/);
  assert.match(filterSource, /category:/);
  assert.match(filterSource, /scopeType:/);
  assert.match(filterSource, /scopeId:/);
  assert.match(filterSource, /search:/);
  assert.match(tableSource, /\/settings\/platform\/\$\{encodeURIComponent\(row\.key\)\}/);
  assert.match(routesSource, /path: '\/settings\/platform'/);
  assert.match(routesSource, /permission="settings:read"/);
});

test('platform setting detail route fetches detail and audit endpoints only', () => {
  const routesSource = readFileSync(resolve(process.cwd(), 'src/routes/admin.routes.tsx'), 'utf8');
  const detailSource = readFileSync(
    resolve(process.cwd(), 'src/modules/platform-settings/pages/PlatformSettingDetailPage.tsx'),
    'utf8',
  );
  const auditSource = readFileSync(
    resolve(process.cwd(), 'src/modules/platform-settings/components/PlatformSettingAuditTable.tsx'),
    'utf8',
  );

  assert.match(routesSource, /path: '\/settings\/platform\/:settingKey'/);
  assert.match(routesSource, /permission="settings:read"/);
  assert.match(detailSource, /usePlatformSettingDetail\(decodedSettingKey\)/);
  assert.match(detailSource, /usePlatformSettingAudit\(decodedSettingKey\)/);
  assert.doesNotMatch(detailSource, /useUpdatePlatformSettingMutation/);
  assert.doesNotMatch(auditSource, /apiClient\.(post|patch|put|delete)|useMutation/);
});

test('platform setting update form is manage-gated and submits value with reason only', () => {
  const detailSource = readFileSync(
    resolve(process.cwd(), 'src/modules/platform-settings/pages/PlatformSettingDetailPage.tsx'),
    'utf8',
  );
  const formSource = readFileSync(
    resolve(process.cwd(), 'src/modules/platform-settings/components/PlatformSettingUpdateForm.tsx'),
    'utf8',
  );
  const schemaSource = readFileSync(
    resolve(process.cwd(), 'src/modules/platform-settings/validators/platform-setting-form.schema.ts'),
    'utf8',
  );

  assert.match(detailSource, /<CanAccess permission="settings:manage">/);
  assert.match(detailSource, /<PlatformSettingUpdateForm setting=\{setting\}/);
  assert.match(formSource, /useUpdatePlatformSettingMutation\(setting\.key\)/);
  assert.match(formSource, /if \(!setting\.isEditable\) return null/);
  assert.match(formSource, /platformSettingUpdateFormSchema\.safeParse/);
  assert.match(formSource, /mutation\.mutate\(parsed\.data/);
  assert.match(schemaSource, /reason: z\.string\(\)\.trim\(\)\.min\(1\)\.max\(500\)/);
  assert.match(schemaSource, /value: z\.union/);
  assert.doesNotMatch(formSource, /apiClient|pricing|finance|refund|payout|commission|promotion|tax|orders|delivery|customers|support|catalog|vendors|stores/i);
});

test('platform settings UI navigation and guardrails stay permission-scoped', () => {
  const routesSource = readFileSync(resolve(process.cwd(), 'src/routes/admin.routes.tsx'), 'utf8');
  const sidebarSource = readFileSync(resolve(process.cwd(), 'src/components/layout/Sidebar.tsx'), 'utf8');
  const settingsSource = readFileSync(resolve(process.cwd(), 'src/pages/settings/SettingsPage.tsx'), 'utf8');
  const detailSource = readFileSync(
    resolve(process.cwd(), 'src/modules/platform-settings/pages/PlatformSettingDetailPage.tsx'),
    'utf8',
  );
  const moduleSource = readModuleSource(resolve(process.cwd(), 'src/modules/platform-settings'));

  assert.match(sidebarSource, /\{ label: 'Platform Settings', to: '\/settings\/platform', permission: 'settings:read' \}/);
  assert.match(settingsSource, /to="\/settings\/platform"/);
  assert.match(routesSource, /path: '\/settings\/platform'/);
  assert.match(routesSource, /path: '\/settings\/platform\/:settingKey'/);
  assert.match(routesSource, /permission="settings:read"/);
  assert.match(detailSource, /<CanAccess permission="settings:manage">/);
  assert.doesNotMatch(
    moduleSource,
    /pricing|finance|refund|payout|commission|promotion|tax|\/orders|\/delivery|\/customers|\/support|\/catalog|\/vendors|\/stores/i,
  );
});
