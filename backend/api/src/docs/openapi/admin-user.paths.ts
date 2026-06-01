import { ApiErrorResponseSchema } from './common.schemas';

const adminUserSchema = {
  properties: {
    adminUserId: { type: 'string' },
    userId: { type: 'string' },
    name: { nullable: true, type: 'string' },
    email: { nullable: true, type: 'string' },
    phone: { type: 'string' },
    role: { type: 'string' },
    permissions: { items: { type: 'string' }, type: 'array' },
    status: { type: 'string' },
    cityScope: { items: { type: 'string' }, type: 'array' },
    storeScope: { items: { type: 'string' }, type: 'array' },
    createdBy: { nullable: true, type: 'string' },
    updatedBy: { nullable: true, type: 'string' },
    lastLoginAt: { nullable: true, type: 'string' },
    disabledAt: { nullable: true, type: 'string' },
    disabledBy: { nullable: true, type: 'string' },
    disableReason: { nullable: true, type: 'string' },
    createdAt: { format: 'date-time', type: 'string' },
    updatedAt: { format: 'date-time', type: 'string' },
  },
  type: 'object',
};

const adminUserResponse = (description: string) => ({
  content: {
    'application/json': {
      schema: {
        properties: {
          data: adminUserSchema,
          message: { type: 'string' },
          success: { type: 'boolean' },
        },
        type: 'object',
      },
    },
  },
  description,
});

const adminUserIdParam = {
  in: 'path',
  name: 'adminUserId',
  required: true,
  schema: { type: 'string' },
};

export const adminUserPaths = {
  '/admin/users': {
    post: {
      summary: 'Create admin user',
      tags: ['Admin Users'],
      requestBody: {
        content: {
          'application/json': {
            schema: {
              properties: {
                name: { type: 'string' },
                email: { type: 'string' },
                phone: { type: 'string' },
                role: { type: 'string' },
                permissions: { items: { type: 'string' }, type: 'array' },
                cityScope: { items: { type: 'string' }, type: 'array' },
                storeScope: { items: { type: 'string' }, type: 'array' },
                status: { type: 'string' },
              },
              required: ['phone', 'role'],
              type: 'object',
            },
          },
        },
      },
      responses: {
        201: adminUserResponse('Admin user created successfully.'),
        409: { content: { 'application/json': { schema: ApiErrorResponseSchema } }, description: 'Admin user already exists.' },
      },
    },
    get: {
      summary: 'List admin users',
      tags: ['Admin Users'],
      parameters: [
        { in: 'query', name: 'role', schema: { type: 'string' } },
        { in: 'query', name: 'status', schema: { type: 'string' } },
        { in: 'query', name: 'cityId', schema: { type: 'string' } },
        { in: 'query', name: 'search', schema: { type: 'string' } },
        { in: 'query', name: 'page', schema: { type: 'integer' } },
        { in: 'query', name: 'limit', schema: { type: 'integer' } },
      ],
      responses: {
        200: {
          content: {
            'application/json': {
              schema: {
                properties: {
                  data: {
                    properties: {
                      items: { items: adminUserSchema, type: 'array' },
                      page: { type: 'integer' },
                      limit: { type: 'integer' },
                      total: { type: 'integer' },
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
          description: 'Admin users fetched successfully.',
        },
      },
    },
  },
  '/admin/users/{adminUserId}': {
    get: {
      summary: 'Get admin user',
      tags: ['Admin Users'],
      parameters: [adminUserIdParam],
      responses: {
        200: adminUserResponse('Admin user fetched successfully.'),
        404: { content: { 'application/json': { schema: ApiErrorResponseSchema } }, description: 'Admin user not found.' },
      },
    },
    patch: {
      summary: 'Update admin user',
      tags: ['Admin Users'],
      parameters: [adminUserIdParam],
      responses: {
        200: adminUserResponse('Admin user updated successfully.'),
      },
    },
  },
  '/admin/users/{adminUserId}/status': {
    patch: {
      summary: 'Update admin user status',
      tags: ['Admin Users'],
      parameters: [adminUserIdParam],
      responses: { 200: adminUserResponse('Admin user status updated successfully.') },
    },
  },
  '/admin/users/{adminUserId}/roles': {
    patch: {
      summary: 'Update admin user role',
      tags: ['Admin Users'],
      parameters: [adminUserIdParam],
      responses: { 200: adminUserResponse('Admin user role updated successfully.') },
    },
  },
  '/admin/users/{adminUserId}/permissions': {
    patch: {
      summary: 'Update admin user permissions',
      tags: ['Admin Users'],
      parameters: [adminUserIdParam],
      responses: { 200: adminUserResponse('Admin user permissions updated successfully.') },
    },
  },
  '/admin/users/{adminUserId}/audit': {
    get: {
      summary: 'List admin user audit',
      tags: ['Admin Users'],
      parameters: [adminUserIdParam],
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
          description: 'Admin user audit fetched successfully.',
        },
      },
    },
  },
};
