import { ApiErrorResponseSchema, ApiSuccessResponseSchema } from './common.schemas';

const paymentMutationResponses = {
  200: {
    content: { 'application/json': { schema: ApiSuccessResponseSchema } },
    description: 'Payment operation success response.',
  },
  400: {
    content: { 'application/json': { schema: ApiErrorResponseSchema } },
    description: 'Invalid request response.',
  },
  401: {
    content: { 'application/json': { schema: ApiErrorResponseSchema } },
    description: 'Authentication failure response.',
  },
  403: {
    content: { 'application/json': { schema: ApiErrorResponseSchema } },
    description: 'Authorization or scope failure response.',
  },
  404: {
    content: { 'application/json': { schema: ApiErrorResponseSchema } },
    description: 'Payment record not found response.',
  },
  409: {
    content: { 'application/json': { schema: ApiErrorResponseSchema } },
    description: 'Payment conflict response.',
  },
};

export const paymentRecordsPaths = {
  '/customer/payments/create-order': {
    post: {
      requestBody: {
        content: {
          'application/json': {
            schema: {
              properties: {
                checkoutSessionId: { type: 'string' },
                idempotencyKey: { type: 'string' },
              },
              required: ['checkoutSessionId', 'idempotencyKey'],
              type: 'object',
            },
          },
        },
        required: true,
      },
      responses: paymentMutationResponses,
      summary: 'Create payment order',
      tags: ['Customer Payments'],
    },
  },
  '/customer/payments/verify': {
    post: {
      requestBody: {
        content: {
          'application/json': {
            schema: {
              properties: {
                paymentId: { type: 'string' },
                razorpayOrderId: { type: 'string' },
                razorpayPaymentId: { type: 'string' },
                razorpaySignature: { type: 'string' },
              },
              required: ['paymentId', 'razorpayOrderId', 'razorpayPaymentId', 'razorpaySignature'],
              type: 'object',
            },
          },
        },
        required: true,
      },
      responses: paymentMutationResponses,
      summary: 'Verify payment (legacy body path)',
      tags: ['Customer Payments'],
    },
  },
  '/customer/payments/{paymentId}/verify': {
    post: {
      parameters: [{ in: 'path', name: 'paymentId', required: true, schema: { type: 'string' } }],
      requestBody: {
        content: {
          'application/json': {
            schema: {
              properties: {
                gatewayOrderId: { type: 'string' },
                gatewayPaymentId: { type: 'string' },
                gatewaySignature: { type: 'string' },
              },
              type: 'object',
            },
          },
        },
        required: true,
      },
      responses: paymentMutationResponses,
      summary: 'Verify payment by payment id',
      tags: ['Customer Payments'],
    },
  },
  '/customer/payments/{paymentId}': {
    get: {
      parameters: [{ in: 'path', name: 'paymentId', required: true, schema: { type: 'string' } }],
      responses: paymentMutationResponses,
      summary: 'Get customer payment by id',
      tags: ['Customer Payments'],
    },
  },
  '/admin/finance/payments': {
    get: {
      parameters: [
        { in: 'query', name: 'page', schema: { type: 'integer' } },
        { in: 'query', name: 'limit', schema: { type: 'integer' } },
        { in: 'query', name: 'customerId', schema: { type: 'string' } },
        { in: 'query', name: 'orderId', schema: { type: 'string' } },
        { in: 'query', name: 'storeId', schema: { type: 'string' } },
        { in: 'query', name: 'paymentStatus', schema: { type: 'string' } },
      ],
      responses: paymentMutationResponses,
      summary: 'List admin finance payments',
      tags: ['Admin Finance Payments'],
    },
  },
  '/admin/finance/payments/{paymentId}': {
    get: {
      parameters: [{ in: 'path', name: 'paymentId', required: true, schema: { type: 'string' } }],
      responses: paymentMutationResponses,
      summary: 'Get admin finance payment by id',
      tags: ['Admin Finance Payments'],
    },
  },
  '/public/webhooks/payments/razorpay': {
    post: {
      responses: {
        200: {
          content: { 'application/json': { schema: ApiSuccessResponseSchema } },
          description: 'Webhook processed response.',
        },
        401: {
          content: { 'application/json': { schema: ApiErrorResponseSchema } },
          description: 'Invalid webhook signature response.',
        },
      },
      summary: 'Razorpay payment webhook',
      tags: ['Public Webhooks'],
    },
  },
  '/webhooks/razorpay': {
    post: {
      responses: {
        200: {
          content: { 'application/json': { schema: ApiSuccessResponseSchema } },
          description: 'Legacy webhook processed response.',
        },
        401: {
          content: { 'application/json': { schema: ApiErrorResponseSchema } },
          description: 'Invalid webhook signature response.',
        },
      },
      summary: 'Razorpay payment webhook (legacy path)',
      tags: ['Public Webhooks'],
    },
  },
};
