const analyticsQueryParameters = [
  'fromDate',
  'toDate',
  'timezone',
  'storeId',
  'vendorId',
  'cityId',
].map((name) => ({ name, in: 'query', required: false, schema: { type: 'string' } }));

const countBreakdownSchema = {
  type: 'object',
  additionalProperties: { type: 'number' },
};

const analyticsWindowSchema = {
  type: 'object',
  properties: {
    fromDate: { type: 'string', format: 'date-time', nullable: true },
    toDate: { type: 'string', format: 'date-time', nullable: true },
    timezone: { type: 'string' },
  },
};

const statusMetricSchema = {
  type: 'object',
  properties: {
    total: { type: 'number' },
    byStatus: countBreakdownSchema,
  },
};

const supportMetricSchema = {
  type: 'object',
  properties: {
    total: { type: 'number' },
    byStatus: countBreakdownSchema,
    byPriority: countBreakdownSchema,
    byCategory: countBreakdownSchema,
  },
};

const analyticsResponse = (dataProperties: Record<string, unknown>) => ({
  200: {
    description: 'Operational analytics fetched successfully.',
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
                window: analyticsWindowSchema,
                ...dataProperties,
              },
            },
          },
        },
      },
    },
  },
});

export const operationalAnalyticsPaths = {
  '/admin/analytics/overview': {
    get: {
      tags: ['Operational Analytics'],
      summary: 'Get operational analytics overview',
      parameters: analyticsQueryParameters,
      responses: analyticsResponse({
        orders: statusMetricSchema,
        delivery: statusMetricSchema,
        stores: statusMetricSchema,
        support: supportMetricSchema,
      }),
    },
  },
  '/admin/analytics/orders': {
    get: {
      tags: ['Operational Analytics'],
      summary: 'Get order analytics',
      parameters: analyticsQueryParameters,
      responses: analyticsResponse({
        orders: statusMetricSchema,
      }),
    },
  },
  '/admin/analytics/delivery': {
    get: {
      tags: ['Operational Analytics'],
      summary: 'Get delivery analytics',
      parameters: analyticsQueryParameters,
      responses: analyticsResponse({
        delivery: statusMetricSchema,
      }),
    },
  },
  '/admin/analytics/stores': {
    get: {
      tags: ['Operational Analytics'],
      summary: 'Get store analytics',
      parameters: analyticsQueryParameters,
      responses: analyticsResponse({
        stores: statusMetricSchema,
      }),
    },
  },
  '/admin/analytics/support': {
    get: {
      tags: ['Operational Analytics'],
      summary: 'Get support analytics',
      parameters: analyticsQueryParameters,
      responses: analyticsResponse({
        support: supportMetricSchema,
      }),
    },
  },
};
