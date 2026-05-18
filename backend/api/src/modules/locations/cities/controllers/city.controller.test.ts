import assert from 'node:assert/strict';
import { test } from 'node:test';
import * as cityServiceModule from '../services/city.service';
import {
  createCityController,
  deleteCityController,
  getCityByIdController,
  listCitiesController,
  updateCityController,
} from './city.controller';

const mutableCityService = cityServiceModule as unknown as {
  listCities: (...args: unknown[]) => Promise<unknown>;
  createCity: (...args: unknown[]) => Promise<unknown>;
  getCityById: (...args: unknown[]) => Promise<unknown>;
  updateCity: (...args: unknown[]) => Promise<unknown>;
  deleteCity: (...args: unknown[]) => Promise<unknown>;
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

const buildCityResponse = () => ({
  id: '507f1f77bcf86cd799439011',
  name: 'Delhi',
  slug: 'delhi',
  state: 'Delhi',
  country: 'India',
  timezone: 'Asia/Kolkata',
  currencyCode: 'INR',
  latitude: null,
  longitude: null,
  serviceRadiusKm: null,
  isServiceable: true,
  status: 'active',
  createdAt: new Date('2026-01-01T00:00:00.000Z'),
  updatedAt: new Date('2026-01-01T00:00:00.000Z'),
});

test('listCitiesController returns paginated payload', async () => {
  mutableCityService.listCities = async () => ({
    items: [buildCityResponse()],
    pagination: {
      page: 1,
      limit: 20,
      total: 1,
      totalPages: 1,
      hasNextPage: false,
      hasPreviousPage: false,
    },
  });

  const response = await runController(listCitiesController, { query: { page: 1, limit: 20 } });
  const body = response.body as { success: boolean; data: unknown[] };

  assert.equal(response.statusCode, 200);
  assert.equal(body.success, true);
  assert.equal(body.data.length, 1);
});

test('createCityController returns created city', async () => {
  mutableCityService.createCity = async () => buildCityResponse();

  const response = await runController(createCityController, {
    body: { name: 'Delhi', state: 'Delhi', timezone: 'Asia/Kolkata', currencyCode: 'INR' },
    user: { userId: '507f1f77bcf86cd799439012' },
  });
  const body = response.body as { success: boolean; data: { name: string } };

  assert.equal(response.statusCode, 201);
  assert.equal(body.data.name, 'Delhi');
});

test('getCityByIdController returns city', async () => {
  mutableCityService.getCityById = async () => buildCityResponse();

  const response = await runController(getCityByIdController, {
    params: { cityId: '507f1f77bcf86cd799439011' },
  });
  const body = response.body as { success: boolean };

  assert.equal(response.statusCode, 200);
  assert.equal(body.success, true);
});

test('updateCityController returns updated city', async () => {
  mutableCityService.updateCity = async () => ({ ...buildCityResponse(), name: 'Delhi NCR' });

  const response = await runController(updateCityController, {
    params: { cityId: '507f1f77bcf86cd799439011' },
    body: { name: 'Delhi NCR' },
    user: { userId: '507f1f77bcf86cd799439012' },
  });
  const body = response.body as { success: boolean; data: { name: string } };

  assert.equal(response.statusCode, 200);
  assert.equal(body.data.name, 'Delhi NCR');
});

test('deleteCityController returns deleted city', async () => {
  mutableCityService.deleteCity = async () => buildCityResponse();

  const response = await runController(deleteCityController, {
    params: { cityId: '507f1f77bcf86cd799439011' },
    user: { userId: '507f1f77bcf86cd799439012' },
  });
  const body = response.body as { success: boolean };

  assert.equal(response.statusCode, 200);
  assert.equal(body.success, true);
});
