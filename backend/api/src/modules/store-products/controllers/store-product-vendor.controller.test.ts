import assert from 'node:assert/strict';
import { test } from 'node:test';
import * as storeProductVendorServiceModule from '../services/store-product-vendor.service';
import {
  getVendorStoreProductByIdController,
  listVendorStoreProductsController,
  updateVendorStoreProductPriceController,
} from './store-product-vendor.controller';

const mutableVendorService = storeProductVendorServiceModule as unknown as {
  listVendorStoreProducts: (...args: unknown[]) => Promise<unknown>;
  getVendorStoreProductById: (...args: unknown[]) => Promise<unknown>;
  updateVendorStoreProductPrice: (...args: unknown[]) => Promise<unknown>;
};

type MockRequest = {
  body?: Record<string, unknown>;
  params?: Record<string, string>;
  query?: Record<string, unknown>;
  user?: { userId: string; vendorId?: string; storeId?: string };
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

const buildStoreProductResponse = () => ({
  id: '507f1f77bcf86cd799439013',
  storeId: '507f1f77bcf86cd799439011',
  sellingPrice: 70,
  finalPrice: 70,
  isPriceLocked: false,
});

test('listVendorStoreProductsController returns paginated payload', async () => {
  mutableVendorService.listVendorStoreProducts = async () => ({
    items: [buildStoreProductResponse()],
    pagination: {
      page: 1,
      limit: 20,
      total: 1,
      totalPages: 1,
      hasNextPage: false,
      hasPreviousPage: false,
    },
  });

  const response = await runController(listVendorStoreProductsController, {
    query: { page: 1, limit: 20 },
    user: { userId: '507f1f77bcf86cd799439015', vendorId: '65f0a0000000000000000001', storeId: '507f1f77bcf86cd799439011' },
  });
  const body = response.body as { success: boolean; data: unknown[] };

  assert.equal(response.statusCode, 200);
  assert.equal(body.success, true);
});

test('getVendorStoreProductByIdController returns mapping', async () => {
  mutableVendorService.getVendorStoreProductById = async () => buildStoreProductResponse();

  const response = await runController(getVendorStoreProductByIdController, {
    params: { storeProductId: '507f1f77bcf86cd799439013' },
    user: { userId: '507f1f77bcf86cd799439015', vendorId: '65f0a0000000000000000001' },
  });
  const body = response.body as { success: boolean; data: { id: string } };

  assert.equal(response.statusCode, 200);
  assert.equal(body.data.id, '507f1f77bcf86cd799439013');
});

test('updateVendorStoreProductPriceController returns updated mapping', async () => {
  mutableVendorService.updateVendorStoreProductPrice = async () => ({
    ...buildStoreProductResponse(),
    sellingPrice: 65,
  });

  const response = await runController(updateVendorStoreProductPriceController, {
    params: { storeProductId: '507f1f77bcf86cd799439013' },
    body: { sellingPrice: 65 },
    user: {
      userId: '507f1f77bcf86cd799439015',
      vendorId: '65f0a0000000000000000001',
      storeId: '507f1f77bcf86cd799439011',
    },
  });
  const body = response.body as { success: boolean; data: { sellingPrice: number } };

  assert.equal(response.statusCode, 200);
  assert.equal(body.data.sellingPrice, 65);
});
