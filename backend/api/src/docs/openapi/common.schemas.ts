export const ApiSuccessResponseSchema = {
  properties: {
    data: {
      type: 'object',
    },
    message: {
      example: 'Request successful',
      type: 'string',
    },
    meta: {
      type: 'object',
    },
    success: {
      example: true,
      type: 'boolean',
    },
  },
  required: ['success', 'message', 'data', 'meta'],
  type: 'object',
};

export const ApiErrorResponseSchema = {
  properties: {
    error: {
      properties: {
        code: {
          example: 'VALIDATION_ERROR',
          type: 'string',
        },
        details: {
          type: 'object',
        },
      },
      required: ['code', 'details'],
      type: 'object',
    },
    message: {
      example: 'Error message',
      type: 'string',
    },
    success: {
      example: false,
      type: 'boolean',
    },
  },
  required: ['success', 'message', 'error'],
  type: 'object',
};

export const PaginationMetaSchema = {
  properties: {
    hasNextPage: {
      example: true,
      type: 'boolean',
    },
    limit: {
      example: 20,
      type: 'number',
    },
    page: {
      example: 1,
      type: 'number',
    },
    total: {
      example: 100,
      type: 'number',
    },
  },
  required: ['page', 'limit', 'total', 'hasNextPage'],
  type: 'object',
};

export const HealthResponseSchema = {
  allOf: [
    ApiSuccessResponseSchema,
    {
      properties: {
        data: {
          properties: {
            database: {
              properties: {
                readyState: {
                  example: 1,
                  type: 'number',
                },
                status: {
                  example: 'connected',
                  type: 'string',
                },
              },
              required: ['status', 'readyState'],
              type: 'object',
            },
            service: {
              example: 'backend-api',
              type: 'string',
            },
            status: {
              example: 'ok',
              type: 'string',
            },
          },
          required: ['status', 'service', 'database'],
          type: 'object',
        },
      },
      type: 'object',
    },
  ],
};

export const VersionResponseSchema = {
  allOf: [
    ApiSuccessResponseSchema,
    {
      properties: {
        data: {
          properties: {
            environment: {
              example: 'development',
              type: 'string',
            },
            version: {
              example: '1.0.0',
              type: 'string',
            },
          },
          required: ['version', 'environment'],
          type: 'object',
        },
      },
      type: 'object',
    },
  ],
};

export const SystemInfoResponseSchema = {
  allOf: [
    ApiSuccessResponseSchema,
    {
      properties: {
        data: {
          properties: {
            environment: {
              example: 'development',
              type: 'string',
            },
            timestamp: {
              example: '2026-05-05T10:30:00.000Z',
              type: 'string',
            },
            uptime: {
              example: 0,
              type: 'number',
            },
          },
          required: ['environment', 'uptime', 'timestamp'],
          type: 'object',
        },
      },
      type: 'object',
    },
  ],
};
