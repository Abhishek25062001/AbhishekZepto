import { ApiErrorResponseSchema, ApiSuccessResponseSchema } from './common.schemas';

const inventoryLockPlaceholderResponses = {
  200: {
    content: { 'application/json': { schema: ApiSuccessResponseSchema } },
    description: 'Inventory lock success response.',
  },
  201: {
    content: { 'application/json': { schema: ApiSuccessResponseSchema } },
    description: 'Inventory lock created.',
  },
  401: {
    content: { 'application/json': { schema: ApiErrorResponseSchema } },
    description: 'Authentication failure response.',
  },
  403: {
    content: { 'application/json': { schema: ApiErrorResponseSchema } },
    description: 'Authorization failure response.',
  },
  422: {
    content: { 'application/json': { schema: ApiErrorResponseSchema } },
    description: 'Validation failure response.',
  },
};

export const inventoryLockPaths = {
  '/internal/inventory/locks': {
    post: { responses: inventoryLockPlaceholderResponses, summary: 'Create inventory lock (internal)' },
  },
  '/internal/inventory/locks/{lockToken}/release': {
    post: { responses: inventoryLockPlaceholderResponses, summary: 'Release inventory lock (internal)' },
  },
  '/internal/inventory/locks/{lockToken}/confirm': {
    post: { responses: inventoryLockPlaceholderResponses, summary: 'Confirm inventory lock (internal)' },
  },
  '/admin/inventory/locks': {
    get: { responses: inventoryLockPlaceholderResponses, summary: 'List inventory locks (admin)' },
  },
  '/admin/inventory/locks/{lockId}': {
    get: { responses: inventoryLockPlaceholderResponses, summary: 'Get inventory lock (admin)' },
  },
  '/admin/inventory/locks/expire-due': {
    post: { responses: inventoryLockPlaceholderResponses, summary: 'Expire due inventory locks (admin)' },
  },
};
