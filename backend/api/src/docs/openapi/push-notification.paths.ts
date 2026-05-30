import { ApiErrorResponseSchema } from './common.schemas';

const deviceTokenRequestSchema = {
  properties: {
    appVersion: { type: 'string', example: '7.0.0' },
    deviceId: { type: 'string', example: 'ios-device-123' },
    deviceName: { type: 'string', example: 'Shivam iPhone' },
    fcmToken: { type: 'string', example: 'masked-fcm-token-value' },
    platform: { enum: ['android', 'ios', 'web'], type: 'string', example: 'ios' },
  },
  required: ['deviceId', 'fcmToken', 'platform'],
  type: 'object',
};

const deviceTokenResponseSchema = {
  properties: {
    appSurface: { enum: ['customer_app', 'delivery_agent_app'], type: 'string' },
    appVersion: { nullable: true, type: 'string' },
    createdAt: { format: 'date-time', type: 'string' },
    deviceId: { type: 'string' },
    deviceName: { nullable: true, type: 'string' },
    fcmTokenMasked: { type: 'string', example: 'fcm_...abcd' },
    isActive: { type: 'boolean' },
    lastUsedAt: { format: 'date-time', type: 'string' },
    platform: { enum: ['android', 'ios', 'web'], type: 'string' },
    revokedAt: { format: 'date-time', nullable: true, type: 'string' },
    role: { type: 'string', example: 'customer' },
    updatedAt: { format: 'date-time', type: 'string' },
    userId: { type: 'string' },
  },
  type: 'object',
};

const pushLogResponseSchema = {
  properties: {
    appSurface: { enum: ['customer_app', 'delivery_agent_app'], type: 'string' },
    body: { type: 'string' },
    createdAt: { format: 'date-time', type: 'string' },
    dataPayload: { additionalProperties: { type: 'string' }, type: 'object' },
    failedAt: { format: 'date-time', nullable: true, type: 'string' },
    failureReason: { nullable: true, type: 'string' },
    fcmTokenMasked: { type: 'string' },
    notificationType: { type: 'string' },
    providerMessageId: { nullable: true, type: 'string' },
    role: { type: 'string' },
    sentAt: { format: 'date-time', nullable: true, type: 'string' },
    status: { enum: ['pending', 'sent', 'failed', 'skipped'], type: 'string' },
    title: { type: 'string' },
    updatedAt: { format: 'date-time', type: 'string' },
    userId: { type: 'string' },
  },
  type: 'object',
};

const registerDeviceTokenOperation = (summary: string) => ({
  description: 'Register or refresh the authenticated user device token for push notifications.',
  requestBody: {
    content: {
      'application/json': {
        schema: deviceTokenRequestSchema,
      },
    },
    required: true,
  },
  responses: {
    201: {
      content: {
        'application/json': {
          schema: {
            properties: {
              data: deviceTokenResponseSchema,
              message: { type: 'string' },
              success: { type: 'boolean' },
            },
            type: 'object',
          },
        },
      },
      description: 'Device token registered successfully.',
    },
    401: {
      content: { 'application/json': { schema: ApiErrorResponseSchema } },
      description: 'Authentication failure response.',
    },
    422: {
      content: { 'application/json': { schema: ApiErrorResponseSchema } },
      description: 'Request validation failed.',
    },
  },
  summary,
  tags: ['Push Notifications'],
});

const removeDeviceTokenOperation = (summary: string) => ({
  description: 'Revoke a device token by authenticated user and device id.',
  parameters: [
    {
      in: 'path',
      name: 'deviceId',
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
              data: { oneOf: [deviceTokenResponseSchema, { nullable: true, type: 'object' }] },
              message: { type: 'string' },
              success: { type: 'boolean' },
            },
            type: 'object',
          },
        },
      },
      description: 'Device token removed successfully.',
    },
    401: {
      content: { 'application/json': { schema: ApiErrorResponseSchema } },
      description: 'Authentication failure response.',
    },
  },
  summary,
  tags: ['Push Notifications'],
});

export const pushNotificationPaths = {
  '/customer/me/device-token': {
    post: registerDeviceTokenOperation('Register customer device token'),
  },
  '/customer/me/device-token/{deviceId}': {
    delete: removeDeviceTokenOperation('Remove customer device token'),
  },
  '/delivery/me/device-token': {
    post: registerDeviceTokenOperation('Register delivery agent device token'),
  },
  '/delivery/me/device-token/{deviceId}': {
    delete: removeDeviceTokenOperation('Remove delivery agent device token'),
  },
  '/admin/push-notifications/logs': {
    get: {
      description: 'List push notification delivery logs for admin review.',
      parameters: [
        { in: 'query', name: 'limit', required: false, schema: { maximum: 100, minimum: 1, type: 'integer' } },
        { in: 'query', name: 'notificationType', required: false, schema: { type: 'string' } },
        { in: 'query', name: 'page', required: false, schema: { minimum: 1, type: 'integer' } },
        { in: 'query', name: 'status', required: false, schema: { enum: ['pending', 'sent', 'failed', 'skipped'], type: 'string' } },
        { in: 'query', name: 'userId', required: false, schema: { type: 'string' } },
      ],
      responses: {
        200: {
          content: {
            'application/json': {
              schema: {
                properties: {
                  data: {
                    properties: {
                      items: { items: pushLogResponseSchema, type: 'array' },
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
          description: 'Push notification logs fetched successfully.',
        },
        401: {
          content: { 'application/json': { schema: ApiErrorResponseSchema } },
          description: 'Authentication failure response.',
        },
      },
      summary: 'List push notification logs',
      tags: ['Admin Push Notifications'],
    },
  },
  '/admin/push-notifications/logs/{logId}': {
    get: {
      description: 'Fetch a single push notification log by id.',
      parameters: [
        {
          in: 'path',
          name: 'logId',
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
                  data: { oneOf: [pushLogResponseSchema, { nullable: true, type: 'object' }] },
                  message: { type: 'string' },
                  success: { type: 'boolean' },
                },
                type: 'object',
              },
            },
          },
          description: 'Push notification log fetched successfully.',
        },
        401: {
          content: { 'application/json': { schema: ApiErrorResponseSchema } },
          description: 'Authentication failure response.',
        },
      },
      summary: 'Get push notification log',
      tags: ['Admin Push Notifications'],
    },
  },
};
