import assert from 'node:assert/strict';
import { test } from 'node:test';

import { canCreateLocation } from '../../utils/store-permissions.util';

test('service area create hidden without permission', () => {
  assert.equal(canCreateLocation(['locations:read']), false);
});
