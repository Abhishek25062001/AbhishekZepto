import { ApiErrorResponseSchema, ApiSuccessResponseSchema } from './common.schemas';

const locationPlaceholderResponses = {
  200: {
    content: {
      'application/json': {
        schema: ApiSuccessResponseSchema,
      },
    },
    description: 'Location or store success response.',
  },
  201: {
    content: {
      'application/json': {
        schema: ApiSuccessResponseSchema,
      },
    },
    description: 'Location or store resource created.',
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

export const locationPaths = {
  '/admin/locations/cities': {
    get: {
      responses: locationPlaceholderResponses,
      summary: 'List cities',
      tags: ['Admin Locations'],
    },
    post: {
      responses: locationPlaceholderResponses,
      summary: 'Create city',
      tags: ['Admin Locations'],
    },
  },
  '/admin/locations/cities/{cityId}': {
    get: {
      responses: locationPlaceholderResponses,
      summary: 'Get city by id',
      tags: ['Admin Locations'],
    },
    patch: {
      responses: locationPlaceholderResponses,
      summary: 'Update city',
      tags: ['Admin Locations'],
    },
    delete: {
      responses: locationPlaceholderResponses,
      summary: 'Soft delete city',
      tags: ['Admin Locations'],
    },
  },
  '/admin/locations/service-areas': {
    get: {
      responses: locationPlaceholderResponses,
      summary: 'List service areas',
      tags: ['Admin Locations'],
    },
    post: {
      responses: locationPlaceholderResponses,
      summary: 'Create service area',
      tags: ['Admin Locations'],
    },
  },
  '/admin/locations/service-areas/{serviceAreaId}': {
    get: {
      responses: locationPlaceholderResponses,
      summary: 'Get service area by id',
      tags: ['Admin Locations'],
    },
    patch: {
      responses: locationPlaceholderResponses,
      summary: 'Update service area',
      tags: ['Admin Locations'],
    },
    delete: {
      responses: locationPlaceholderResponses,
      summary: 'Soft delete service area',
      tags: ['Admin Locations'],
    },
  },
  '/admin/stores': {
    get: {
      responses: locationPlaceholderResponses,
      summary: 'List stores',
      tags: ['Admin Stores'],
    },
    post: {
      responses: locationPlaceholderResponses,
      summary: 'Create store',
      tags: ['Admin Stores'],
    },
  },
  '/admin/stores/{storeId}': {
    get: {
      responses: locationPlaceholderResponses,
      summary: 'Get store by id',
      tags: ['Admin Stores'],
    },
    patch: {
      responses: locationPlaceholderResponses,
      summary: 'Update store',
      tags: ['Admin Stores'],
    },
    delete: {
      responses: locationPlaceholderResponses,
      summary: 'Soft delete store',
      tags: ['Admin Stores'],
    },
  },
};
