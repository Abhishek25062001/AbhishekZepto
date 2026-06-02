import assert from 'node:assert/strict';
import { test } from 'node:test';

import { openApiDocument } from '../../../docs/openapi';

type JsonObject = Record<string, unknown>;

const asObject = (value: unknown): JsonObject => {
  assert.equal(typeof value, 'object');
  assert.notEqual(value, null);
  return value as JsonObject;
};

test('OpenAPI document includes Module 20 admin data export endpoints', () => {
  const paths = openApiDocument.paths as Record<string, Record<string, unknown>>;

  assert.ok(paths['/admin/data-exports']);
  assert.ok(paths['/admin/data-exports/{exportId}']);
  assert.ok(paths['/admin/data-exports'].post);
  assert.ok(paths['/admin/data-exports'].get);
  assert.ok(paths['/admin/data-exports/{exportId}'].get);
});

test('OpenAPI data export schema documents queued metadata and nullable file fields', () => {
  const paths = openApiDocument.paths as Record<string, JsonObject>;
  const collectionPath = asObject(paths['/admin/data-exports']);
  const detailPath = asObject(paths['/admin/data-exports/{exportId}']);
  const postOperation = asObject(collectionPath.post);
  const detailGetOperation = asObject(detailPath.get);
  const postResponses = asObject(postOperation.responses);
  const createdResponse = asObject(postResponses[201]);
  const createdContent = asObject(createdResponse.content);
  const createdJsonContent = asObject(createdContent['application/json']);
  const responseSchema = asObject(createdJsonContent.schema);
  const responseProperties = asObject(responseSchema.properties);
  const dataSchema = asObject(responseProperties.data);
  const dataProperties = asObject(dataSchema.properties);
  const requestBodyContainer = asObject(postOperation.requestBody);
  const requestBodyContent = asObject(requestBodyContainer.content);
  const requestJsonContent = asObject(requestBodyContent['application/json']);
  const requestBody = asObject(requestJsonContent.schema);
  const detailResponses = asObject(detailGetOperation.responses);
  const notFoundResponse = asObject(detailResponses[404]);

  assert.deepEqual(requestBody.required, ['exportType', 'format', 'reason']);
  assert.ok(dataProperties.status);
  assert.equal(asObject(dataProperties.fileKey).nullable, true);
  assert.equal(asObject(dataProperties.fileName).nullable, true);
  assert.equal(asObject(dataProperties.downloadUrl).nullable, true);
  assert.equal(asObject(dataProperties.expiresAt).nullable, true);
  assert.equal(notFoundResponse.description, 'Admin data export not found.');
});
