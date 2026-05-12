import { ApiErrorResponseSchema, ApiSuccessResponseSchema } from './common.schemas';

const authPlaceholderResponses = {
  200: {
    content: {
      'application/json': {
        schema: ApiSuccessResponseSchema,
      },
    },
    description: 'Auth placeholder response.',
  },
  422: {
    content: {
      'application/json': {
        schema: ApiErrorResponseSchema,
      },
    },
    description: 'Validation failure response.',
  },
};

export const authPaths = {
  '/public/auth/logout': {
    post: {
      requestBody: {
        content: {
          'application/json': {
            schema: {
              properties: {
                refreshToken: {
                  example: 'phase1-refresh-token-placeholder',
                  type: 'string',
                },
              },
              required: ['refreshToken'],
              type: 'object',
            },
          },
        },
      },
      responses: authPlaceholderResponses,
      summary: 'Logout placeholder',
      tags: ['Public'],
    },
  },
  '/public/auth/refresh-token': {
    post: {
      requestBody: {
        content: {
          'application/json': {
            schema: {
              properties: {
                refreshToken: {
                  example: 'phase1-refresh-token-placeholder',
                  type: 'string',
                },
              },
              required: ['refreshToken'],
              type: 'object',
            },
          },
        },
      },
      responses: authPlaceholderResponses,
      summary: 'Refresh token placeholder',
      tags: ['Public'],
    },
  },
  '/public/auth/request-otp': {
    post: {
      requestBody: {
        content: {
          'application/json': {
            schema: {
              properties: {
                phone: {
                  example: '9999999999',
                  type: 'string',
                },
                role: {
                  example: 'customer',
                  type: 'string',
                },
              },
              required: ['phone', 'role'],
              type: 'object',
            },
          },
        },
      },
      responses: authPlaceholderResponses,
      summary: 'Request OTP placeholder',
      tags: ['Public'],
    },
  },
  '/public/auth/verify-otp': {
    post: {
      requestBody: {
        content: {
          'application/json': {
            schema: {
              properties: {
                otp: {
                  example: '123456',
                  type: 'string',
                },
                phone: {
                  example: '9999999999',
                  type: 'string',
                },
                role: {
                  example: 'customer',
                  type: 'string',
                },
              },
              required: ['phone', 'role', 'otp'],
              type: 'object',
            },
          },
        },
      },
      responses: authPlaceholderResponses,
      summary: 'Verify OTP placeholder',
      tags: ['Public'],
    },
  },
};
