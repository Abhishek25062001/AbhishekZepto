import assert from 'node:assert/strict';
import { test } from 'node:test';

import { canCreateStore, canDeleteStore } from '../../utils/store-permissions.util';

test('store list delete requires stores:delete', () => {
  assert.equal(canDeleteStore(['stores:read']), false);
  assert.equal(canCreateStore(['stores:create']), true);
});
