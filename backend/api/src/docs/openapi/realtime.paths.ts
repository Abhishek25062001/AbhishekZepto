import { ApiErrorResponseSchema } from './common.schemas';

const realtimeEventSchema = {
  properties: {
    eventId: { type: 'string', example: 'uuid-1234-5678' },
    eventName: { type: 'string', example: 'customer.order_status_updated' },
    recipientUserId: { type: 'string', example: '607f1f77bcf86cd799439011' },
    appSurface: { type: 'string', example: 'customer_app' },
    deliveryStatus: { enum: ['pending', 'delivered', 'failed', 'acknowledged'], type: 'string', example: 'pending' },
    payload: { additionalProperties: true, type: 'object' },
    emittedAt: { format: 'date-time', type: 'string' },
    acknowledgedAt: { format: 'date-time', nullable: true, type: 'string' },
    expiresAt: { format: 'date-time', type: 'string' },
  },
  type: 'object',
};

const ackResponseSchema = {
  properties: {
    eventId: { type: 'string', example: 'uuid-1234-5678' },
    deliveryStatus: { type: 'string', example: 'acknowledged' },
    acknowledgedAt: { format: 'date-time', type: 'string' },
  },
  type: 'object',
};

const realtimeHealthResponseSchema = {
  properties: {
    isSocketServerRunning: { type: 'boolean', example: true },
    connectedSocketsCount: { type: 'integer', example: 5 },
    namespaceCounts: {
      properties: {
        '/': { type: 'integer', example: 1 },
        '/customer': { type: 'integer', example: 2 },
        '/delivery': { type: 'integer', example: 1 },
        '/vendor': { type: 'integer', example: 1 },
        '/admin': { type: 'integer', example: 0 },
      },
      type: 'object',
    },
    redisAdapterEnabled: { type: 'boolean', example: false },
    lastEmitAt: { format: 'date-time', nullable: true, type: 'string' },
    failedEmitCount: { type: 'integer', example: 0 },
  },
  type: 'object',
};

export const realtimePaths = {
  '/customer/realtime/missed-events': {
    get: {
      description: 'Fetch missed (unacknowledged) real-time events for the authenticated customer.',
      responses: {
        200: {
          content: {
            'application/json': {
              schema: {
                properties: {
                  data: { items: realtimeEventSchema, type: 'array' },
                  message: { type: 'string' },
                  success: { type: 'boolean' },
                },
                type: 'object',
              },
            },
          },
          description: 'Missed events fetched successfully.',
        },
        401: {
          content: { 'application/json': { schema: ApiErrorResponseSchema } },
          description: 'Authentication failure response.',
        },
      },
      summary: 'Get customer missed events',
      tags: ['Customer Realtime'],
    },
  },
  '/customer/realtime/events/{eventId}/ack': {
    post: {
      description: 'Acknowledge receipt of a real-time event by the authenticated customer.',
      parameters: [
        {
          in: 'path',
          name: 'eventId',
          required: true,
          schema: { type: 'string' },
        },
      ],
      responses: {
        200: {
          content: {
            'application/json': {
              schema: {
                properties: {
                  data: { oneOf: [ackResponseSchema, { nullable: true, type: 'object' }] },
                  message: { type: 'string' },
                  success: { type: 'boolean' },
                },
                type: 'object',
              },
            },
          },
          description: 'Event acknowledged successfully.',
        },
        401: {
          content: { 'application/json': { schema: ApiErrorResponseSchema } },
          description: 'Authentication failure response.',
        },
      },
      summary: 'Acknowledge customer realtime event',
      tags: ['Customer Realtime'],
    },
  },
  '/admin/realtime/health': {
    get: {
      description: 'Fetch current real-time socket server health and emission metrics.',
      responses: {
        200: {
          content: {
            'application/json': {
              schema: {
                properties: {
                  data: realtimeHealthResponseSchema,
                  message: { type: 'string' },
                  success: { type: 'boolean' },
                },
                type: 'object',
              },
            },
          },
          description: 'Real-time health status fetched successfully.',
        },
        401: {
          content: { 'application/json': { schema: ApiErrorResponseSchema } },
          description: 'Authentication failure response.',
        },
      },
      summary: 'Get admin realtime health',
      tags: ['Admin Realtime'],
    },
  },
};
