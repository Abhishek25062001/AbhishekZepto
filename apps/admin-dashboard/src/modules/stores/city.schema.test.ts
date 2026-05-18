import assert from 'node:assert/strict';
import { test } from 'node:test';
import { LOCATION_STATUS } from './constants/store.constants';
import { cityFormSchema } from './forms/city.schema';

test('cityFormSchema requires core location fields', () => {
  const result = cityFormSchema.safeParse({
    country: 'India',
    currencyCode: 'INR',
    name: 'Mumbai',
    state: 'MH',
    status: LOCATION_STATUS.ACTIVE,
    timezone: 'Asia/Kolkata',
  });
  assert.equal(result.success, true);
});

test('cityFormSchema rejects missing state', () => {
  const result = cityFormSchema.safeParse({
    country: 'India',
    currencyCode: 'INR',
    name: 'Mumbai',
    status: LOCATION_STATUS.ACTIVE,
    timezone: 'Asia/Kolkata',
  });
  assert.equal(result.success, false);
});
