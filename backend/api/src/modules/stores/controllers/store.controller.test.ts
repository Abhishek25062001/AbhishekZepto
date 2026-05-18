import assert from 'node:assert/strict';
import { test } from 'node:test';
import * as storeServiceModule from '../services/store.service';
import {
  createStoreController,
  deleteStoreController,
  getStoreByIdController,
  listStoresController,
  updateStoreController,
} from './store.controller';

const mutableStoreService = storeServiceModule as unknown as {
  listStores: (...args: unknown[]) => Promise<unknown>;
  createStore: (...args: unknown[]) => Promise<unknown>;
  getStoreById: (...args: unknown[]) => Promise<unknown>;
  updateStore: (...args: unknown[]) => Promise<unknown>;
  deleteStore: (...args: unknown[]) => Promise<unknown>;
};

type MockRequest = {
  body?: Record<string, unknown>;
  params?: Record<string, string>;
  query?: Record<string, unknown>;
  user?: { userId: string };
};

type MockResponse = {
  statusCode?: number;
  status: (code: number) => MockResponse;
  json: (payload: unknown) => MockResponse;
};

const createMockResponse = (onJson: (payload: unknown, statusCode: number) => void): MockResponse => {
  const response: MockResponse = {
    statusCode: undefined,
    status(code: number) {
      response.statusCode = code;
      return response;
    },
    json(payload: unknown) {
      onJson(payload, response.statusCode ?? 200);
      return response;
    },
  };
  return response;
};

const runController = async (controller: unknown, req: MockRequest) =>
  new Promise<{ body: unknown; statusCode: number }>((resolve, reject) => {
    const res = createMockResponse((body, statusCode) => resolve({ body, statusCode }));
    (controller as (req: MockRequest, res: MockResponse, next: (error?: unknown) => void) => void)(
      req,
      res,
      (error?: unknown) => {
        if (error) reject(error);
      },
    );
  });

const buildStoreResponse = () => ({
  id: '507f1f77bcf86cd799439013',
  vendorId: '65f0a0000000000000000001',
  cityId: '507f1f77bcf86cd799439011',
  serviceAreaIds: [],
  name: 'Zepto Dwarka',
  slug: 'zepto-dwarka',
  code: 'STORE-000001',
  storeType: 'grocery',
  fulfillmentType: 'delivery',
  status: 'active',
  isOpen: true,
  isAcceptingOrders: true,
  createdAt: new Date('2026-01-01T00:00:00.000Z'),
  updatedAt: new Date('2026-01-01T00:00:00.000Z'),
});

test('listStoresController returns paginated payload', async () => {
  mutableStoreService.listStores = async () => ({
    items: [buildStoreResponse()],
    pagination: {
      page: 1,
      limit: 20,
      total: 1,
      totalPages: 1,
      hasNextPage: false,
      hasPreviousPage: false,
    },
  });

  const response = await runController(listStoresController, { query: { page: 1, limit: 20 } });
  const body = response.body as { success: boolean; data: unknown[] };

  assert.equal(response.statusCode, 200);
  assert.equal(body.success, true);
});

test('createStoreController returns created store', async () => {
  mutableStoreService.createStore = async () => buildStoreResponse();

  const response = await runController(createStoreController, {
    body: {
      vendorId: '65f0a0000000000000000001',
      cityId: '507f1f77bcf86cd799439011',
      name: 'Zepto Dwarka',
      phone: '9999999999',
      addressLine1: 'Sector 10',
      pincode: '110075',
      latitude: 28.5921,
      longitude: 77.046,
      serviceRadiusKm: 5,
      openingTime: '08:00',
      closingTime: '22:00',
      operatingDays: ['mon'],
      storeType: 'grocery',
      fulfillmentType: 'delivery',
    },
    user: { userId: '507f1f77bcf86cd799439012' },
  });
  const body = response.body as { success: boolean; data: { name: string } };

  assert.equal(response.statusCode, 201);
  assert.equal(body.data.name, 'Zepto Dwarka');
});

test('getStoreByIdController returns store', async () => {
  mutableStoreService.getStoreById = async () => buildStoreResponse();

  const response = await runController(getStoreByIdController, {
    params: { storeId: '507f1f77bcf86cd799439013' },
  });
  const body = response.body as { success: boolean };

  assert.equal(response.statusCode, 200);
  assert.equal(body.success, true);
});

test('updateStoreController returns updated store', async () => {
  mutableStoreService.updateStore = async () => ({ ...buildStoreResponse(), name: 'Zepto Dwarka Hub' });

  const response = await runController(updateStoreController, {
    params: { storeId: '507f1f77bcf86cd799439013' },
    body: { name: 'Zepto Dwarka Hub' },
    user: { userId: '507f1f77bcf86cd799439012' },
  });
  const body = response.body as { success: boolean; data: { name: string } };

  assert.equal(response.statusCode, 200);
  assert.equal(body.data.name, 'Zepto Dwarka Hub');
});

test('deleteStoreController returns deleted store', async () => {
  mutableStoreService.deleteStore = async () => buildStoreResponse();

  const response = await runController(deleteStoreController, {
    params: { storeId: '507f1f77bcf86cd799439013' },
    user: { userId: '507f1f77bcf86cd799439012' },
  });
  const body = response.body as { success: boolean };

  assert.equal(response.statusCode, 200);
  assert.equal(body.success, true);
});
