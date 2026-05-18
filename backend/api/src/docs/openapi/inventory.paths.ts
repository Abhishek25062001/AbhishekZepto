import { ApiErrorResponseSchema, ApiSuccessResponseSchema } from './common.schemas';

const inventoryPlaceholderResponses = {
  200: {
    content: { 'application/json': { schema: ApiSuccessResponseSchema } },
    description: 'Inventory success response.',
  },
  201: {
    content: { 'application/json': { schema: ApiSuccessResponseSchema } },
    description: 'Inventory stock created.',
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

export const inventoryPaths = {
  '/admin/inventory/stocks': {
    get: { responses: inventoryPlaceholderResponses, summary: 'List inventory stocks' },
    post: { responses: inventoryPlaceholderResponses, summary: 'Create inventory stock' },
  },
  '/admin/inventory/stocks/{inventoryStockId}': {
    get: { responses: inventoryPlaceholderResponses, summary: 'Get inventory stock' },
    patch: { responses: inventoryPlaceholderResponses, summary: 'Update inventory stock settings' },
    delete: { responses: inventoryPlaceholderResponses, summary: 'Delete inventory stock' },
  },
  '/admin/inventory/stocks/{inventoryStockId}/adjust': {
    post: { responses: inventoryPlaceholderResponses, summary: 'Adjust inventory stock' },
  },
  '/admin/inventory/stocks/bulk-upload': {
    post: { responses: inventoryPlaceholderResponses, summary: 'Bulk upload inventory stocks' },
  },
  '/admin/inventory/stocks/bulk-thresholds': {
    patch: { responses: inventoryPlaceholderResponses, summary: 'Bulk update inventory thresholds' },
  },
  '/admin/inventory/movements': {
    get: { responses: inventoryPlaceholderResponses, summary: 'List inventory movements' },
  },
  '/admin/inventory/movements/{movementId}': {
    get: { responses: inventoryPlaceholderResponses, summary: 'Get inventory movement' },
  },
  '/vendor/inventory/stocks': {
    get: { responses: inventoryPlaceholderResponses, summary: 'List vendor inventory stocks' },
  },
  '/vendor/inventory/stocks/{inventoryStockId}': {
    get: { responses: inventoryPlaceholderResponses, summary: 'Get vendor inventory stock' },
  },
  '/vendor/inventory/stocks/{inventoryStockId}/adjust': {
    post: { responses: inventoryPlaceholderResponses, summary: 'Adjust vendor inventory stock' },
  },
  '/vendor/inventory/movements': {
    get: { responses: inventoryPlaceholderResponses, summary: 'List vendor inventory movements' },
  },
};
