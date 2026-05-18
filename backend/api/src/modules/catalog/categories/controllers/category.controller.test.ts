import assert from 'node:assert/strict';
import { test } from 'node:test';
import * as categoryServiceModule from '../services/category.service';
import {
  createCategoryController,
  deleteCategoryController,
  getCategoryByIdController,
  listCategoriesController,
  updateCategoryController,
} from './category.controller';

const mutableCategoryService = categoryServiceModule as unknown as {
  listCategories: (...args: unknown[]) => Promise<unknown>;
  createCategory: (...args: unknown[]) => Promise<unknown>;
  getCategoryById: (...args: unknown[]) => Promise<unknown>;
  updateCategory: (...args: unknown[]) => Promise<unknown>;
  deleteCategory: (...args: unknown[]) => Promise<unknown>;
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
  body?: unknown;
  statusCode?: number;
  status: (code: number) => MockResponse;
  json: (payload: unknown) => MockResponse;
};

const createMockResponse = (
  onJson: (payload: unknown, statusCode: number) => void,
): MockResponse => {
  const response: MockResponse = {
    body: undefined,
    statusCode: undefined,
    status(code: number) {
      response.statusCode = code;
      return response;
    },
    json(payload: unknown) {
      response.body = payload;
      onJson(payload, response.statusCode ?? 200);
      return response;
    },
  };

  return response;
};

const runController = async (controller: unknown, req: MockRequest) => {
  return new Promise<{ body: unknown; statusCode: number }>((resolve, reject) => {
    const res = createMockResponse((body, statusCode) => {
      resolve({
        body,
        statusCode,
      });
    });

    (controller as (req: MockRequest, res: MockResponse, next: (error?: unknown) => void) => void)(
      req,
      res,
      (error?: unknown) => {
        if (error) {
          reject(error);
        }
      },
    );
  });
};

const buildCategoryResponse = () => ({
  id: '507f1f77bcf86cd799439011',
  name: 'Groceries',
  slug: 'groceries',
  description: null,
  parentCategoryId: null,
  level: 1,
  displayOrder: 0,
  iconUrl: null,
  bannerUrl: null,
  isFeatured: false,
  isVisible: true,
  status: 'active',
  createdAt: new Date('2026-01-01T00:00:00.000Z'),
  updatedAt: new Date('2026-01-01T00:00:00.000Z'),
});

test('listCategoriesController returns paginated payload', async () => {
  mutableCategoryService.listCategories = async () => ({
    items: [buildCategoryResponse()],
    pagination: {
      page: 1,
      limit: 20,
      total: 1,
      totalPages: 1,
      hasNextPage: false,
      hasPreviousPage: false,
    },
  });

  const response = await runController(listCategoriesController, {
    query: {
      page: 1,
      limit: 20,
    },
  });

  const body = response.body as { success: boolean; data: unknown[] };

  assert.equal(response.statusCode, 200);
  assert.equal(body.success, true);
  assert.equal(body.data.length, 1);
});

test('createCategoryController returns created category', async () => {
  mutableCategoryService.createCategory = async () => buildCategoryResponse();

  const response = await runController(createCategoryController, {
    body: {
      name: 'Groceries',
    },
    user: {
      userId: '507f1f77bcf86cd799439012',
    },
  });

  const body = response.body as { success: boolean; data: { name: string } };

  assert.equal(response.statusCode, 201);
  assert.equal(body.success, true);
  assert.equal(body.data.name, 'Groceries');
});

test('getCategoryByIdController returns category', async () => {
  mutableCategoryService.getCategoryById = async () => buildCategoryResponse();

  const response = await runController(getCategoryByIdController, {
    params: {
      categoryId: '507f1f77bcf86cd799439011',
    },
  });

  const body = response.body as { success: boolean };

  assert.equal(response.statusCode, 200);
  assert.equal(body.success, true);
});

test('updateCategoryController returns updated category', async () => {
  mutableCategoryService.updateCategory = async () => ({
    ...buildCategoryResponse(),
    name: 'Updated Groceries',
  });

  const response = await runController(updateCategoryController, {
    params: {
      categoryId: '507f1f77bcf86cd799439011',
    },
    body: {
      name: 'Updated Groceries',
    },
    user: {
      userId: '507f1f77bcf86cd799439012',
    },
  });

  const body = response.body as { success: boolean; data: { name: string } };

  assert.equal(response.statusCode, 200);
  assert.equal(body.data.name, 'Updated Groceries');
});

test('deleteCategoryController returns deleted category', async () => {
  mutableCategoryService.deleteCategory = async () => buildCategoryResponse();

  const response = await runController(deleteCategoryController, {
    params: {
      categoryId: '507f1f77bcf86cd799439011',
    },
    user: {
      userId: '507f1f77bcf86cd799439012',
    },
  });

  const body = response.body as { success: boolean };

  assert.equal(response.statusCode, 200);
  assert.equal(body.success, true);
});
