import {
  PLATFORM_SETTING_CATEGORIES,
  PLATFORM_SETTING_SCOPE_TYPES,
  PLATFORM_SETTING_VALUE_TYPES,
} from '../../modules/platform-settings/constants/platform-settings.constants';
import { ApiErrorResponseSchema } from './common.schemas';

const settingKeyParam = {
  name: 'settingKey',
  in: 'path',
  required: true,
  schema: { type: 'string' },
};

const platformSettingSchema = {
  type: 'object',
  properties: {
    id: { type: 'string' },
    key: { type: 'string' },
    category: { type: 'string', enum: PLATFORM_SETTING_CATEGORIES },
    value: {},
    valueType: { type: 'string', enum: PLATFORM_SETTING_VALUE_TYPES },
    scopeType: { type: 'string', enum: PLATFORM_SETTING_SCOPE_TYPES },
    scopeId: { type: 'string', nullable: true },
    description: { type: 'string' },
    isSensitive: { type: 'boolean' },
    isEditable: { type: 'boolean' },
    updatedBy: { type: 'string', nullable: true },
    createdAt: { type: 'string', format: 'date-time' },
    updatedAt: { type: 'string', format: 'date-time' },
  },
};

export const platformSettingsPaths = {
  '/admin/settings': {
    get: {
      tags: ['Platform Settings'],
      summary: 'List platform settings',
      parameters: ['category', 'scopeType', 'scopeId', 'search', 'page', 'limit']
        .map((name) => ({ name, in: 'query', schema: { type: 'string' } })),
      responses: {
        200: {
          description: 'Platform settings fetched successfully.',
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
                      items: { type: 'array', items: platformSettingSchema },
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
  '/admin/settings/{settingKey}': {
    get: {
      tags: ['Platform Settings'],
      summary: 'Get platform setting',
      parameters: [settingKeyParam],
      responses: {
        200: {
          description: 'Platform setting fetched successfully.',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean' },
                  message: { type: 'string' },
                  data: platformSettingSchema,
                },
              },
            },
          },
        },
        404: {
          description: 'Platform setting not found.',
          content: { 'application/json': { schema: ApiErrorResponseSchema } },
        },
      },
    },
    patch: {
      tags: ['Platform Settings'],
      summary: 'Update platform setting',
      parameters: [settingKeyParam],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['value', 'reason'],
              properties: {
                value: {},
                reason: { type: 'string', minLength: 5, maxLength: 500 },
              },
            },
          },
        },
      },
      responses: {
        200: {
          description: 'Platform setting updated successfully.',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean' },
                  message: { type: 'string' },
                  data: platformSettingSchema,
                },
              },
            },
          },
        },
        404: {
          description: 'Platform setting not found.',
          content: { 'application/json': { schema: ApiErrorResponseSchema } },
        },
      },
    },
  },
  '/admin/settings/{settingKey}/audit': {
    get: {
      tags: ['Platform Settings'],
      summary: 'List platform setting audit entries',
      parameters: [settingKeyParam],
      responses: {
        200: {
          description: 'Platform setting audit fetched successfully.',
          content: { 'application/json': { schema: { type: 'object' } } },
        },
        404: {
          description: 'Platform setting not found.',
          content: { 'application/json': { schema: ApiErrorResponseSchema } },
        },
      },
    },
  },
};
