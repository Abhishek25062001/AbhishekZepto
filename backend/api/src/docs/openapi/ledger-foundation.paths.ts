import { ApiErrorResponseSchema, ApiSuccessResponseSchema } from './common.schemas';

const ledgerResponses = {
  200: {
    content: { 'application/json': { schema: ApiSuccessResponseSchema } },
    description: 'Ledger operation success response.',
  },
  201: {
    content: { 'application/json': { schema: ApiSuccessResponseSchema } },
    description: 'Ledger resource created response.',
  },
  400: {
    content: { 'application/json': { schema: ApiErrorResponseSchema } },
    description: 'Invalid ledger request response.',
  },
  401: {
    content: { 'application/json': { schema: ApiErrorResponseSchema } },
    description: 'Authentication failure response.',
  },
  403: {
    content: { 'application/json': { schema: ApiErrorResponseSchema } },
    description: 'Authorization failure response.',
  },
  404: {
    content: { 'application/json': { schema: ApiErrorResponseSchema } },
    description: 'Ledger resource not found response.',
  },
  409: {
    content: { 'application/json': { schema: ApiErrorResponseSchema } },
    description: 'Ledger conflict response.',
  },
};

export const ledgerFoundationPaths = {
  '/admin/finance/ledger/accounts': {
    get: {
      responses: ledgerResponses,
      summary: 'List ledger accounts',
      tags: ['Admin Finance Ledger'],
    },
    post: {
      requestBody: {
        content: {
          'application/json': {
            schema: {
              properties: {
                accountCode: { type: 'string' },
                accountName: { type: 'string' },
                accountType: { type: 'string' },
                accountCategory: { type: 'string' },
                currency: { type: 'string' },
                description: { type: 'string', nullable: true },
                isPostingAllowed: { type: 'boolean' },
                parentAccountId: { type: 'string', nullable: true },
              },
              required: ['accountCode', 'accountName', 'accountType', 'accountCategory'],
              type: 'object',
            },
          },
        },
        required: true,
      },
      responses: ledgerResponses,
      summary: 'Create ledger account',
      tags: ['Admin Finance Ledger'],
    },
  },
  '/admin/finance/ledger/accounts/{accountId}': {
    get: {
      parameters: [{ in: 'path', name: 'accountId', required: true, schema: { type: 'string' } }],
      responses: ledgerResponses,
      summary: 'Get ledger account by id',
      tags: ['Admin Finance Ledger'],
    },
    patch: {
      parameters: [{ in: 'path', name: 'accountId', required: true, schema: { type: 'string' } }],
      requestBody: {
        content: {
          'application/json': {
            schema: {
              properties: {
                accountName: { type: 'string' },
                description: { type: 'string', nullable: true },
                status: { type: 'string' },
                isPostingAllowed: { type: 'boolean' },
                parentAccountId: { type: 'string', nullable: true },
              },
              type: 'object',
            },
          },
        },
        required: true,
      },
      responses: ledgerResponses,
      summary: 'Update ledger account',
      tags: ['Admin Finance Ledger'],
    },
    delete: {
      parameters: [{ in: 'path', name: 'accountId', required: true, schema: { type: 'string' } }],
      responses: ledgerResponses,
      summary: 'Archive ledger account',
      tags: ['Admin Finance Ledger'],
    },
  },
  '/admin/finance/ledger/accounts/{accountId}/lines': {
    get: {
      parameters: [{ in: 'path', name: 'accountId', required: true, schema: { type: 'string' } }],
      responses: ledgerResponses,
      summary: 'List ledger lines for account',
      tags: ['Admin Finance Ledger'],
    },
  },
  '/admin/finance/ledger/journals': {
    get: {
      responses: ledgerResponses,
      summary: 'List ledger journals',
      tags: ['Admin Finance Ledger'],
    },
  },
  '/admin/finance/ledger/journals/{journalId}': {
    get: {
      parameters: [{ in: 'path', name: 'journalId', required: true, schema: { type: 'string' } }],
      responses: ledgerResponses,
      summary: 'Get ledger journal by id',
      tags: ['Admin Finance Ledger'],
    },
  },
  '/admin/finance/ledger/journals/{journalId}/reverse': {
    post: {
      parameters: [{ in: 'path', name: 'journalId', required: true, schema: { type: 'string' } }],
      requestBody: {
        content: {
          'application/json': {
            schema: {
              properties: {
                reason: { type: 'string' },
              },
              required: ['reason'],
              type: 'object',
            },
          },
        },
        required: true,
      },
      responses: ledgerResponses,
      summary: 'Reverse posted ledger journal',
      tags: ['Admin Finance Ledger'],
    },
  },
};
