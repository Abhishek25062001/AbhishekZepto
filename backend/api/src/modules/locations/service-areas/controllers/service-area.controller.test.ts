import assert from 'node:assert/strict';
import { test } from 'node:test';
import * as serviceAreaServiceModule from '../services/service-area.service';
import {
  createServiceAreaController,
  deleteServiceAreaController,
  getServiceAreaByIdController,
  listServiceAreasController,
  updateServiceAreaController,
} from './service-area.controller';

const mutableServiceAreaService = serviceAreaServiceModule as unknown as {
  listServiceAreas: (...args: unknown[]) => Promise<unknown>;
  createServiceArea: (...args: unknown[]) => Promise<unknown>;
  getServiceAreaById: (...args: unknown[]) => Promise<unknown>;
  updateServiceArea: (...args: unknown[]) => Promise<unknown>;
  deleteServiceArea: (...args: unknown[]) => Promise<unknown>;
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

const buildServiceAreaResponse = () => ({
  id: '507f1f77bcf86cd799439012',
  cityId: '507f1f77bcf86cd799439011',
  name: 'Dwarka',
  slug: 'dwarka',
  description: null,
  isServiceable: true,
  status: 'active',
  createdAt: new Date('2026-01-01T00:00:00.000Z'),
  updatedAt: new Date('2026-01-01T00:00:00.000Z'),
});

test('listServiceAreasController returns paginated payload', async () => {
  mutableServiceAreaService.listServiceAreas = async () => ({
    items: [buildServiceAreaResponse()],
    pagination: {
      page: 1,
      limit: 20,
      total: 1,
      totalPages: 1,
      hasNextPage: false,
      hasPreviousPage: false,
    },
  });

  const response = await runController(listServiceAreasController, {
    query: { page: 1, limit: 20 },
  });
  const body = response.body as { success: boolean; data: unknown[] };

  assert.equal(response.statusCode, 200);
  assert.equal(body.success, true);
});

test('createServiceAreaController returns created service area', async () => {
  mutableServiceAreaService.createServiceArea = async () => buildServiceAreaResponse();

  const response = await runController(createServiceAreaController, {
    body: { cityId: '507f1f77bcf86cd799439011', name: 'Dwarka' },
    user: { userId: '507f1f77bcf86cd799439012' },
  });
  const body = response.body as { success: boolean; data: { name: string } };

  assert.equal(response.statusCode, 201);
  assert.equal(body.data.name, 'Dwarka');
});

test('getServiceAreaByIdController returns service area', async () => {
  mutableServiceAreaService.getServiceAreaById = async () => buildServiceAreaResponse();

  const response = await runController(getServiceAreaByIdController, {
    params: { serviceAreaId: '507f1f77bcf86cd799439012' },
  });
  const body = response.body as { success: boolean };

  assert.equal(response.statusCode, 200);
  assert.equal(body.success, true);
});

test('updateServiceAreaController returns updated service area', async () => {
  mutableServiceAreaService.updateServiceArea = async () => ({
    ...buildServiceAreaResponse(),
    name: 'Dwarka Sector 10',
  });

  const response = await runController(updateServiceAreaController, {
    params: { serviceAreaId: '507f1f77bcf86cd799439012' },
    body: { name: 'Dwarka Sector 10' },
    user: { userId: '507f1f77bcf86cd799439012' },
  });
  const body = response.body as { success: boolean; data: { name: string } };

  assert.equal(response.statusCode, 200);
  assert.equal(body.data.name, 'Dwarka Sector 10');
});

test('deleteServiceAreaController returns deleted service area', async () => {
  mutableServiceAreaService.deleteServiceArea = async () => buildServiceAreaResponse();

  const response = await runController(deleteServiceAreaController, {
    params: { serviceAreaId: '507f1f77bcf86cd799439012' },
    user: { userId: '507f1f77bcf86cd799439012' },
  });
  const body = response.body as { success: boolean };

  assert.equal(response.statusCode, 200);
  assert.equal(body.success, true);
});
