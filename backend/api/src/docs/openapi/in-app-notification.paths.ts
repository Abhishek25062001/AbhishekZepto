import { ApiErrorResponseSchema } from './common.schemas';

const notificationSchema = {
  properties: {
    createdAt: { format: 'date-time', type: 'string' },
    dataPayload: { additionalProperties: true, type: 'object' },
    id: { type: 'string' },
    isRead: { type: 'boolean' },
    message: { type: 'string' },
    notificationType: {
      enum: [
        'order_update',
        'delivery_update',
        'assignment_update',
        'payment_update',
        'refund_update',
        'sla_alert',
        'system_alert',
      ],
      type: 'string',
    },
    priority: { enum: ['low', 'normal', 'high', 'critical'], type: 'string' },
    readAt: { format: 'date-time', nullable: true, type: 'string' },
    title: { type: 'string' },
  },
  type: 'object',
};

const listOperation = (summary: string) => ({
  parameters: [
    { in: 'query', name: 'isRead', required: false, schema: { type: 'boolean' } },
    {
      in: 'query',
      name: 'notificationType',
      required: false,
      schema: {
        enum: [
          'order_update',
          'delivery_update',
          'assignment_update',
          'payment_update',
          'refund_update',
          'sla_alert',
          'system_alert',
        ],
        type: 'string',
      },
    },
    { in: 'query', name: 'page', required: false, schema: { minimum: 1, type: 'integer' } },
    {
      in: 'query',
      name: 'limit',
      required: false,
      schema: { maximum: 100, minimum: 1, type: 'integer' },
    },
  ],
  responses: {
    200: {
      content: {
        'application/json': {
          schema: {
            properties: {
              data: {
                properties: {
                  items: { items: notificationSchema, type: 'array' },
                  pagination: {
                    properties: {
                      limit: { type: 'number' },
                      page: { type: 'number' },
                      total: { type: 'number' },
                    },
                    type: 'object',
                  },
                },
                type: 'object',
              },
              message: { type: 'string' },
              success: { type: 'boolean' },
            },
            type: 'object',
          },
        },
      },
      description: 'Notifications fetched successfully.',
    },
    401: {
      content: { 'application/json': { schema: ApiErrorResponseSchema } },
      description: 'Authentication failure response.',
    },
  },
  summary,
  tags: ['In-App Notifications'],
});

const unreadCountOperation = (summary: string) => ({
  responses: {
    200: {
      content: {
        'application/json': {
          schema: {
            properties: {
              data: {
                properties: { unreadCount: { type: 'number' } },
                type: 'object',
              },
              message: { type: 'string' },
              success: { type: 'boolean' },
            },
            type: 'object',
          },
        },
      },
      description: 'Unread count fetched successfully.',
    },
  },
  summary,
  tags: ['In-App Notifications'],
});

const markReadOperation = (summary: string) => ({
  parameters: [
    {
      in: 'path',
      name: 'notificationId',
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
              data: notificationSchema,
              message: { type: 'string' },
              success: { type: 'boolean' },
            },
            type: 'object',
          },
        },
      },
      description: 'Notification marked read successfully.',
    },
    403: {
      content: { 'application/json': { schema: ApiErrorResponseSchema } },
      description: 'Notification scope denied.',
    },
    404: {
      content: { 'application/json': { schema: ApiErrorResponseSchema } },
      description: 'Notification not found.',
    },
  },
  summary,
  tags: ['In-App Notifications'],
});

const markAllReadOperation = (summary: string) => ({
  responses: {
    200: {
      content: {
        'application/json': {
          schema: {
            properties: {
              data: {
                properties: { updatedCount: { type: 'number' } },
                type: 'object',
              },
              message: { type: 'string' },
              success: { type: 'boolean' },
            },
            type: 'object',
          },
        },
      },
      description: 'Notifications marked read successfully.',
    },
  },
  summary,
  tags: ['In-App Notifications'],
});

const buildSurfacePaths = (basePath: string, label: string) => ({
  [basePath]: {
    get: listOperation(`List ${label} notifications`),
  },
  [`${basePath}/unread-count`]: {
    get: unreadCountOperation(`Get ${label} unread notification count`),
  },
  [`${basePath}/{notificationId}/read`]: {
    patch: markReadOperation(`Mark ${label} notification read`),
  },
  [`${basePath}/read-all`]: {
    patch: markAllReadOperation(`Mark all ${label} notifications read`),
  },
});

export const inAppNotificationPaths = {
  ...buildSurfacePaths('/customer/me/notifications', 'customer'),
  ...buildSurfacePaths('/delivery/me/notifications', 'delivery'),
  ...buildSurfacePaths('/vendor/me/notifications', 'vendor'),
  ...buildSurfacePaths('/admin/me/notifications', 'admin'),
};
