import { ApiErrorResponseSchema, ApiSuccessResponseSchema } from './common.schemas';

const authPlaceholderResponses = {
  200: {
    content: {
      'application/json': {
        schema: ApiSuccessResponseSchema,
      },
    },
    description: 'Auth success response.',
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
  429: {
    content: {
      'application/json': {
        schema: ApiErrorResponseSchema,
      },
    },
    description: 'Rate-limited response.',
  },
};

export const authPaths = {
  '/admin/roles': {
    get: {
      responses: authPlaceholderResponses,
      summary: 'List admin-manageable roles',
      tags: ['Admin'],
    },
    post: {
      requestBody: {
        content: {
          'application/json': {
            schema: {
              properties: {
                code: {
                  example: 'support_admin',
                  type: 'string',
                },
                name: {
                  example: 'Support Admin',
                  type: 'string',
                },
                description: {
                  example: 'Support-focused admin role',
                  nullable: true,
                  type: 'string',
                },
                permissions: {
                  items: {
                    type: 'string',
                  },
                  type: 'array',
                },
                isEditable: {
                  example: true,
                  type: 'boolean',
                },
              },
              required: ['code', 'name', 'permissions'],
              type: 'object',
            },
          },
        },
      },
      responses: authPlaceholderResponses,
      summary: 'Create a role',
      tags: ['Admin'],
    },
  },
  '/admin/roles/{roleId}': {
    delete: {
      parameters: [
        {
          in: 'path',
          name: 'roleId',
          required: true,
          schema: {
            type: 'string',
          },
        },
      ],
      responses: authPlaceholderResponses,
      summary: 'Delete a role',
      tags: ['Admin'],
    },
    get: {
      parameters: [
        {
          in: 'path',
          name: 'roleId',
          required: true,
          schema: {
            type: 'string',
          },
        },
      ],
      responses: authPlaceholderResponses,
      summary: 'Get a role by id',
      tags: ['Admin'],
    },
    patch: {
      parameters: [
        {
          in: 'path',
          name: 'roleId',
          required: true,
          schema: {
            type: 'string',
          },
        },
      ],
      requestBody: {
        content: {
          'application/json': {
            schema: {
              properties: {
                name: {
                  example: 'Support Admin',
                  type: 'string',
                },
                description: {
                  example: 'Updated description',
                  nullable: true,
                  type: 'string',
                },
                permissions: {
                  items: {
                    type: 'string',
                  },
                  type: 'array',
                },
                isEditable: {
                  example: true,
                  type: 'boolean',
                },
                status: {
                  example: 'active',
                  type: 'string',
                },
              },
              type: 'object',
            },
          },
        },
      },
      responses: authPlaceholderResponses,
      summary: 'Update a role',
      tags: ['Admin'],
    },
  },
  '/admin/users/{userId}/permissions': {
    patch: {
      parameters: [
        {
          in: 'path',
          name: 'userId',
          required: true,
          schema: {
            type: 'string',
          },
        },
      ],
      requestBody: {
        content: {
          'application/json': {
            schema: {
              properties: {
                permissions: {
                  items: {
                    type: 'string',
                  },
                  type: 'array',
                },
              },
              required: ['permissions'],
              type: 'object',
            },
          },
        },
      },
      responses: authPlaceholderResponses,
      summary: 'Update explicit user permissions',
      tags: ['Admin'],
    },
  },
  '/admin/users/{userId}/role': {
    patch: {
      parameters: [
        {
          in: 'path',
          name: 'userId',
          required: true,
          schema: {
            type: 'string',
          },
        },
      ],
      requestBody: {
        content: {
          'application/json': {
            schema: {
              properties: {
                role: {
                  example: 'operations_admin',
                  type: 'string',
                },
              },
              required: ['role'],
              type: 'object',
            },
          },
        },
      },
      responses: authPlaceholderResponses,
      summary: 'Assign a user role',
      tags: ['Admin'],
    },
  },
  '/admin/users/{userId}/sync-role-permissions': {
    post: {
      parameters: [
        {
          in: 'path',
          name: 'userId',
          required: true,
          schema: {
            type: 'string',
          },
        },
      ],
      requestBody: {
        content: {
          'application/json': {
            schema: {
              properties: {
                roleCode: {
                  example: 'operations_admin',
                  type: 'string',
                },
              },
              required: ['roleCode'],
              type: 'object',
            },
          },
        },
      },
      responses: authPlaceholderResponses,
      summary: 'Sync user permissions from a role',
      tags: ['Admin'],
    },
  },
  '/auth/logout-other-sessions': {
    post: {
      responses: authPlaceholderResponses,
      summary: 'Logout all other sessions for the current user',
      tags: ['Auth'],
    },
  },
  '/auth/logout-session': {
    post: {
      requestBody: {
        content: {
          'application/json': {
            schema: {
              properties: {
                sessionId: {
                  example: '64f0c5f8a0b123456789abcd',
                  type: 'string',
                },
              },
              required: ['sessionId'],
              type: 'object',
            },
          },
        },
      },
      responses: authPlaceholderResponses,
      summary: 'Logout a selected session for the current user',
      tags: ['Auth'],
    },
  },
  '/auth/me/sessions': {
    get: {
      responses: authPlaceholderResponses,
      summary: 'List current user sessions',
      tags: ['Auth'],
    },
  },
  '/public/auth/logout': {
    post: {
      requestBody: {
        content: {
          'application/json': {
            schema: {
              properties: {
                refreshToken: {
                  example: 'refresh_token_here',
                  type: 'string',
                },
                logoutAllDevices: {
                  example: false,
                  type: 'boolean',
                },
              },
              required: ['refreshToken'],
              type: 'object',
            },
          },
        },
      },
      responses: authPlaceholderResponses,
      summary: 'Logout user session',
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
                  example: 'refresh_token_here',
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
      summary: 'Refresh access token',
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
                purpose: {
                  example: 'login',
                  type: 'string',
                },
                deliveryChannel: {
                  example: 'sms',
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
      summary: 'Request login OTP',
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
                challengeId: {
                  example: '64f0c5f8a0b123456789abcd',
                  type: 'string',
                },
                device: {
                  properties: {
                    deviceId: {
                      example: 'device-123',
                      type: 'string',
                    },
                    deviceType: {
                      example: 'android',
                      type: 'string',
                    },
                    appSurface: {
                      example: 'customer_app',
                      type: 'string',
                    },
                    appVersion: {
                      example: '1.0.0',
                      type: 'string',
                    },
                  },
                  required: ['deviceType', 'appSurface'],
                  type: 'object',
                },
              },
              required: ['phone', 'role', 'otp', 'challengeId', 'device'],
              type: 'object',
            },
          },
        },
      },
      responses: authPlaceholderResponses,
      summary: 'Verify login OTP',
      tags: ['Public'],
    },
  },
};
