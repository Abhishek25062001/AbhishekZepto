import { ApiErrorResponseSchema } from './common.schemas';

const auditLogIdParam = {
  name: 'auditLogId',
  in: 'path',
  required: true,
  schema: { type: 'string' },
};

const auditLogSchema = {
  type: 'object',
  properties: {
    id: { type: 'string' },
    adminId: { type: 'string' },
    actionType: { type: 'string' },
    entityType: { type: 'string' },
    entityId: { type: 'string' },
    beforeState: { type: 'object' },
    afterState: { type: 'object' },
    reason: { type: 'string' },
    ipAddress: { type: 'string', nullable: true },
    deviceInfo: { type: 'string', nullable: true },
    createdAt: { type: 'string', format: 'date-time' },
    updatedAt: { type: 'string', format: 'date-time' },
  },
};

const listQueryParameters = [
  'adminId',
  'actionType',
  'entityType',
  'entityId',
  'from',
  'to',
  'page',
  'limit',
].map((name) => ({ name, in: 'query', schema: { type: 'string' } }));

export const auditLogSystemPaths = {
  '/admin/audit-logs': {
    get: {
      tags: ['Audit Logs'],
      summary: 'List admin action audit logs',
      parameters: listQueryParameters,
      responses: {
        200: {
          description: 'Audit logs fetched successfully.',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean' },
                  message: { type: 'string' },
                  data: {
                    type: 'object',
                    properties: {
                      items: { type: 'array', items: auditLogSchema },
                      page: { type: 'number' },
                      limit: { type: 'number' },
                      total: { type: 'number' },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
  '/admin/audit-logs/{auditLogId}': {
    get: {
      tags: ['Audit Logs'],
      summary: 'Get admin action audit log',
      parameters: [auditLogIdParam],
      responses: {
        200: {
          description: 'Audit log fetched successfully.',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean' },
                  message: { type: 'string' },
                  data: auditLogSchema,
                },
              },
            },
          },
        },
        404: {
          description: 'Audit log not found.',
          content: { 'application/json': { schema: ApiErrorResponseSchema } },
        },
      },
    },
  },
};
