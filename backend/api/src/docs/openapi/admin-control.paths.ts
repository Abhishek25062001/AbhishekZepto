import { ApiErrorResponseSchema } from './common.schemas';

const adminControlSessionSchema = {
  properties: {
    sessionId: { type: 'string' },
    adminId: { type: 'string' },
    sessionType: { enum: ['monitoring', 'incident', 'override'], type: 'string' },
    cityScope: { items: { type: 'string' }, type: 'array' },
    startedAt: { format: 'date-time', type: 'string' },
    endedAt: { nullable: true, type: 'string' },
    activeModules: {
      items: {
        enum: [
          'live_overview',
          'live_orders',
          'live_agents',
          'live_stores',
          'escalations',
          'overrides',
        ],
        type: 'string',
      },
      type: 'array',
    },
    lastHeartbeatAt: { format: 'date-time', type: 'string' },
  },
  type: 'object',
};

const sessionIdRequestSchema = {
  properties: {
    sessionId: { type: 'string' },
  },
  required: ['sessionId'],
  type: 'object',
};

const reasonRequestSchema = {
  properties: {
    reason: { type: 'string' },
  },
  required: ['reason'],
  type: 'object',
};

const operationResponseSchema = {
  properties: {
    actionType: { type: 'string' },
    entityId: { type: 'string' },
    entityType: { type: 'string' },
    reason: { type: 'string' },
    status: { type: 'string' },
    updatedAt: { format: 'date-time', type: 'string' },
  },
  type: 'object',
};

const successOperationResponse = (description: string) => ({
  content: {
    'application/json': {
      schema: {
        properties: {
          data: operationResponseSchema,
          message: { type: 'string' },
          success: { type: 'boolean' },
        },
        type: 'object',
      },
    },
  },
  description,
});

