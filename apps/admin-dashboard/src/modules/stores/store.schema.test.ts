import assert from 'node:assert/strict';
import { test } from 'node:test';
import { FULFILLMENT_TYPE, STORE_STATUS, STORE_TYPE } from './constants/store.constants';
import { storeFormSchema } from './forms/store.schema';

const base = {
  addressLine1: 'Line 1',
  cityId: 'city-1',
  closingTime: '22:00',
  fulfillmentType: FULFILLMENT_TYPE.DELIVERY,
  latitude: 19,
  longitude: 72,
  name: 'Store',
  openingTime: '08:00',
  operatingDays: ['mon'],
  phone: '9999999999',
  pincode: '400001',
  serviceRadiusKm: 5,
  status: STORE_STATUS.ACTIVE,
  storeType: STORE_TYPE.GROCERY,
  vendorId: 'vendor-1',
};

test('storeFormSchema requires closure reason when closed', () => {
  const result = storeFormSchema.safeParse({ ...base, isOpen: false, isAcceptingOrders: true });
  assert.equal(result.success, false);
});

test('storeFormSchema accepts open store without closure reason', () => {
  const result = storeFormSchema.safeParse({ ...base, isAcceptingOrders: true, isOpen: true });
  assert.equal(result.success, true);
});
