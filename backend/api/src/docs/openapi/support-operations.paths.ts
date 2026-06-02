import {
  SUPPORT_TICKET_CATEGORIES,
  SUPPORT_TICKET_PRIORITIES,
  SUPPORT_TICKET_STATUSES,
} from '../../modules/support-operations/constants/support-ticket.constants';
import { ApiErrorResponseSchema } from './common.schemas';

const ticketIdParam = {
  name: 'ticketId',
  in: 'path',
  required: true,
  schema: { type: 'string' },
};

const supportTicketSchema = {
  type: 'object',
  properties: {
    ticketId: { type: 'string' },
    ticketNumber: { type: 'string' },
    customerId: { type: 'string', nullable: true },
    orderId: { type: 'string', nullable: true },
    subject: { type: 'string' },
    description: { type: 'string' },
    category: { type: 'string', enum: SUPPORT_TICKET_CATEGORIES },
    priority: { type: 'string', enum: SUPPORT_TICKET_PRIORITIES },
    status: { type: 'string', enum: SUPPORT_TICKET_STATUSES },
    source: { type: 'string' },
    assignedAdminId: { type: 'string', nullable: true },
    createdByAdminId: { type: 'string', nullable: true },
    lastActivityAt: { type: 'string', format: 'date-time', nullable: true },
    resolvedAt: { type: 'string', format: 'date-time', nullable: true },
    closedAt: { type: 'string', format: 'date-time', nullable: true },
    resolutionSummary: { type: 'string', nullable: true },
    tags: { type: 'array', items: { type: 'string' } },
    createdAt: { type: 'string', format: 'date-time' },
    updatedAt: { type: 'string', format: 'date-time' },
  },
};

const supportTicketNoteSchema = {
  type: 'object',
  properties: {
    noteId: { type: 'string' },
    ticketId: { type: 'string' },
    authorAdminId: { type: 'string', nullable: true },
    noteType: { type: 'string' },
    body: { type: 'string' },
    isInternal: { type: 'boolean' },
    createdAt: { type: 'string', format: 'date-time' },
    updatedAt: { type: 'string', format: 'date-time' },
  },
};

const ticketResponse = (description: string) => ({
  description,
  content: {
    'application/json': {
      schema: {
        type: 'object',
        properties: {
          success: { type: 'boolean' },
          message: { type: 'string' },
          data: supportTicketSchema,
        },
      },
    },
  },
});