export const adminControlPaths = {
  '/admin/control/session/start': {
    post: {
      description: 'Start an Admin Control operational session.',
      requestBody: {
        content: {
          'application/json': {
            schema: {
              properties: {
                sessionType: {
                  enum: ['monitoring', 'incident', 'override'],
                  type: 'string',
                },
                cityScope: { items: { type: 'string' }, type: 'array' },
                activeModules: {
                  items: { type: 'string' },
                  type: 'array',
                },
              },
              required: ['sessionType', 'cityScope', 'activeModules'],
              type: 'object',
            },
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
                  data: adminControlSessionSchema,
                  message: { type: 'string' },
                  success: { type: 'boolean' },
                },
                type: 'object',
              },
            },
          },
          description: 'Admin control session started successfully.',
        },
        401: {
          content: { 'application/json': { schema: ApiErrorResponseSchema } },
          description: 'Authentication failure response.',
        },
      },
      summary: 'Start admin control session',
      tags: ['Admin Control'],
    },
  },
  '/admin/control/session/end': {
    post: {
      description: 'End an active Admin Control operational session.',
      requestBody: {
        content: { 'application/json': { schema: sessionIdRequestSchema } },
        required: true,
      },
      responses: {
        200: {
          content: {
            'application/json': {
              schema: {
                properties: {
                  data: adminControlSessionSchema,
                  message: { type: 'string' },
                  success: { type: 'boolean' },
                },
                type: 'object',
              },
            },
          },
          description: 'Admin control session ended successfully.',
        },
        404: {
          content: { 'application/json': { schema: ApiErrorResponseSchema } },
          description: 'Session not found.',
        },
      },
      summary: 'End admin control session',
      tags: ['Admin Control'],
    },
  },
  '/admin/control/session/heartbeat': {
    post: {
      description: 'Update the heartbeat timestamp for an active Admin Control session.',
      requestBody: {
        content: { 'application/json': { schema: sessionIdRequestSchema } },
        required: true,
      },
      responses: {
        200: {
          content: {
            'application/json': {
              schema: {
                properties: {
                  data: adminControlSessionSchema,
                  message: { type: 'string' },
                  success: { type: 'boolean' },
                },
                type: 'object',
              },
            },
          },
          description: 'Admin control session heartbeat updated successfully.',
        },
        409: {
          content: { 'application/json': { schema: ApiErrorResponseSchema } },
          description: 'Session already ended or expired.',
        },
      },
      summary: 'Heartbeat admin control session',
      tags: ['Admin Control'],
    },
  },
  '/admin/control/sessions/active': {
    get: {
      description: 'List currently active Admin Control operational sessions.',
      responses: {
        200: {
          content: {
            'application/json': {
              schema: {
                properties: {
                  data: { items: adminControlSessionSchema, type: 'array' },
                  message: { type: 'string' },
                  success: { type: 'boolean' },
                },
                type: 'object',
              },
            },
          },
          description: 'Active admin control sessions fetched successfully.',
        },
        401: {
          content: { 'application/json': { schema: ApiErrorResponseSchema } },
          description: 'Authentication failure response.',
        },
      },
      summary: 'List active admin control sessions',
      tags: ['Admin Control'],
    },
  },
  '/admin/control/live-overview': {
    get: {
      description: 'Return active orders, late orders, active agents, offline agents, force-closed stores, and SLA breaches.',
      parameters: [
        { in: 'query', name: 'cityId', required: false, schema: { type: 'string' } },
      ],
      responses: {
        200: {
          content: {
            'application/json': {
              schema: {
                properties: {
                  data: {
                    properties: {
                      activeAgents: { type: 'number' },
                      activeOrders: { type: 'number' },
                      forceClosedStores: { type: 'number' },
                      lateOrders: { type: 'number' },
                      offlineAgents: { type: 'number' },
                      slaBreaches: { type: 'number' },
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
          description: 'Admin control live overview fetched successfully.',
        },
      },
      summary: 'Get admin control live overview',
      tags: ['Admin Control'],
    },
  },
  '/admin/control/live-orders': {
    get: {
      description: 'Return live operational order rows with city, status, SLA, and store filters.',
      parameters: [
        { in: 'query', name: 'cityId', required: false, schema: { type: 'string' } },
        { in: 'query', name: 'status', required: false, schema: { type: 'string' } },
        { in: 'query', name: 'slaRisk', required: false, schema: { type: 'string' } },
        { in: 'query', name: 'storeId', required: false, schema: { type: 'string' } },
      ],
      responses: {
        200: successOperationResponse('Admin control live orders fetched successfully.'),
      },
      summary: 'List admin control live orders',
      tags: ['Admin Control'],
    },
  },
  '/admin/control/live-agents': {
    get: {
      description: 'Return live delivery-agent operational rows.',
      parameters: [
        { in: 'query', name: 'cityId', required: false, schema: { type: 'string' } },
      ],
      responses: {
        200: successOperationResponse('Admin control live agents fetched successfully.'),
      },
      summary: 'List admin control live agents',
      tags: ['Admin Control'],
    },
  },
  '/admin/control/live-stores': {
    get: {
      description: 'Return live store operational rows with queue load and force-close status.',
      parameters: [
        { in: 'query', name: 'cityId', required: false, schema: { type: 'string' } },
      ],
      responses: {
        200: successOperationResponse('Admin control live stores fetched successfully.'),
      },
      summary: 'List admin control live stores',
      tags: ['Admin Control'],
    },
  },
  '/admin/control/escalations': {
    get: {
      description: 'Return active escalated delivery/SLA incidents.',
      parameters: [
        { in: 'query', name: 'cityId', required: false, schema: { type: 'string' } },
      ],
      responses: {
        200: successOperationResponse('Admin control escalations fetched successfully.'),
      },
      summary: 'List admin control escalations',
      tags: ['Admin Control'],
    },
  },
  '/admin/control/order/{orderId}/force-cancel': {
    post: {
      description: 'Force-cancel an order with reason capture.',
      parameters: [{ in: 'path', name: 'orderId', required: true, schema: { type: 'string' } }],
      requestBody: {
        content: { 'application/json': { schema: reasonRequestSchema } },
        required: true,
      },
      responses: {
        200: successOperationResponse('Order force-cancelled successfully.'),
        404: { content: { 'application/json': { schema: ApiErrorResponseSchema } }, description: 'Order not found.' },
      },
      summary: 'Force cancel order',
      tags: ['Admin Control'],
    },
  },
  '/admin/control/order/{orderId}/force-assign-agent': {
    post: {
      description: 'Force-assign an available delivery agent to an order.',
      parameters: [{ in: 'path', name: 'orderId', required: true, schema: { type: 'string' } }],
      requestBody: {
        content: {
          'application/json': {
            schema: {
              properties: {
                deliveryAgentId: { type: 'string' },
                reason: { type: 'string' },
              },
              required: ['deliveryAgentId', 'reason'],
              type: 'object',
            },
          },
        },
        required: true,
      },
      responses: {
        200: successOperationResponse('Delivery agent force-assigned successfully.'),
        409: { content: { 'application/json': { schema: ApiErrorResponseSchema } }, description: 'Agent unavailable.' },
      },
      summary: 'Force assign delivery agent',
      tags: ['Admin Control'],
    },
  },
  '/admin/control/order/{orderId}/unassign-agent': {
    post: {
      description: 'Unassign the active delivery agent from an order.',
      parameters: [{ in: 'path', name: 'orderId', required: true, schema: { type: 'string' } }],
      requestBody: {
        content: { 'application/json': { schema: reasonRequestSchema } },
        required: true,
      },
      responses: {
        200: successOperationResponse('Delivery agent unassigned successfully.'),
        404: { content: { 'application/json': { schema: ApiErrorResponseSchema } }, description: 'Assignment not found.' },
      },
      summary: 'Unassign delivery agent',
      tags: ['Admin Control'],
    },
  },
  '/admin/control/store/{storeId}/force-close': {
    post: {
      description: 'Force-close a store and disable incoming order acceptance.',
      parameters: [{ in: 'path', name: 'storeId', required: true, schema: { type: 'string' } }],
      requestBody: {
        content: { 'application/json': { schema: reasonRequestSchema } },
        required: true,
      },
      responses: {
        200: successOperationResponse('Store force-closed successfully.'),
        404: { content: { 'application/json': { schema: ApiErrorResponseSchema } }, description: 'Store not found.' },
      },
      summary: 'Force close store',
      tags: ['Admin Control'],
    },
  },
  '/admin/control/store/{storeId}/reopen': {
    post: {
      description: 'Reopen a force-closed store.',
      parameters: [{ in: 'path', name: 'storeId', required: true, schema: { type: 'string' } }],
      requestBody: {
        content: { 'application/json': { schema: reasonRequestSchema } },
        required: true,
      },
      responses: {
        200: successOperationResponse('Store reopened successfully.'),
        404: { content: { 'application/json': { schema: ApiErrorResponseSchema } }, description: 'Store not found.' },
      },
      summary: 'Reopen store',
      tags: ['Admin Control'],
    },
  },
  '/admin/control/agent/{agentId}/force-offline': {
    post: {
      description: 'Force a delivery agent offline.',
      parameters: [{ in: 'path', name: 'agentId', required: true, schema: { type: 'string' } }],
      requestBody: {
        content: { 'application/json': { schema: reasonRequestSchema } },
        required: true,
      },
      responses: {
        200: successOperationResponse('Delivery agent forced offline successfully.'),
        404: { content: { 'application/json': { schema: ApiErrorResponseSchema } }, description: 'Agent not found.' },
      },
      summary: 'Force delivery agent offline',
      tags: ['Admin Control'],
    },
  },
  '/admin/control/agent/{agentId}/restore-online': {
    post: {
      description: 'Restore delivery-agent online eligibility.',
      parameters: [{ in: 'path', name: 'agentId', required: true, schema: { type: 'string' } }],
      requestBody: {
        content: { 'application/json': { schema: reasonRequestSchema } },
        required: true,
      },
      responses: {
        200: successOperationResponse('Delivery agent restored online successfully.'),
        404: { content: { 'application/json': { schema: ApiErrorResponseSchema } }, description: 'Agent not found.' },
      },
      summary: 'Restore delivery agent online',
      tags: ['Admin Control'],
    },
  },
  '/admin/control/sla/{slaId}/escalate': {
    post: {
      description: 'Mark an SLA record as escalated.',
      parameters: [{ in: 'path', name: 'slaId', required: true, schema: { type: 'string' } }],
      requestBody: {
        content: {
          'application/json': {
            schema: {
              properties: {
                escalationLevel: { default: 1, maximum: 5, minimum: 1, type: 'number' },
                reason: { type: 'string' },
              },
              required: ['reason'],
              type: 'object',
            },
          },
        },
        required: true,
      },
      responses: {
        200: successOperationResponse('SLA escalated successfully.'),
        404: { content: { 'application/json': { schema: ApiErrorResponseSchema } }, description: 'SLA record not found.' },
      },
      summary: 'Escalate SLA',
      tags: ['Admin Control'],
    },
  },
};
