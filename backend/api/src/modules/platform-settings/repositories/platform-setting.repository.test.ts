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

test('platform settings model defines the documented collection and indexes', () => {
  const source = readSource('src/modules/platform-settings/models/platform-setting.model.ts');

  assert.match(source, /COLLECTION_NAMES\.PLATFORM_SETTINGS/);
  assert.match(source, /key: \{ type: String, required: true, unique: true/);
  assert.match(source, /category: 1, scopeType: 1, scopeId: 1/);
  assert.match(source, /value: \{ type: Schema\.Types\.Mixed, required: true \}/);
  assert.match(source, /isEditable: \{ type: Boolean, default: true/);
});

test('platform settings repository exposes list detail and editable update primitives only', () => {
  const source = readSource('src/modules/platform-settings/repositories/platform-setting.repository.ts');

  assert.match(source, /findPlatformSettingByKey/);
  assert.match(source, /listPlatformSettingRecords/);
  assert.match(source, /updatePlatformSettingValueRecord/);
  assert.match(source, /key: settingKey\.trim\(\), isEditable: true/);
  assert.doesNotMatch(source, /deleteMany|deleteOne|remove|bulkWrite/);
});
