import {
  ADMIN_DATA_EXPORT_FORMATS,
  ADMIN_DATA_EXPORT_STATUSES,
  ADMIN_DATA_EXPORT_TYPES,
} from '../../modules/admin-data-exports/constants/admin-data-export.constants';
import { ApiErrorResponseSchema } from './common.schemas';

const dataExportIdParam = {
  name: 'exportId',
  in: 'path',
  required: true,
  schema: { type: 'string' },
};

const dataExportSchema = {
  type: 'object',
  properties: {
    id: { type: 'string' },
    exportType: { type: 'string', enum: ADMIN_DATA_EXPORT_TYPES },
    format: { type: 'string', enum: ADMIN_DATA_EXPORT_FORMATS },
    status: { type: 'string', enum: ADMIN_DATA_EXPORT_STATUSES },
    filters: { type: 'object', additionalProperties: true },
    requestedByAdminId: { type: 'string' },
    requestedAt: { type: 'string', format: 'date-time' },
    completedAt: { type: 'string', format: 'date-time', nullable: true },
    failedAt: { type: 'string', format: 'date-time', nullable: true },
    failureReason: { type: 'string', nullable: true },
    fileKey: { type: 'string', nullable: true },
    fileName: { type: 'string', nullable: true },
    downloadUrl: { type: 'string', nullable: true },
    expiresAt: { type: 'string', format: 'date-time', nullable: true },
    createdAt: { type: 'string', format: 'date-time' },
    updatedAt: { type: 'string', format: 'date-time' },
  },
};

const listQueryParameters = [
  { name: 'exportType', schema: { type: 'string', enum: ADMIN_DATA_EXPORT_TYPES } },
  { name: 'format', schema: { type: 'string', enum: ADMIN_DATA_EXPORT_FORMATS } },
  { name: 'status', schema: { type: 'string', enum: ADMIN_DATA_EXPORT_STATUSES } },
  { name: 'requestedByAdminId', schema: { type: 'string' } },
  { name: 'fromDate', schema: { type: 'string', format: 'date-time' } },
  { name: 'toDate', schema: { type: 'string', format: 'date-time' } },
  { name: 'page', schema: { type: 'integer', minimum: 1, default: 1 } },
  { name: 'limit', schema: { type: 'integer', minimum: 1, maximum: 100, default: 20 } },
].map((parameter) => ({ ...parameter, in: 'query' }));

export const adminDataExportPaths = {
  '/admin/data-exports': {
    post: {
      tags: ['Admin Data Exports'],
      summary: 'Queue admin data export metadata',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['exportType', 'format', 'reason'],
              properties: {
                exportType: { type: 'string', enum: ADMIN_DATA_EXPORT_TYPES },
                format: { type: 'string', enum: ADMIN_DATA_EXPORT_FORMATS },
                filters: { type: 'object', additionalProperties: true, default: {} },
                reason: { type: 'string', minLength: 5, maxLength: 500 },
              },
            },
          },
        },
      },
      responses: {
        201: {
          description: 'Admin data export queued successfully.',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean' },
                  message: { type: 'string' },
                  data: dataExportSchema,
                },
              },
            },
          },
        },
        400: {
          description: 'Invalid admin data export request.',
          content: { 'application/json': { schema: ApiErrorResponseSchema } },
        },
      },
    },
    get: {
      tags: ['Admin Data Exports'],
      summary: 'List admin data exports',
      parameters: listQueryParameters,
      responses: {
        200: {
          description: 'Admin data exports fetched successfully.',
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
                      items: { type: 'array', items: dataExportSchema },
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
  '/admin/data-exports/{exportId}': {
    get: {
      tags: ['Admin Data Exports'],
      summary: 'Get admin data export',
      parameters: [dataExportIdParam],
      responses: {
        200: {
          description: 'Admin data export fetched successfully.',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean' },
                  message: { type: 'string' },
                  data: dataExportSchema,
                },
              },
            },
          },
        },
        404: {
          description: 'Admin data export not found.',
          content: { 'application/json': { schema: ApiErrorResponseSchema } },
        },
      },
    },
  },
};
