import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { test } from 'node:test';

const readSource = (path: string) => {
  const candidates = [
    resolve(process.cwd(), path),
    resolve(process.cwd(), 'backend/api', path),
  ];
  const sourcePath = candidates.find((candidate) => existsSync(candidate));

  assert.ok(sourcePath, `Expected source path to exist for ${path}`);
  return readFileSync(sourcePath, 'utf8');
};

test('platform settings validators accept documented filters and require update reason', () => {
  const source = readSource('src/modules/platform-settings/validators/platform-settings.validator.ts');

  assert.match(source, /category:/);
  assert.match(source, /scopeType:/);
  assert.match(source, /scopeId:/);
  assert.match(source, /search:/);
  assert.match(source, /page:/);
  assert.match(source, /limit:/);
  assert.match(source, /reason: z\.string\(\)\.trim\(\)\.min\(5\)/);
});

test('platform settings read service exposes list and detail mappers', () => {
  const source = readSource('src/modules/platform-settings/services/platform-settings.service.ts');

  assert.match(source, /listPlatformSettingsForAdmin/);
  assert.match(source, /getPlatformSettingForAdmin/);
  assert.match(source, /getPlatformSettingOrThrow/);
  assert.match(source, /mapPlatformSetting/);
});

test('platform settings update service validates editability value type and audit writes', () => {
  const source = readSource('src/modules/platform-settings/services/platform-settings.service.ts');

  assert.match(source, /updatePlatformSettingForAdmin/);
  assert.match(source, /isValueCompatibleWithType/);
  assert.match(source, /!setting\.isEditable/);
  assert.match(source, /updatePlatformSettingValueRecord/);
  assert.match(source, /writeAdminActionAudit/);
  assert.match(source, /ADMIN_ACTION_TYPE\.PLATFORM_SETTING_UPDATED/);
  assert.match(source, /entityType: 'platform_setting'/);
});

test('platform settings audit service is read-only and scoped to one setting', () => {
  const source = readSource('src/modules/platform-settings/services/platform-settings.service.ts');

  assert.match(source, /listPlatformSettingAuditForAdmin/);
  assert.match(source, /AdminActionAuditModel\.find/);
  assert.match(source, /entityType: 'platform_setting'/);
  assert.match(source, /entityId: setting\._id/);
  assert.doesNotMatch(source, /AdminActionAuditModel\.(create|findOneAndUpdate|delete)/);
});