export const supportOperationsPaths = {
  '/admin/support/tickets': {
    post: {
      tags: ['Support Operations'],
      summary: 'Create support ticket',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['subject', 'description', 'category'],
              properties: {
                customerId: { type: 'string', nullable: true },
                orderId: { type: 'string', nullable: true },
                subject: { type: 'string', minLength: 3, maxLength: 160 },
                description: { type: 'string', minLength: 5, maxLength: 5000 },
                category: { type: 'string', enum: SUPPORT_TICKET_CATEGORIES },
                priority: { type: 'string', enum: SUPPORT_TICKET_PRIORITIES, default: 'medium' },
                assignedAdminId: { type: 'string', nullable: true },
                tags: { type: 'array', items: { type: 'string' }, maxItems: 20 },
              },
            },
          },
        },
      },
      responses: {
        201: ticketResponse('Support ticket created successfully.'),
      },
    },
    get: {
      tags: ['Support Operations'],
      summary: 'List support tickets',
      parameters: ['status', 'priority', 'category', 'customerId', 'orderId', 'assignedAdminId', 'search', 'page', 'limit']
        .map((name) => ({ name, in: 'query', schema: { type: 'string' } })),
      responses: {
        200: {
          description: 'Support tickets fetched successfully.',
          content: { 'application/json': { schema: { type: 'object' } } },
        },
      },
    },
  },
  '/admin/support/tickets/{ticketId}': {
    get: {
      tags: ['Support Operations'],
      summary: 'Get support ticket',
      parameters: [ticketIdParam],
      responses: {
        200: ticketResponse('Support ticket fetched successfully.'),
        404: {
          description: 'Support ticket not found.',
          content: { 'application/json': { schema: ApiErrorResponseSchema } },
        },
      },
    },
  },
  '/admin/support/tickets/{ticketId}/status': {
    patch: {
      tags: ['Support Operations'],
      summary: 'Update support ticket status',
      parameters: [ticketIdParam],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['status', 'reason'],
              properties: {
                status: { type: 'string', enum: SUPPORT_TICKET_STATUSES },
                resolutionSummary: { type: 'string', nullable: true, maxLength: 2000 },
                reason: { type: 'string', minLength: 5, maxLength: 500 },
              },
            },
          },
        },
      },
      responses: {
        200: ticketResponse('Support ticket status updated successfully.'),
        404: {
          description: 'Support ticket not found.',
          content: { 'application/json': { schema: ApiErrorResponseSchema } },
        },
      },
    },
  },
  '/admin/support/tickets/{ticketId}/priority': {
    patch: {
      tags: ['Support Operations'],
      summary: 'Update support ticket priority',
      parameters: [ticketIdParam],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['priority', 'reason'],
              properties: {
                priority: { type: 'string', enum: SUPPORT_TICKET_PRIORITIES },
                reason: { type: 'string', minLength: 5, maxLength: 500 },
              },
            },
          },
        },
      },
      responses: {
        200: ticketResponse('Support ticket priority updated successfully.'),
        404: {
          description: 'Support ticket not found.',
          content: { 'application/json': { schema: ApiErrorResponseSchema } },
        },
      },
    },
  },
  '/admin/support/tickets/{ticketId}/assignment': {
    patch: {
      tags: ['Support Operations'],
      summary: 'Assign or unassign support ticket',
      parameters: [ticketIdParam],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['assignedAdminId', 'reason'],
              properties: {
                assignedAdminId: { type: 'string', nullable: true },
                reason: { type: 'string', minLength: 5, maxLength: 500 },
              },
            },
          },
        },
      },
      responses: {
        200: ticketResponse('Support ticket assignment updated successfully.'),
        404: {
          description: 'Support ticket not found.',
          content: { 'application/json': { schema: ApiErrorResponseSchema } },
        },
      },
    },
  },
  '/admin/support/tickets/{ticketId}/notes': {
    get: {
      tags: ['Support Operations'],
      summary: 'List support ticket notes',
      parameters: [ticketIdParam],
      responses: {
        200: {
          description: 'Support ticket notes fetched successfully.',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean' },
                  message: { type: 'string' },
                  data: { type: 'array', items: supportTicketNoteSchema },
                },
              },
            },
          },
        },
      },
    },
    post: {
      tags: ['Support Operations'],
      summary: 'Create support ticket note',
      parameters: [ticketIdParam],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['body'],
              properties: {
                body: { type: 'string', minLength: 2, maxLength: 5000 },
                isInternal: { type: 'boolean', default: true },
              },
            },
          },
        },
      },
      responses: {
        201: {
          description: 'Support ticket note created successfully.',
          content: { 'application/json': { schema: { type: 'object' } } },
        },
        404: {
          description: 'Support ticket not found.',
          content: { 'application/json': { schema: ApiErrorResponseSchema } },
        },
      },
    },
  },
  '/admin/support/tickets/{ticketId}/audit': {
    get: {
      tags: ['Support Operations'],
      summary: 'List support ticket audit',
      parameters: [ticketIdParam],
      responses: {
        200: {
          description: 'Support ticket audit fetched successfully.',
          content: { 'application/json': { schema: { type: 'object' } } },
        },
        404: {
          description: 'Support ticket not found.',
          content: { 'application/json': { schema: ApiErrorResponseSchema } },
        },
      },
    },
  },
};
