import assert from 'node:assert/strict';
import { test } from 'node:test';
import * as storeProductServiceModule from '../services/store-product.service';
import {
  createStoreProductController,
  getStoreProductByIdController,
  listStoreProductsController,
} from './store-product.controller';

const mutableStoreProductService = storeProductServiceModule as unknown as {
  listStoreProducts: (...args: unknown[]) => Promise<unknown>;
  createStoreProduct: (...args: unknown[]) => Promise<unknown>;
  getStoreProductById: (...args: unknown[]) => Promise<unknown>;
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

const buildStoreProductResponse = () => ({
  id: '507f1f77bcf86cd799439013',
  storeId: '507f1f77bcf86cd799439011',
  productId: '507f1f77bcf86cd799439012',
  variantId: '507f1f77bcf86cd799439014',
  sku: 'MILK-1L',
  mrp: 100,
  sellingPrice: 80,
  finalPrice: 72,
  status: 'active',
  isAvailable: true,
  isVisible: true,
});

test('listStoreProductsController returns paginated payload', async () => {
  mutableStoreProductService.listStoreProducts = async () => ({
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

  const response = await runController(listStoreProductsController, { query: { page: 1, limit: 20 } });
  const body = response.body as { success: boolean; data: unknown[] };

  assert.equal(response.statusCode, 200);
  assert.equal(body.success, true);
});

test('createStoreProductController returns created mapping', async () => {
  mutableStoreProductService.createStoreProduct = async () => buildStoreProductResponse();

  const response = await runController(createStoreProductController, {
    body: {
      storeId: '507f1f77bcf86cd799439011',
      productId: '507f1f77bcf86cd799439012',
      variantId: '507f1f77bcf86cd799439014',
      mrp: 100,
      sellingPrice: 80,
    },
    user: { userId: '507f1f77bcf86cd799439015' },
  });
  const body = response.body as { success: boolean; data: { sku: string } };

  assert.equal(response.statusCode, 201);
  assert.equal(body.success, true);
  assert.equal(body.data.sku, 'MILK-1L');
});

test('getStoreProductByIdController returns mapping', async () => {
  mutableStoreProductService.getStoreProductById = async () => buildStoreProductResponse();

  const response = await runController(getStoreProductByIdController, {
    params: { storeProductId: '507f1f77bcf86cd799439013' },
  });
  const body = response.body as { success: boolean; data: { id: string } };

  assert.equal(response.statusCode, 200);
  assert.equal(body.data.id, '507f1f77bcf86cd799439013');
});
