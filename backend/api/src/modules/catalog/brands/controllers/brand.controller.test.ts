import assert from 'node:assert/strict';
import { test } from 'node:test';
import * as brandServiceModule from '../services/brand.service';
import {
  createBrandController,
  deleteBrandController,
  getBrandByIdController,
  listBrandsController,
  updateBrandController,
} from './brand.controller';

const mutableBrandService = brandServiceModule as unknown as {
  listBrands: (...args: unknown[]) => Promise<unknown>;
  createBrand: (...args: unknown[]) => Promise<unknown>;
  getBrandById: (...args: unknown[]) => Promise<unknown>;
  updateBrand: (...args: unknown[]) => Promise<unknown>;
  deleteBrand: (...args: unknown[]) => Promise<unknown>;
};

type MockRequest = {
  body?: Record<string, unknown>;
  params?: Record<string, string>;
  query?: Record<string, unknown>;
  user?: { userId: string };
  requestId?: string;
  traceId?: string;
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

const buildBrandResponse = () => ({
  id: '507f1f77bcf86cd799439011',
  name: 'Amul',
  slug: 'amul',
  description: null,
  logoUrl: null,
  bannerUrl: null,
  isFeatured: false,
  isVisible: true,
  status: 'active',
  createdAt: new Date('2026-01-01T00:00:00.000Z'),
  updatedAt: new Date('2026-01-01T00:00:00.000Z'),
});

test('listBrandsController returns paginated payload', async () => {
  mutableBrandService.listBrands = async () => ({
    items: [buildBrandResponse()],
    pagination: {
      page: 1,
      limit: 20,
      total: 1,
      totalPages: 1,
      hasNextPage: false,
      hasPreviousPage: false,
    },
  });

  const response = await runController(listBrandsController, { query: { page: 1, limit: 20 } });
  const body = response.body as { success: boolean; data: unknown[] };

  assert.equal(response.statusCode, 200);
  assert.equal(body.success, true);
  assert.equal(body.data.length, 1);
});

test('createBrandController returns created brand', async () => {
  mutableBrandService.createBrand = async () => buildBrandResponse();

  const response = await runController(createBrandController, {
    body: { name: 'Amul' },
    user: { userId: '507f1f77bcf86cd799439012' },
  });
  const body = response.body as { success: boolean; data: { name: string } };

  assert.equal(response.statusCode, 201);
  assert.equal(body.data.name, 'Amul');
});

test('getBrandByIdController returns brand', async () => {
  mutableBrandService.getBrandById = async () => buildBrandResponse();

  const response = await runController(getBrandByIdController, {
    params: { brandId: '507f1f77bcf86cd799439011' },
  });
  const body = response.body as { success: boolean };

  assert.equal(response.statusCode, 200);
  assert.equal(body.success, true);
});

test('updateBrandController returns updated brand', async () => {
  mutableBrandService.updateBrand = async () => ({ ...buildBrandResponse(), name: 'Amul Fresh' });

  const response = await runController(updateBrandController, {
    params: { brandId: '507f1f77bcf86cd799439011' },
    body: { name: 'Amul Fresh' },
    user: { userId: '507f1f77bcf86cd799439012' },
  });
  const body = response.body as { success: boolean; data: { name: string } };

  assert.equal(response.statusCode, 200);
  assert.equal(body.data.name, 'Amul Fresh');
});

test('deleteBrandController returns deleted brand', async () => {
  mutableBrandService.deleteBrand = async () => buildBrandResponse();

  const response = await runController(deleteBrandController, {
    params: { brandId: '507f1f77bcf86cd799439011' },
    user: { userId: '507f1f77bcf86cd799439012' },
  });
  const body = response.body as { success: boolean };

  assert.equal(response.statusCode, 200);
  assert.equal(body.success, true);
});
