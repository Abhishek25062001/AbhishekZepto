import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  cityIdParamValidator,
  customerIdParamValidator,
  deliveryAgentIdParamValidator,
  storeIdParamValidator,
  tenantScopeQueryValidator,
  vendorIdParamValidator,
  vendorStoreScopeParamValidator,
} from './tenant.validators';

const objectId = '68295cf6d5cc8fddf6b8d201';

test('tenant scope param validators accept valid object ids', () => {
  assert.equal(vendorIdParamValidator.parse({ vendorId: objectId }).vendorId, objectId);
  assert.equal(storeIdParamValidator.parse({ storeId: objectId }).storeId, objectId);
  assert.equal(cityIdParamValidator.parse({ cityId: objectId }).cityId, objectId);
  assert.equal(
    customerIdParamValidator.parse({ customerId: objectId }).customerId,
    objectId,
  );
  assert.equal(
    deliveryAgentIdParamValidator.parse({ deliveryAgentId: objectId }).deliveryAgentId,
    objectId,
  );
});

test('vendorStoreScopeParamValidator requires both vendor and store ids', () => {
  assert.deepEqual(vendorStoreScopeParamValidator.parse({
    vendorId: objectId,
    storeId: objectId,
  }), {
    vendorId: objectId,
    storeId: objectId,
  });
});

test('tenantScopeQueryValidator normalizes blank ids to undefined', () => {
  assert.deepEqual(
    tenantScopeQueryValidator.parse({
      vendorId: ` ${objectId} `,
      storeId: '   ',
      cityId: undefined,
      customerId: objectId,
      deliveryAgentId: '   ',
    }),
    {
      vendorId: objectId,
      storeId: undefined,
      cityId: undefined,
      customerId: objectId,
      deliveryAgentId: undefined,
    },
  );
});

test('tenantScopeQueryValidator rejects malformed object ids', () => {
  assert.throws(
    () => tenantScopeQueryValidator.parse({ customerId: 'bad-id' }),
    /Invalid Mongo ObjectId/,
  );
});
