import { ApiErrorResponseSchema } from './common.schemas';
import { STORE_STATUS_VALUES } from '../../modules/stores/constants/store-status.constant';
import {
  VENDOR_MANAGEMENT_MUTATION_STATUS_VALUES,
  VENDOR_MANAGEMENT_STATUS_VALUES,
} from '../../modules/vendor-store-management/validators/admin-vendor-store.validator';

const idParam = (name: string) => ({
  name,
  in: 'path',
  required: true,
  schema: { type: 'string' },
});

const paginationParams = [
  { name: 'page', in: 'query', schema: { type: 'integer', minimum: 1, default: 1 } },
  { name: 'limit', in: 'query', schema: { type: 'integer', minimum: 1, maximum: 100, default: 20 } },
];

const vendorListParams = [
  { name: 'status', in: 'query', schema: { type: 'string', enum: VENDOR_MANAGEMENT_STATUS_VALUES } },
  { name: 'cityId', in: 'query', schema: { type: 'string' } },
  { name: 'search', in: 'query', schema: { type: 'string', minLength: 1, maxLength: 120 } },
  ...paginationParams,
];

const storeListParams = [
  { name: 'status', in: 'query', schema: { type: 'string', enum: STORE_STATUS_VALUES } },
  { name: 'vendorId', in: 'query', schema: { type: 'string' } },
  { name: 'cityId', in: 'query', schema: { type: 'string' } },
  { name: 'search', in: 'query', schema: { type: 'string', minLength: 1, maxLength: 120 } },
  ...paginationParams,
];

const successObject = (description: string) => ({
  description,
  content: { 'application/json': { schema: { type: 'object' } } },
});

const statusRequestBody = (statusValues: readonly string[]) => ({
  required: true,
  content: {
    'application/json': {
      schema: {
        type: 'object',
        required: ['status', 'reason'],
        properties: {
          status: { type: 'string', enum: statusValues },
          reason: { type: 'string', minLength: 5, maxLength: 500 },
        },
      },
    },
  },
});

const storePath = {
  get: {
    tags: ['Vendor & Store Management'],
    summary: 'List stores for admin management',
    parameters: storeListParams,
    responses: { 200: successObject('Stores fetched successfully.') },
  },
  post: {
    tags: ['Admin Stores'],
    summary: 'Create store',
    responses: { 200: successObject('Store created successfully.') },
  },
};

const storeDetailPath = {
  get: {
    tags: ['Vendor & Store Management'],
    summary: 'Get store for admin management',
    parameters: [idParam('storeId')],
    responses: {
      200: successObject('Store fetched successfully.'),
      404: {
        description: 'Store not found.',
        content: { 'application/json': { schema: ApiErrorResponseSchema } },
      },
    },
  },
  patch: {
    tags: ['Admin Stores'],
    summary: 'Update store',
    responses: { 200: successObject('Store updated successfully.') },
  },
  delete: {
    tags: ['Admin Stores'],
    summary: 'Soft delete store',
    responses: { 200: successObject('Store deleted successfully.') },
  },
};

export const vendorStoreManagementPaths = {
  '/admin/vendors': {
    get: {
      tags: ['Vendor & Store Management'],
      summary: 'List vendors for admin management',
      parameters: vendorListParams,
      responses: { 200: successObject('Vendors fetched successfully.') },
    },
  },
  '/admin/vendors/{vendorId}': {
    get: {
      tags: ['Vendor & Store Management'],
      summary: 'Get vendor for admin management',
      parameters: [idParam('vendorId')],
      responses: {
        200: successObject('Vendor fetched successfully.'),
        404: {
          description: 'Vendor not found.',
          content: { 'application/json': { schema: ApiErrorResponseSchema } },
        },
      },
    },
  },
  '/admin/vendors/{vendorId}/status': {
    patch: {
      tags: ['Vendor & Store Management'],
      summary: 'Update vendor status for admin management',
      parameters: [idParam('vendorId')],
      requestBody: statusRequestBody(VENDOR_MANAGEMENT_MUTATION_STATUS_VALUES),
      responses: { 200: successObject('Vendor status updated successfully.') },
    },
  },
  '/admin/stores': storePath,
  '/admin/stores/{storeId}': storeDetailPath,
  '/admin/stores/{storeId}/orders': {
    get: {
      tags: ['Vendor & Store Management'],
      summary: 'List store orders for admin management',
      parameters: [idParam('storeId'), ...paginationParams],
      responses: {
        200: successObject('Store orders fetched successfully.'),
        404: {
          description: 'Store not found.',
          content: { 'application/json': { schema: ApiErrorResponseSchema } },
        },
      },
    },
  },
  '/admin/stores/{storeId}/inventory': {
    get: {
      tags: ['Vendor & Store Management'],
      summary: 'List store inventory for admin management',
      parameters: [idParam('storeId'), ...paginationParams],
      responses: {
        200: successObject('Store inventory fetched successfully.'),
        404: {
          description: 'Store not found.',
          content: { 'application/json': { schema: ApiErrorResponseSchema } },
        },
      },
    },
  },
  '/admin/stores/{storeId}/audit': {
    get: {
      tags: ['Vendor & Store Management'],
      summary: 'List store audit records for admin management',
      parameters: [idParam('storeId'), ...paginationParams],
      responses: {
        200: successObject('Store audit fetched successfully.'),
        404: {
          description: 'Store not found.',
          content: { 'application/json': { schema: ApiErrorResponseSchema } },
        },
      },
    },
  },
  '/admin/stores/{storeId}/status': {
    patch: {
      tags: ['Vendor & Store Management'],
      summary: 'Update store status for admin management',
      parameters: [idParam('storeId')],
      requestBody: statusRequestBody(STORE_STATUS_VALUES),
      responses: { 200: successObject('Store status updated successfully.') },
    },
  },
};
