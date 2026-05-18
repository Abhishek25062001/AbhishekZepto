import assert from 'node:assert/strict';
import { test } from 'node:test';

import { parseOptionalString } from '../../utils/inventory-query-param.util';

test('movement list filters use optional string parsing', () => {
  assert.equal(parseOptionalString('order-1'), 'order-1');
  assert.equal(parseOptionalString(null), undefined);
});
