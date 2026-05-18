import { ApiErrorResponseSchema, ApiSuccessResponseSchema } from './common.schemas';

const catalogPlaceholderResponses = {
  200: {
    content: {
      'application/json': {
        schema: ApiSuccessResponseSchema,
      },
    },
    description: 'Catalog success response.',
  },
  201: {
    content: {
      'application/json': {
        schema: ApiSuccessResponseSchema,
      },
    },
    description: 'Catalog resource created.',
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

export const catalogPaths = {
  '/admin/catalog/categories': {
    get: {
      responses: catalogPlaceholderResponses,
      summary: 'List catalog categories',
      tags: ['Admin Catalog'],
    },
    post: {
      responses: catalogPlaceholderResponses,
      summary: 'Create catalog category',
      tags: ['Admin Catalog'],
    },
  },
  '/admin/catalog/brands': {
    get: {
      responses: catalogPlaceholderResponses,
      summary: 'List catalog brands',
      tags: ['Admin Catalog'],
    },
    post: {
      responses: catalogPlaceholderResponses,
      summary: 'Create catalog brand',
      tags: ['Admin Catalog'],
    },
  },
  '/admin/catalog/brands/{brandId}': {
    get: {
      responses: catalogPlaceholderResponses,
      summary: 'Get catalog brand by id',
      tags: ['Admin Catalog'],
    },
    patch: {
      responses: catalogPlaceholderResponses,
      summary: 'Update catalog brand',
      tags: ['Admin Catalog'],
    },
    delete: {
      responses: catalogPlaceholderResponses,
      summary: 'Soft delete catalog brand',
      tags: ['Admin Catalog'],
    },
  },
  '/admin/catalog/units': {
    get: {
      responses: catalogPlaceholderResponses,
      summary: 'List product units',
      tags: ['Admin Catalog'],
    },
    post: {
      responses: catalogPlaceholderResponses,
      summary: 'Create product unit',
      tags: ['Admin Catalog'],
    },
  },
  '/admin/catalog/units/{unitId}': {
    get: {
      responses: catalogPlaceholderResponses,
      summary: 'Get product unit by id',
      tags: ['Admin Catalog'],
    },
    patch: {
      responses: catalogPlaceholderResponses,
      summary: 'Update product unit',
      tags: ['Admin Catalog'],
    },
    delete: {
      responses: catalogPlaceholderResponses,
      summary: 'Soft delete product unit',
      tags: ['Admin Catalog'],
    },
  },
  '/admin/catalog/products': {
    get: {
      responses: catalogPlaceholderResponses,
      summary: 'List catalog products',
      tags: ['Admin Catalog'],
    },
    post: {
      responses: catalogPlaceholderResponses,
      summary: 'Create catalog product',
      tags: ['Admin Catalog'],
    },
  },
  '/admin/catalog/products/{productId}': {
    get: {
      responses: catalogPlaceholderResponses,
      summary: 'Get catalog product by id',
      tags: ['Admin Catalog'],
    },
    patch: {
      responses: catalogPlaceholderResponses,
      summary: 'Update catalog product',
      tags: ['Admin Catalog'],
    },
    delete: {
      responses: catalogPlaceholderResponses,
      summary: 'Soft delete catalog product',
      tags: ['Admin Catalog'],
    },
  },
  '/admin/catalog/products/{productId}/approval-status': {
    patch: {
      responses: catalogPlaceholderResponses,
      summary: 'Update catalog product approval status',
      tags: ['Admin Catalog'],
    },
  },
  '/admin/catalog/products/{productId}/variants': {
    get: {
      responses: catalogPlaceholderResponses,
      summary: 'List product variants',
      tags: ['Admin Catalog'],
    },
    post: {
      responses: catalogPlaceholderResponses,
      summary: 'Create product variant',
      tags: ['Admin Catalog'],
    },
  },
  '/admin/catalog/products/{productId}/variants/{variantId}': {
    patch: {
      responses: catalogPlaceholderResponses,
      summary: 'Update product variant',
      tags: ['Admin Catalog'],
    },
    delete: {
      responses: catalogPlaceholderResponses,
      summary: 'Soft delete product variant',
      tags: ['Admin Catalog'],
    },
  },
  '/admin/catalog/categories/{categoryId}': {
    get: {
      responses: catalogPlaceholderResponses,
      summary: 'Get catalog category by id',
      tags: ['Admin Catalog'],
    },
    patch: {
      responses: catalogPlaceholderResponses,
      summary: 'Update catalog category',
      tags: ['Admin Catalog'],
    },
    delete: {
      responses: catalogPlaceholderResponses,
      summary: 'Soft delete catalog category',
      tags: ['Admin Catalog'],
    },
  },
  '/vendor/catalog/products': {
    get: {
      responses: catalogPlaceholderResponses,
      summary: 'List vendor catalog products with search and filters',
      tags: ['Vendor Catalog'],
    },
  },
  '/vendor/catalog/facets': {
    get: {
      responses: catalogPlaceholderResponses,
      summary: 'Get vendor catalog facet counts',
      tags: ['Vendor Catalog'],
    },
  },
  '/customer/catalog/products': {
    get: {
      responses: catalogPlaceholderResponses,
      summary: 'List customer catalog products with filters and sort',
      tags: ['Customer Catalog'],
    },
  },
  '/customer/catalog/search': {
    get: {
      responses: catalogPlaceholderResponses,
      summary: 'Search customer catalog products (query param q, min 2 chars)',
      tags: ['Customer Catalog'],
    },
  },
  '/customer/catalog/featured-products': {
    get: {
      responses: catalogPlaceholderResponses,
      summary: 'List featured customer catalog products',
      tags: ['Customer Catalog'],
    },
  },
  '/customer/catalog/facets': {
    get: {
      responses: catalogPlaceholderResponses,
      summary: 'Get customer catalog facet counts',
      tags: ['Customer Catalog'],
    },
  },
};
