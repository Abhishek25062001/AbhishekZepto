import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  canCreateLocation,
  canCreateStore,
  canDeleteLocation,
  canReadLocations,
  canReadStores,
} from './utils/store-permissions.util';

test('store permission helpers honor exact grants', () => {
  assert.equal(canReadLocations(['locations:read']), true);
  assert.equal(canCreateLocation(['locations:create']), true);
  assert.equal(canDeleteLocation(['locations:delete']), true);
  assert.equal(canReadStores(['stores:read']), true);
  assert.equal(canCreateStore(['stores:create']), true);
});

test('store permission helpers allow wildcard', () => {
  assert.equal(canReadLocations(['*:*']), true);
  assert.equal(canReadStores(['*:*']), true);
});
