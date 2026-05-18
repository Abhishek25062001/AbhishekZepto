import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  buildCityScopeFilter,
  buildCustomerScopeFilter,
  buildDeliveryAgentScopeFilter,
  buildStoreScopeFilter,
  buildTenantScopeFilter,
  buildVendorScopeFilter,
  normalizeTenantScopeQuery,
} from './tenant-query-helpers';

test('normalizeTenantScopeQuery trims supported tenant scope fields', () => {
  assert.deepEqual(
    normalizeTenantScopeQuery({
      vendorId: '  vendor-1  ',
      storeId: ' store-1 ',
      cityId: ' city-1 ',
      customerId: ' customer-1 ',
      deliveryAgentId: ' delivery-1 ',
    }),
    {
      vendorId: 'vendor-1',
      storeId: 'store-1',
      cityId: 'city-1',
      customerId: 'customer-1',
      deliveryAgentId: 'delivery-1',
    },
  );
});

test('normalizeTenantScopeQuery collapses blank values to null', () => {
  assert.deepEqual(
    normalizeTenantScopeQuery({
      vendorId: '   ',
      storeId: undefined,
      cityId: null,
      customerId: '',
      deliveryAgentId: '   ',
    }),
    {
      vendorId: null,
      storeId: null,
      cityId: null,
      customerId: null,
      deliveryAgentId: null,
    },
  );
});

test('scope filter helpers emit field-specific filters only when values are present', () => {
  assert.deepEqual(buildVendorScopeFilter('vendor-1'), { vendorId: 'vendor-1' });
  assert.deepEqual(buildStoreScopeFilter('store-1'), { storeId: 'store-1' });
  assert.deepEqual(buildCityScopeFilter('city-1'), { cityId: 'city-1' });
  assert.deepEqual(buildCustomerScopeFilter('customer-1'), {
    customerId: 'customer-1',
  });
  assert.deepEqual(buildDeliveryAgentScopeFilter('delivery-1'), {
    deliveryAgentId: 'delivery-1',
  });
  assert.deepEqual(buildVendorScopeFilter('   '), {});
});

test('buildTenantScopeFilter combines vendor store city customer and delivery filters', () => {
  assert.deepEqual(
    buildTenantScopeFilter({
      vendorId: 'vendor-1',
      storeId: 'store-1',
      cityId: 'city-1',
      customerId: 'customer-1',
      deliveryAgentId: 'delivery-1',
    }),
    {
      vendorId: 'vendor-1',
      storeId: 'store-1',
      cityId: 'city-1',
      customerId: 'customer-1',
      deliveryAgentId: 'delivery-1',
    },
  );
});
