import { ApiErrorResponseSchema, ApiSuccessResponseSchema } from './common.schemas';

const orderMutationResponses = {
  200: {
    content: { 'application/json': { schema: ApiSuccessResponseSchema } },
    description: 'Order mutation success response.',
  },
  400: {
    content: { 'application/json': { schema: ApiErrorResponseSchema } },
    description: 'Invalid request or missing scope response.',
  },
  401: {
    content: { 'application/json': { schema: ApiErrorResponseSchema } },
    description: 'Authentication failure response.',
  },
  403: {
    content: { 'application/json': { schema: ApiErrorResponseSchema } },
    description: 'Authorization or store-scope failure response.',
  },
  409: {
    content: { 'application/json': { schema: ApiErrorResponseSchema } },
    description: 'Order lifecycle transition conflict response.',
  },
  422: {
    content: { 'application/json': { schema: ApiErrorResponseSchema } },
    description: 'Validation failure response.',
  },
};

const cancellationRequestBody = {
  content: {
    'application/json': {
      schema: {
        properties: {
          reason: { maxLength: 500, minLength: 1, type: 'string' },
        },
        required: ['reason'],
        type: 'object',
      },
    },
  },
  required: true,
};

const adminStatusUpdateRequestBody = {
  content: {
    'application/json': {
      schema: {
        properties: {
          reason: { maxLength: 500, minLength: 1, type: 'string' },
          status: { type: 'string' },
        },
        required: ['status'],
        type: 'object',
      },
    },
  },
  required: true,
};

