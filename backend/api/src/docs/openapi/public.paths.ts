import {
  HealthResponseSchema,
  SystemInfoResponseSchema,
  VersionResponseSchema,
} from './common.schemas';

export const publicPaths = {
  '/public/health': {
    get: {
      responses: {
        200: {
          content: {
            'application/json': {
              schema: HealthResponseSchema,
            },
          },
          description: 'Backend health response.',
        },
      },
      summary: 'Check backend health',
      tags: ['Public'],
    },
  },
  '/public/system-info': {
    get: {
      responses: {
        200: {
          content: {
            'application/json': {
              schema: SystemInfoResponseSchema,
            },
          },
          description: 'System runtime information response.',
        },
      },
      summary: 'Fetch system information',
      tags: ['Public'],
    },
  },
  '/public/version': {
    get: {
      responses: {
        200: {
          content: {
            'application/json': {
              schema: VersionResponseSchema,
            },
          },
          description: 'Backend version response.',
        },
      },
      summary: 'Fetch backend version',
      tags: ['Public'],
    },
  },
};
