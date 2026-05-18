import assert from 'node:assert/strict';
import { test } from 'node:test';
import * as variantServiceModule from '../services/product-variant.service';
import {
  createProductVariantController,
  deleteProductVariantController,
  listProductVariantsController,
  updateProductVariantController,
} from './product-variant.controller';

const mutableVariantService = variantServiceModule as unknown as {
  listProductVariants: (...args: unknown[]) => Promise<unknown>;
  createProductVariant: (...args: unknown[]) => Promise<unknown>;
  updateProductVariant: (...args: unknown[]) => Promise<unknown>;
  deleteProductVariant: (...args: unknown[]) => Promise<unknown>;
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

const buildVariantResponse = () => ({
  id: '507f1f77bcf86cd799439011',
  productId: '507f1f77bcf86cd799439012',
  variantName: '500 g',
  sku: 'MILK-500',
  barcode: null,
  unit: 'g',
  unitValue: 500,
  mrp: 60,
  defaultSellingPrice: 55,
  weightInGrams: 500,
  lengthCm: null,
  widthCm: null,
  heightCm: null,
  imageUrl: null,
  attributeValues: null,
  isDefault: true,
  isVisible: true,
  status: 'active',
  createdAt: new Date('2026-01-01T00:00:00.000Z'),
  updatedAt: new Date('2026-01-01T00:00:00.000Z'),
});

test('listProductVariantsController returns paginated payload', async () => {
  mutableVariantService.listProductVariants = async () => ({
    items: [buildVariantResponse()],
    pagination: {
      page: 1,
      limit: 20,
      total: 1,
      totalPages: 1,
      hasNextPage: false,
      hasPreviousPage: false,
    },
  });

  const response = await runController(listProductVariantsController, {
    params: { productId: '507f1f77bcf86cd799439012' },
    query: { page: 1, limit: 20 },
  });
  const body = response.body as { success: boolean; data: unknown[] };

  assert.equal(response.statusCode, 200);
  assert.equal(body.data.length, 1);
});

test('createProductVariantController returns created variant', async () => {
  mutableVariantService.createProductVariant = async () => buildVariantResponse();

  const response = await runController(createProductVariantController, {
    params: { productId: '507f1f77bcf86cd799439012' },
    body: {
      variantName: '500 g',
      sku: 'MILK-500',
      unit: 'g',
      unitValue: 500,
      mrp: 60,
    },
    user: { userId: '507f1f77bcf86cd799439013' },
  });

  assert.equal(response.statusCode, 201);
});

test('updateProductVariantController returns updated variant', async () => {
  mutableVariantService.updateProductVariant = async () => ({
    ...buildVariantResponse(),
    variantName: '1 L',
  });

  const response = await runController(updateProductVariantController, {
    params: {
      productId: '507f1f77bcf86cd799439012',
      variantId: '507f1f77bcf86cd799439011',
    },
    body: { variantName: '1 L' },
    user: { userId: '507f1f77bcf86cd799439013' },
  });

  assert.equal(response.statusCode, 200);
});

test('deleteProductVariantController returns deleted variant', async () => {
  mutableVariantService.deleteProductVariant = async () => buildVariantResponse();

  const response = await runController(deleteProductVariantController, {
    params: {
      productId: '507f1f77bcf86cd799439012',
      variantId: '507f1f77bcf86cd799439011',
    },
    user: { userId: '507f1f77bcf86cd799439013' },
  });

  assert.equal(response.statusCode, 200);
});