export const orderPaths = {
  '/customer/orders': {
    get: {
      parameters: [
        { in: 'query', name: 'status', required: false, schema: { type: 'string' } },
        { in: 'query', name: 'page', required: false, schema: { minimum: 1, type: 'integer' } },
        {
          in: 'query',
          name: 'limit',
          required: false,
          schema: { maximum: 50, minimum: 1, type: 'integer' },
        },
      ],
      responses: orderMutationResponses,
      summary: 'List customer orders',
      tags: ['Customer'],
    },
  },
  '/customer/orders/{orderId}': {
    get: {
      parameters: [
        {
          in: 'path',
          name: 'orderId',
          required: true,
          schema: { type: 'string' },
        },
      ],
      responses: orderMutationResponses,
      summary: 'Get customer order detail',
      tags: ['Customer'],
    },
  },
  '/customer/orders/{orderId}/state': {
    get: {
      parameters: [
        {
          in: 'path',
          name: 'orderId',
          required: true,
          schema: { type: 'string' },
        },
      ],
      responses: orderMutationResponses,
      summary: 'Get customer order state',
      tags: ['Customer'],
    },
  },
  '/customer/orders/{orderId}/lifecycle': {
    get: {
      parameters: [
        {
          in: 'path',
          name: 'orderId',
          required: true,
          schema: { type: 'string' },
        },
      ],
      responses: orderMutationResponses,
      summary: 'Get customer order lifecycle',
      tags: ['Customer'],
    },
  },
  '/admin/orders': {
    get: {
      parameters: [
        { in: 'query', name: 'status', required: false, schema: { type: 'string' } },
        { in: 'query', name: 'storeStatus', required: false, schema: { type: 'string' } },
        { in: 'query', name: 'storeId', required: false, schema: { type: 'string' } },
        { in: 'query', name: 'cityId', required: false, schema: { type: 'string' } },
        { in: 'query', name: 'paymentStatus', required: false, schema: { type: 'string' } },
        { in: 'query', name: 'customerId', required: false, schema: { type: 'string' } },
        { in: 'query', name: 'slaStatus', required: false, schema: { type: 'string' } },
        { in: 'query', name: 'slaBreachedStage', required: false, schema: { type: 'string' } },
        { in: 'query', name: 'fromDate', required: false, schema: { format: 'date-time', type: 'string' } },
        { in: 'query', name: 'toDate', required: false, schema: { format: 'date-time', type: 'string' } },
        { in: 'query', name: 'page', required: false, schema: { minimum: 1, type: 'integer' } },
        { in: 'query', name: 'limit', required: false, schema: { maximum: 50, minimum: 1, type: 'integer' } },
        {
          in: 'query',
          name: 'sort',
          required: false,
          schema: {
            enum: ['createdAt_desc', 'createdAt_asc', 'status_asc', 'status_desc', 'sla_priority'],
            type: 'string',
          },
        },
      ],
      responses: orderMutationResponses,
      summary: 'List admin orders',
      tags: ['Admin'],
    },
  },
  '/admin/orders/{orderId}/cancel': {
    post: {
      parameters: [
        {
          in: 'path',
          name: 'orderId',
          required: true,
          schema: { type: 'string' },
        },
      ],
      requestBody: cancellationRequestBody,
      responses: orderMutationResponses,
      summary: 'Cancel admin order',
      tags: ['Admin'],
    },
  },
  '/admin/orders/{orderId}': {
    get: {
      parameters: [
        {
          in: 'path',
          name: 'orderId',
          required: true,
          schema: { type: 'string' },
        },
      ],
      responses: orderMutationResponses,
      summary: 'Get admin order detail',
      tags: ['Admin'],
    },
  },
  '/admin/orders/{orderId}/timeline': {
    get: {
      parameters: [
        {
          in: 'path',
          name: 'orderId',
          required: true,
          schema: { type: 'string' },
        },
      ],
      responses: orderMutationResponses,
      summary: 'Get admin order timeline',
      tags: ['Admin'],
    },
  },
  '/admin/orders/{orderId}/status': {
    post: {
      parameters: [
        {
          in: 'path',
          name: 'orderId',
          required: true,
          schema: { type: 'string' },
        },
      ],
      requestBody: adminStatusUpdateRequestBody,
      responses: orderMutationResponses,
      summary: 'Update admin order status',
      tags: ['Admin'],
    },
  },
  '/customer/orders/{orderId}/cancel': {
    post: {
      parameters: [
        {
          in: 'path',
          name: 'orderId',
          required: true,
          schema: { type: 'string' },
        },
      ],
      requestBody: cancellationRequestBody,
      responses: orderMutationResponses,
      summary: 'Cancel customer order',
      tags: ['Customer'],
    },
  },
  '/store/orders': {
    get: {
      parameters: [
        {
          in: 'query',
          name: 'status',
          required: false,
          schema: { type: 'string' },
        },
        {
          in: 'query',
          name: 'storeStatus',
          required: false,
          schema: { type: 'string' },
        },
        {
          in: 'query',
          name: 'paymentStatus',
          required: false,
          schema: { type: 'string' },
        },
        {
          in: 'query',
          name: 'slaStatus',
          required: false,
          schema: {
            enum: ['not_started', 'on_track', 'at_risk', 'breached', 'not_applicable'],
            type: 'string',
          },
        },
        {
          in: 'query',
          name: 'slaBreachedStage',
          required: false,
          schema: {
            enum: ['acceptance', 'picking', 'packing', 'ready_for_pickup'],
            type: 'string',
          },
        },
        {
          in: 'query',
          name: 'page',
          required: false,
          schema: { minimum: 1, type: 'integer' },
        },
        {
          in: 'query',
          name: 'limit',
          required: false,
          schema: { maximum: 50, minimum: 1, type: 'integer' },
        },
      ],
      responses: orderMutationResponses,
      summary: 'List store orders',
      tags: ['Vendor'],
    },
  },
  '/store/orders/{orderId}': {
    get: {
      parameters: [
        {
          in: 'path',
          name: 'orderId',
          required: true,
          schema: { type: 'string' },
        },
      ],
      responses: orderMutationResponses,
      summary: 'Get store order detail',
      tags: ['Vendor'],
    },
  },
  '/store/orders/{orderId}/accept': {
    post: {
      parameters: [
        {
          in: 'path',
          name: 'orderId',
          required: true,
          schema: { type: 'string' },
        },
      ],
      responses: orderMutationResponses,
      summary: 'Accept store order',
      tags: ['Vendor'],
    },
  },
  '/store/orders/{orderId}/reject': {
    post: {
      parameters: [
        {
          in: 'path',
          name: 'orderId',
          required: true,
          schema: { type: 'string' },
        },
      ],
      requestBody: {
        content: {
          'application/json': {
            schema: {
              properties: {
                reason: { maxLength: 500, minLength: 1, type: 'string' },
              },
              required: ['reason'],
              type: 'object',
            },
          },
        },
        required: true,
      },
      responses: orderMutationResponses,
      summary: 'Reject store order',
      tags: ['Vendor'],
    },
  },
  '/store/orders/{orderId}/picking/start': {
    post: {
      parameters: [
        {
          in: 'path',
          name: 'orderId',
          required: true,
          schema: { type: 'string' },
        },
      ],
      responses: orderMutationResponses,
      summary: 'Start store order picking',
      tags: ['Vendor'],
    },
  },
  '/store/orders/{orderId}/items/{itemId}/picked': {
    post: {
      parameters: [
        {
          in: 'path',
          name: 'orderId',
          required: true,
          schema: { type: 'string' },
        },
        {
          in: 'path',
          name: 'itemId',
          required: true,
          schema: { type: 'string' },
        },
      ],
      requestBody: {
        content: {
          'application/json': {
            schema: {
              properties: {
                quantity: { minimum: 1, type: 'integer' },
              },
              required: ['quantity'],
              type: 'object',
            },
          },
        },
        required: true,
      },
      responses: orderMutationResponses,
      summary: 'Mark store order item picked',
      tags: ['Vendor'],
    },
  },
  '/store/orders/{orderId}/items/{itemId}/missing': {
    post: {
      parameters: [
        {
          in: 'path',
          name: 'orderId',
          required: true,
          schema: { type: 'string' },
        },
        {
          in: 'path',
          name: 'itemId',
          required: true,
          schema: { type: 'string' },
        },
      ],
      requestBody: {
        content: {
          'application/json': {
            schema: {
              properties: {
                quantity: { minimum: 1, type: 'integer' },
              },
              required: ['quantity'],
              type: 'object',
            },
          },
        },
        required: true,
      },
      responses: orderMutationResponses,
      summary: 'Mark store order item missing',
      tags: ['Vendor'],
    },
  },
  '/store/orders/{orderId}/picking/complete': {
    post: {
      parameters: [
        {
          in: 'path',
          name: 'orderId',
          required: true,
          schema: { type: 'string' },
        },
      ],
      responses: orderMutationResponses,
      summary: 'Complete store order picking',
      tags: ['Vendor'],
    },
  },
  '/store/orders/{orderId}/packing/start': {
    post: {
      parameters: [
        {
          in: 'path',
          name: 'orderId',
          required: true,
          schema: { type: 'string' },
        },
      ],
      responses: orderMutationResponses,
      summary: 'Start store order packing',
      tags: ['Vendor'],
    },
  },
  '/store/orders/{orderId}/packing/complete': {
    post: {
      parameters: [
        {
          in: 'path',
          name: 'orderId',
          required: true,
          schema: { type: 'string' },
        },
      ],
      responses: orderMutationResponses,
      summary: 'Complete store order packing',
      tags: ['Vendor'],
    },
  },
  '/store/orders/{orderId}/ready-for-pickup': {
    post: {
      parameters: [
        {
          in: 'path',
          name: 'orderId',
          required: true,
          schema: { type: 'string' },
        },
      ],
      responses: orderMutationResponses,
      summary: 'Mark store order ready for pickup',
      tags: ['Vendor'],
    },
  },
  '/store/orders/{orderId}/cancel': {
    post: {
      parameters: [
        {
          in: 'path',
          name: 'orderId',
          required: true,
          schema: { type: 'string' },
        },
      ],
      requestBody: cancellationRequestBody,
      responses: orderMutationResponses,
      summary: 'Cancel store order',
      tags: ['Vendor'],
    },
  },
};
