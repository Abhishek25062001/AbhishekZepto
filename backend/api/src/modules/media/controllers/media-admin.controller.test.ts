import assert from 'node:assert/strict';
import { test } from 'node:test';
import * as mediaServiceModule from '../services/media-file.service';
import { getMediaFileByIdController } from './media-admin.controller';

const mediaService = mediaServiceModule as unknown as {
  getMediaFileById: (...args: unknown[]) => Promise<unknown>;
};

type MockRequest = {
  params: { mediaFileId: string };
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

test('getMediaFileByIdController returns media file', async () => {
  mediaService.getMediaFileById = async () => ({
    id: '507f1f77bcf86cd799439011',
    mimeType: 'image/png',
  });

  const response = await runController(getMediaFileByIdController, {
    params: { mediaFileId: '507f1f77bcf86cd799439011' },
    user: { userId: '507f1f77bcf86cd799439010' },
  });
  const body = response.body as { success: boolean; data: { id: string } };

  assert.equal(response.statusCode, 200);
  assert.equal(body.success, true);
  assert.equal(body.data.id, '507f1f77bcf86cd799439011');
});
