import { ApiErrorResponseSchema } from './common.schemas';
import { CUSTOMER_MANAGEMENT_ACCOUNT_STATUSES } from '../../modules/customer-management/constants/customer-management.constants';
import { ORDER_STATUS_VALUES } from '../../modules/orders/constants/order-status.constant';

const customerSchema = {
  type: 'object',
  properties: {
    customerId: { type: 'string' },
    userId: { type: 'string' },
    name: { type: 'string', nullable: true },
    phone: { type: 'string' },
    email: { type: 'string', nullable: true },
    accountStatus: { type: 'string' },
    cityId: { type: 'string', nullable: true },
    riskStatus: { type: 'string' },
    adminNotes: { type: 'string', nullable: true },
    blockedAt: { type: 'string', nullable: true },
    blockedBy: { type: 'string', nullable: true },
    blockReason: { type: 'string', nullable: true },
    lastLoginAt: { type: 'string', nullable: true },
    createdAt: { type: 'string', format: 'date-time' },
    updatedAt: { type: 'string', format: 'date-time' },
  },
};

const customerResponse = (description: string) => ({
  description,
  content: {
    'application/json': {
      schema: {
        type: 'object',
        properties: {
          success: { type: 'boolean' },
          message: { type: 'string' },
          data: customerSchema,
        },
      },
    },
  },
});

const customerIdParam = {
  name: 'customerId',
  in: 'path',
  required: true,
  schema: { type: 'string' },
};

const paginatedResponse = (description: string) => ({
  description,
  content: { 'application/json': { schema: { type: 'object' } } },
});

export const customerManagementPaths = {
  '/admin/customers': {
    get: {
      tags: ['Customer Management'],
      summary: 'List customers',
      parameters: ['status', 'cityId', 'search', 'createdFrom', 'createdTo', 'page', 'limit']
        .map((name) => ({ name, in: 'query', schema: { type: 'string' } })),
      responses: {
        200: {
          description: 'Customers fetched successfully.',
          content: { 'application/json': { schema: { type: 'object' } } },
        },
      },
    },
  },
  '/admin/customers/{customerId}': {
    get: {
      tags: ['Customer Management'],
      summary: 'Get customer',
      parameters: [customerIdParam],
      responses: {
        200: customerResponse('Customer fetched successfully.'),
        404: { description: 'Customer not found.', content: { 'application/json': { schema: ApiErrorResponseSchema } } },
      },
    },
  },
  '/admin/customers/{customerId}/status': {
    patch: {
      tags: ['Customer Management'],
      summary: 'Update customer status',
      parameters: [customerIdParam],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['status', 'reason'],
              properties: {
                status: { type: 'string', enum: CUSTOMER_MANAGEMENT_ACCOUNT_STATUSES },
                reason: { type: 'string', minLength: 5, maxLength: 500 },
              },
            },
          },
        },
      },
      responses: { 200: customerResponse('Customer status updated successfully.') },
    },
  },
  '/admin/customers/{customerId}/notes': {
    patch: {
      tags: ['Customer Management'],
      summary: 'Update customer notes',
      parameters: [customerIdParam],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['adminNotes'],
              properties: {
                adminNotes: { type: 'string', nullable: true, maxLength: 2000 },
              },
            },
          },
        },
      },
      responses: { 200: customerResponse('Customer notes updated successfully.') },
    },
  },
  '/admin/customers/{customerId}/orders': {
    get: {
      tags: ['Customer Management'],
      summary: 'List customer orders',
      parameters: [
        customerIdParam,
        { name: 'status', in: 'query', schema: { type: 'string', enum: ORDER_STATUS_VALUES } },
        { name: 'fromDate', in: 'query', schema: { type: 'string', format: 'date-time' } },
        { name: 'toDate', in: 'query', schema: { type: 'string', format: 'date-time' } },
        { name: 'page', in: 'query', schema: { type: 'integer', minimum: 1, default: 1 } },
        { name: 'limit', in: 'query', schema: { type: 'integer', minimum: 1, maximum: 100, default: 20 } },
      ],
      responses: { 200: paginatedResponse('Customer orders fetched successfully.') },
    },
  },
  '/admin/customers/{customerId}/addresses': {
    get: {
      tags: ['Customer Management'],
      summary: 'List customer addresses',
      parameters: [customerIdParam],
      responses: {
        200: {
          description: 'Customer addresses fetched successfully.',
          content: { 'application/json': { schema: { type: 'object' } } },
        },
      },
    },
  },
  '/admin/customers/{customerId}/audit': {
    get: {
      tags: ['Customer Management'],
      summary: 'List customer audit',
      parameters: [customerIdParam],
      responses: { 200: { description: 'Customer audit fetched successfully.' } },
    },
  },
};
