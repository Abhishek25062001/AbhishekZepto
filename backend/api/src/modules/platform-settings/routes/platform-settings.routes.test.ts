import assert from 'node:assert/strict';
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { resolve } from 'node:path';
import { test } from 'node:test';

import { PLATFORM_SETTINGS_PERMISSIONS } from '../constants/platform-settings.constants';
import { ERROR_CODES } from '../../../errors/error-codes';
import {
  listPlatformSettingsQueryValidator,
  platformSettingKeyParamValidator,
} from '../validators/platform-settings.validator';

const readSource = (path: string) => {
  const candidates = [
    resolve(process.cwd(), path),
    resolve(process.cwd(), 'backend/api', path),
  ];
  const sourcePath = candidates.find((candidate) => existsSync(candidate));

  assert.ok(sourcePath, `Expected source path to exist for ${path}`);
  return readFileSync(sourcePath, 'utf8');
};

const collectSources = (dir: string): string[] => {
  const candidates = [
    resolve(process.cwd(), dir),
    resolve(process.cwd(), 'backend/api', dir),
  ];
  const root = candidates.find((candidate) => existsSync(candidate));

  assert.ok(root, `Expected source directory to exist for ${dir}`);

  return readdirSync(root).flatMap((entry) => {
    const fullPath = resolve(root, entry);
    if (statSync(fullPath).isDirectory()) {
      return collectSources(resolve(dir, entry));
    }
    return fullPath.endsWith('.ts') && !fullPath.endsWith('.test.ts')
      ? [readFileSync(fullPath, 'utf8')]
      : [];
  });
};

test('platform settings read permissions use settings resource', () => {
  assert.equal(PLATFORM_SETTINGS_PERMISSIONS.READ, 'settings:read');
  assert.equal(PLATFORM_SETTINGS_PERMISSIONS.MANAGE, 'settings:manage');
});

test('platform settings error codes are registered', () => {
  assert.equal(ERROR_CODES.PLATFORM_SETTING_NOT_FOUND, 'PLATFORM_SETTING_NOT_FOUND');
  assert.equal(ERROR_CODES.PLATFORM_SETTING_NOT_EDITABLE, 'PLATFORM_SETTING_NOT_EDITABLE');
  assert.equal(
    ERROR_CODES.PLATFORM_SETTING_VALUE_TYPE_INVALID,
    'PLATFORM_SETTING_VALUE_TYPE_INVALID',
  );
});

test('platform settings read validators accept documented filters and setting key', () => {
  const parsed = listPlatformSettingsQueryValidator.query.parse({
    category: 'platform',
    scopeType: 'global',
    search: 'checkout',
    page: '2',
    limit: '25',
  });

  assert.equal(parsed.category, 'platform');
  assert.equal(parsed.scopeType, 'global');
  assert.equal(parsed.page, 2);
  assert.equal(parsed.limit, 25);
  assert.equal(
    platformSettingKeyParamValidator.params.parse({ settingKey: 'checkout.enabled' }).settingKey,
    'checkout.enabled',
  );
});

test('platform settings read routes are mounted behind admin route group', () => {
  const adminRoutesSource = readSource('src/routes/v1/admin.routes.ts');

  assert.match(adminRoutesSource, /platformSettingsRoutes/);
  assert.match(adminRoutesSource, /router\.use\('\/settings', authenticate\(\), requireRole\(adminRoles\), platformSettingsRoutes\)/);
});

test('platform settings read routes are permission gated', () => {
  const source = readSource('src/modules/platform-settings/routes/platform-settings.routes.ts');

  assert.match(source, /router\.get\(\s*'\/'/);
  assert.match(source, /router\.get\(\s*'\/:settingKey'/);
  assert.match(source, /PLATFORM_SETTINGS_PERMISSIONS\.READ/);
  assert.doesNotMatch(source, /router\.(post|put|delete)/);
});

test('platform settings update and audit routes are permission gated', () => {
  const source = readSource('src/modules/platform-settings/routes/platform-settings.routes.ts');

  assert.match(source, /router\.patch\(\s*'\/:settingKey'/);
  assert.match(source, /router\.get\(\s*'\/:settingKey\/audit'/);
  assert.match(source, /PLATFORM_SETTINGS_PERMISSIONS\.MANAGE/);
  assert.match(source, /PLATFORM_SETTINGS_PERMISSIONS\.READ/);
  assert.match(source, /updatePlatformSettingValidator/);
});

test('platform settings OpenAPI documents all module endpoints and update reason', () => {
  const source = readSource('src/docs/openapi/platform-settings.paths.ts');

  assert.match(source, /'\/admin\/settings'/);
  assert.match(source, /'\/admin\/settings\/\{settingKey\}'/);
  assert.match(source, /'\/admin\/settings\/\{settingKey\}\/audit'/);
  assert.match(source, /required: \['value', 'reason'\]/);
  assert.match(source, /summary: 'Update platform setting'/);
});

test('platform settings backend avoids unrelated domain mutation workflows', () => {
  const source = collectSources('src/modules/platform-settings').join('\n');

  assert.doesNotMatch(
    source,
    /refund|payout|commission|promotion|tax|orderStatus|deliveryAgent|supportTicket|catalog|customerStatus|storeOperationalStatus/i,
  );
  assert.doesNotMatch(source, /router\.(post|put|delete)/);
});
