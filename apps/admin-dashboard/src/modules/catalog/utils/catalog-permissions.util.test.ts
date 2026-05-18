import assert from 'node:assert/strict';
import { test } from 'node:test';

import {
  canApproveCatalog,
  canCreateCatalog,
  canDeleteCatalog,
  canReadCatalog,
  canUpdateCatalog,
  canUploadMedia,
} from './catalog-permissions.util';

test('catalog permission helpers honor exact grants', () => {
  assert.equal(canReadCatalog(['catalog:read']), true);
  assert.equal(canReadCatalog(['users:read']), false);
  assert.equal(canCreateCatalog(['catalog:create']), true);
  assert.equal(canUpdateCatalog(['catalog:update']), true);
  assert.equal(canDeleteCatalog(['catalog:delete']), true);
  assert.equal(canApproveCatalog(['catalog:approve']), true);
  assert.equal(canUploadMedia(['media:upload']), true);
});

test('catalog permission helpers allow super admin wildcard', () => {
  assert.equal(canReadCatalog(['*:*']), true);
  assert.equal(canUploadMedia(['*:*']), true);
});
