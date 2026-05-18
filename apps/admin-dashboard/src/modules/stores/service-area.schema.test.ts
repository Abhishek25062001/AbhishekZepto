import assert from 'node:assert/strict';
import { test } from 'node:test';
import { LOCATION_STATUS } from './constants/store.constants';
import { serviceAreaFormSchema } from './forms/service-area.schema';

test('serviceAreaFormSchema accepts valid polygon JSON', () => {
  const result = serviceAreaFormSchema.safeParse({
    cityId: 'city-1',
    name: 'Zone A',
    polygonJson: '[{"lat":1,"lng":2}]',
    status: LOCATION_STATUS.ACTIVE,
  });
  assert.equal(result.success, true);
});

test('serviceAreaFormSchema rejects invalid polygon JSON', () => {
  const result = serviceAreaFormSchema.safeParse({
    cityId: 'city-1',
    name: 'Zone A',
    polygonJson: '{bad',
    status: LOCATION_STATUS.ACTIVE,
  });
  assert.equal(result.success, false);
});
