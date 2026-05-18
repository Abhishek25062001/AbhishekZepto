import assert from 'node:assert/strict';
import { test } from 'node:test';

import { canCreateLocation, canDeleteLocation } from '../../utils/store-permissions.util';

test('city list create hidden without locations:create', () => {
  assert.equal(canCreateLocation(['locations:read']), false);
  assert.equal(canDeleteLocation(['locations:delete']), true);
});
