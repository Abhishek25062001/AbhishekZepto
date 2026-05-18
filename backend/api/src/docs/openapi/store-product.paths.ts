import { ApiErrorResponseSchema, ApiSuccessResponseSchema } from './common.schemas';

const storeProductPlaceholderResponses = {
  200: {
    content: {
      'application/json': {
        schema: ApiSuccessResponseSchema,
      },
    },
    description: 'Store product success response.',
  },
  201: {
    content: {
      'application/json': {
        schema: ApiSuccessResponseSchema,
      },
    },
    description: 'Store product mapping created.',
  },
  422: {
    content: {
      'application/json': {
        schema: ApiErrorResponseSchema,
      },
    },
    description: 'Validation failure response.',
  },
  401: {
    content: {
      'application/json': {
        schema: ApiErrorResponseSchema,
      },
    },
    description: 'Authentication failure response.',
  },
  403: {
    content: {
      'application/json': {
        schema: ApiErrorResponseSchema,
      },
    },
    description: 'Authorization failure response.',
  },
};

export const storeProductPaths = {
  '/admin/store-products': {
    get: {
      responses: storeProductPlaceholderResponses,
      summary: 'List store product mappings',
      tags: ['Admin Store Products'],
    },
    post: {
      responses: storeProductPlaceholderResponses,
      summary: 'Create store product mapping',
      tags: ['Admin Store Products'],
    },
  },
  '/admin/store-products/bulk-map': {
    post: {
      responses: storeProductPlaceholderResponses,
      summary: 'Bulk map products to store',
      tags: ['Admin Store Products'],
    },
  },
  '/admin/store-products/bulk-price': {
    patch: {
      responses: storeProductPlaceholderResponses,
      summary: 'Bulk update store product prices',
      tags: ['Admin Store Products'],
    },
  },
  '/admin/store-products/bulk-visibility': {
    patch: {
      responses: storeProductPlaceholderResponses,
      summary: 'Bulk update store product visibility',
      tags: ['Admin Store Products'],
    },
  },
  '/admin/store-products/{storeProductId}': {
    get: {
      responses: storeProductPlaceholderResponses,
      summary: 'Get store product mapping',
      tags: ['Admin Store Products'],
    },
    patch: {
      responses: storeProductPlaceholderResponses,
      summary: 'Update store product mapping',
      tags: ['Admin Store Products'],
    },
    delete: {
      responses: storeProductPlaceholderResponses,
      summary: 'Delete store product mapping',
      tags: ['Admin Store Products'],
    },
  },
  '/vendor/store-products': {
    get: {
      responses: storeProductPlaceholderResponses,
      summary: 'List vendor store product mappings',
      tags: ['Vendor Store Products'],
    },
  },
  '/vendor/store-products/{storeProductId}': {
    get: {
      responses: storeProductPlaceholderResponses,
      summary: 'Get vendor store product mapping',
      tags: ['Vendor Store Products'],
    },
  },
  '/vendor/store-products/{storeProductId}/availability': {
    patch: {
      responses: storeProductPlaceholderResponses,
      summary: 'Update vendor store product availability',
      tags: ['Vendor Store Products'],
    },
  },
  '/vendor/store-products/{storeProductId}/price': {
    patch: {
      responses: storeProductPlaceholderResponses,
      summary: 'Update vendor store product price',
      tags: ['Vendor Store Products'],
    },
  },
};
