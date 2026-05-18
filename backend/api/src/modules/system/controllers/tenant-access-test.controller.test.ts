import assert from 'node:assert/strict';
import { test } from 'node:test';
import * as serviceModule from '../services/tenant-access-test.service';
import {
  createTenantAccessTestRecordController,
  listCustomerTenantAccessTestRecordsController,
  listDeliveryAgentTenantAccessTestRecordsController,
  listVendorStoreTenantAccessTestRecordsController,
} from './tenant-access-test.controller';

const mutableServiceModule = serviceModule as unknown as {
  createInternalTenantAccessTestRecord: (...args: unknown[]) => Promise<unknown>;
  listTenantAccessTestsByVendorStoreScope: (...args: unknown[]) => Promise<unknown>;
  listTenantAccessTestsByCustomerScope: (...args: unknown[]) => Promise<unknown>;
  listTenantAccessTestsByDeliveryAgentScope: (...args: unknown[]) => Promise<unknown>;
};

type MockRequest = {
  body?: Record<string, unknown>;
  params?: Record<string, string>;
  user?: Express.Request['user'];
  requestId?: string;
  traceId?: string;
  ip?: string;
  get?: (header: string) => string | undefined;
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

    const requestWithDefaults: MockRequest = {
      requestId: 'req-1',
      traceId: 'trace-1',
      ip: '127.0.0.1',
      get: () => 'test-agent',
      ...req,
    };

    (controller as (req: MockRequest, res: MockResponse, next: (error?: unknown) => void) => void)(
      requestWithDefaults,
      res,
      (error?: unknown) => {
        if (error) {
          reject(error);
        }
      },
    );
  });
};

test('createTenantAccessTestRecordController returns created response', async () => {
  const original = mutableServiceModule.createInternalTenantAccessTestRecord;
  mutableServiceModule.createInternalTenantAccessTestRecord = async () => ({ label: 'record-1' });

  const response = await runController(createTenantAccessTestRecordController, {
    body: {
      label: 'record-1',
      vendorId: '68295cf6d5cc8fddf6b8d201',
    },
  });

  mutableServiceModule.createInternalTenantAccessTestRecord = original;

  assert.equal(response.statusCode, 201);
});

test('listVendorStoreTenantAccessTestRecordsController returns scoped records', async () => {
  const original = mutableServiceModule.listTenantAccessTestsByVendorStoreScope;
  mutableServiceModule.listTenantAccessTestsByVendorStoreScope = async () => [{ label: 'record-1' }];

  const response = await runController(listVendorStoreTenantAccessTestRecordsController, {
    params: {
      vendorId: '68295cf6d5cc8fddf6b8d201',
      storeId: '68295cf6d5cc8fddf6b8d202',
    },
  });

  mutableServiceModule.listTenantAccessTestsByVendorStoreScope = original;

  assert.equal(response.statusCode, 200);
});

test('listCustomerTenantAccessTestRecordsController returns scoped records', async () => {
  const original = mutableServiceModule.listTenantAccessTestsByCustomerScope;
  mutableServiceModule.listTenantAccessTestsByCustomerScope = async () => [{ label: 'record-1' }];

  const response = await runController(listCustomerTenantAccessTestRecordsController, {
    params: {
      customerId: '68295cf6d5cc8fddf6b8d203',
    },
    user: {
      userId: '68295cf6d5cc8fddf6b8d203',
      role: 'customer',
      permissions: ['customer:read_self'],
      sessionId: 'session-1',
      vendorId: null,
      storeId: null,
      cityId: null,
    },
  });

  mutableServiceModule.listTenantAccessTestsByCustomerScope = original;

  assert.equal(response.statusCode, 200);
});

test('listDeliveryAgentTenantAccessTestRecordsController returns scoped records', async () => {
  const original = mutableServiceModule.listTenantAccessTestsByDeliveryAgentScope;
  mutableServiceModule.listTenantAccessTestsByDeliveryAgentScope = async () => [{ label: 'record-1' }];

  const response = await runController(listDeliveryAgentTenantAccessTestRecordsController, {
    params: {
      deliveryAgentId: '68295cf6d5cc8fddf6b8d204',
    },
    user: {
      userId: '68295cf6d5cc8fddf6b8d204',
      role: 'delivery_agent',
      permissions: ['delivery:read_self'],
      sessionId: 'session-1',
      vendorId: null,
      storeId: null,
      cityId: null,
    },
  });

  mutableServiceModule.listTenantAccessTestsByDeliveryAgentScope = original;

  assert.equal(response.statusCode, 200);
});
