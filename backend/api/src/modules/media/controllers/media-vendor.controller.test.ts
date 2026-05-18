import assert from 'node:assert/strict';
import { test } from 'node:test';
import * as mediaServiceModule from '../services/media-file.service';
import { vendorListMediaFilesController } from './media-vendor.controller';

const mediaService = mediaServiceModule as unknown as {
  listMediaFiles: (...args: unknown[]) => Promise<unknown>;
};

type MockRequest = {
  query: Record<string, unknown>;
  user?: { userId: string; vendorId?: string };
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
    (
      controller as (
        req: MockRequest,
        res: MockResponse,
        next: (error?: unknown) => void,
      ) => void
    )(req, res, (error?: unknown) => {
      if (error) reject(error);
    });
  });

test('vendorListMediaFilesController returns paginated list', async () => {
  mediaService.listMediaFiles = async () => ({
    items: [{ id: '507f1f77bcf86cd799439011' }],
    pagination: { page: 1, limit: 20, total: 1, totalPages: 1, hasNextPage: false, hasPreviousPage: false },
  });

  const response = await runController(vendorListMediaFilesController, {
    query: { page: 1, limit: 20 },
    user: { userId: '507f1f77bcf86cd799439010', vendorId: '507f1f77bcf86cd799439099' },
  });
  const body = response.body as { success: boolean; data: unknown[] };

  assert.equal(response.statusCode, 200);
  assert.equal(body.success, true);
  assert.equal(Array.isArray(body.data), true);
});
