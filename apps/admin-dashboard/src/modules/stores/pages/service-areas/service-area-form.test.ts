import assert from 'node:assert/strict';
import { test } from 'node:test';

import { LOCATION_STATUS } from '../../constants/store.constants';
import { serviceAreaFormSchema } from '../../forms/service-area.schema';

test('service area form requires city and name', () => {
  const result = serviceAreaFormSchema.safeParse({ status: LOCATION_STATUS.ACTIVE });
  assert.equal(result.success, false);
});
