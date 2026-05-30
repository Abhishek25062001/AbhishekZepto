import { ApiErrorResponseSchema } from './common.schemas';

const controlTowerSnapshotSchema = {
  properties: {
    activeOrdersCount: { type: 'number', example: 24 },
    assignedRidersCount: { type: 'number', example: 18 },
    outForDeliveryCount: { type: 'number', example: 9 },
    delayedOrdersCount: { type: 'number', example: 3 },
    openSlaBreachesCount: { type: 'number', example: 2 },
    activeOrders: { items: { type: 'object' }, type: 'array' },
    activeDeliveries: { items: { type: 'object' }, type: 'array' },
    openSlaBreaches: { items: { type: 'object' }, type: 'array' },
  },
  type: 'object',
};

export const controlTowerPaths = {
  '/admin/control-tower/snapshot': {
    get: {
      description:
        'Fetch the Admin Dashboard realtime control tower snapshot for initial load and polling fallback.',
      parameters: [
        {
          in: 'query',
          name: 'cityId',
          required: false,
          schema: { type: 'string' },
        },
      ],
      responses: {
        200: {
          content: {
            'application/json': {
              schema: {
                properties: {
                  data: controlTowerSnapshotSchema,
                  message: { type: 'string' },
                  success: { type: 'boolean' },
                },
                type: 'object',
              },
            },
          },
          description: 'Control tower snapshot fetched successfully.',
        },
        401: {
          content: { 'application/json': { schema: ApiErrorResponseSchema } },
          description: 'Authentication failure response.',
        },
      },
      summary: 'Get control tower snapshot',
      tags: ['Admin Control Tower'],
    },
  },
  '/admin/control-tower/delivery-locations': {
    get: {
      description:
        'Fetch active delivery locations for Admin Dashboard realtime control tower initial load and polling fallback.',
      parameters: [
        {
          in: 'query',
          name: 'cityId',
          required: false,
          schema: { type: 'string' },
        },
      ],
      responses: {
        200: {
          content: {
            'application/json': {
              schema: {
                properties: {
                  data: { items: { type: 'object' }, type: 'array' },
                  message: { type: 'string' },
                  success: { type: 'boolean' },
                },
                type: 'object',
              },
            },
          },
          description: 'Active delivery locations fetched successfully.',
        },
        401: {
          content: { 'application/json': { schema: ApiErrorResponseSchema } },
          description: 'Authentication failure response.',
        },
      },
      summary: 'Get control tower delivery locations',
      tags: ['Admin Control Tower'],
    },
  },
};
