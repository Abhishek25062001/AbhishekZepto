import assert from 'node:assert/strict';
import { test } from 'node:test';
import * as productServiceModule from '../services/product.service';
import {
  createProductController,
  deleteProductController,
  getProductByIdController,
  listProductsController,
  updateProductApprovalStatusController,
  updateProductController,
} from './product.controller';

const mutableProductService = productServiceModule as unknown as {
  listProducts: (...args: unknown[]) => Promise<unknown>;
  createProduct: (...args: unknown[]) => Promise<unknown>;
  getProductById: (...args: unknown[]) => Promise<unknown>;
  updateProduct: (...args: unknown[]) => Promise<unknown>;
  updateProductApprovalStatus: (...args: unknown[]) => Promise<unknown>;
  deleteProduct: (...args: unknown[]) => Promise<unknown>;
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

const buildProductResponse = () => ({
  id: '507f1f77bcf86cd799439011',
  name: 'Milk',
  slug: 'milk',
  description: null,
  shortDescription: null,
  categoryId: '507f1f77bcf86cd799439012',
  subcategoryId: null,
  brandId: null,
  productType: 'simple',
  foodType: 'veg',
  taxCategoryId: null,
  hsnCode: null,
  searchKeywords: [],
  tags: [],
  defaultImageUrl: null,
  imageUrls: [],
  attributeSummary: null,
  isFeatured: false,
  isVisible: true,
  approvalStatus: 'draft',
  status: 'active',
  createdAt: new Date('2026-01-01T00:00:00.000Z'),
  updatedAt: new Date('2026-01-01T00:00:00.000Z'),
});

test('listProductsController returns paginated payload', async () => {
  mutableProductService.listProducts = async () => ({
    items: [buildProductResponse()],
    pagination: {
      page: 1,
      limit: 20,
      total: 1,
      totalPages: 1,
      hasNextPage: false,
      hasPreviousPage: false,
    },
  });

  const response = await runController(listProductsController, { query: { page: 1, limit: 20 } });
  const body = response.body as { success: boolean; data: unknown[] };

  assert.equal(response.statusCode, 200);
  assert.equal(body.data.length, 1);
});

test('createProductController returns created product', async () => {
  mutableProductService.createProduct = async () => buildProductResponse();

  const response = await runController(createProductController, {
    body: {
      name: 'Milk',
      categoryId: '507f1f77bcf86cd799439012',
      productType: 'simple',
    },
    user: { userId: '507f1f77bcf86cd799439013' },
  });

  assert.equal(response.statusCode, 201);
});

test('getProductByIdController returns product', async () => {
  mutableProductService.getProductById = async () => buildProductResponse();

  const response = await runController(getProductByIdController, {
    params: { productId: '507f1f77bcf86cd799439011' },
  });

  assert.equal(response.statusCode, 200);
});

test('updateProductController returns updated product', async () => {
  mutableProductService.updateProduct = async () => ({
    ...buildProductResponse(),
    name: 'Organic Milk',
  });

  const response = await runController(updateProductController, {
    params: { productId: '507f1f77bcf86cd799439011' },
    body: { name: 'Organic Milk' },
    user: { userId: '507f1f77bcf86cd799439013' },
  });

  assert.equal(response.statusCode, 200);
});

test('updateProductApprovalStatusController returns updated approval', async () => {
  mutableProductService.updateProductApprovalStatus = async () => ({
    ...buildProductResponse(),
    approvalStatus: 'approved',
  });

  const response = await runController(updateProductApprovalStatusController, {
    params: { productId: '507f1f77bcf86cd799439011' },
    body: { approvalStatus: 'approved' },
    user: { userId: '507f1f77bcf86cd799439013' },
  });

  assert.equal(response.statusCode, 200);
});

test('deleteProductController returns deleted product', async () => {
  mutableProductService.deleteProduct = async () => buildProductResponse();

  const response = await runController(deleteProductController, {
    params: { productId: '507f1f77bcf86cd799439011' },
    user: { userId: '507f1f77bcf86cd799439013' },
  });

  assert.equal(response.statusCode, 200);
});
