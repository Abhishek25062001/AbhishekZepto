import assert from 'node:assert/strict';
import { test } from 'node:test';
import * as mediaServiceModule from '../services/media-file.service';
import { attachMediaOwnerController } from './media-internal.controller';

const mediaService = mediaServiceModule as unknown as {
  attachMediaOwner: (...args: unknown[]) => Promise<unknown>;
};

type MockRequest = {
  body: Record<string, unknown>;
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

test('attachMediaOwnerController returns updated media file', async () => {
  mediaService.attachMediaOwner = async () => ({
    id: '507f1f77bcf86cd799439011',
    ownerType: 'product',
  });

  const response = await runController(attachMediaOwnerController, {
    body: {
      mediaFileId: '507f1f77bcf86cd799439011',
      ownerType: 'product',
      ownerId: '507f1f77bcf86cd799439012',
    },
    user: { userId: '507f1f77bcf86cd799439010' },
  });
  const body = response.body as { success: boolean; data: { ownerType: string } };

  assert.equal(response.statusCode, 200);
  assert.equal(body.success, true);
  assert.equal(body.data.ownerType, 'product');
});
