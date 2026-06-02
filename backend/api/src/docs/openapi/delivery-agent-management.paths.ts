import { ApiErrorResponseSchema } from './common.schemas';
import { AVAILABILITY_STATUS_VALUES } from '../../modules/delivery/constants/delivery-agent-status.constant';
import { DELIVERY_STATUS_VALUES } from '../../modules/delivery/constants/delivery-status.constant';
import {
  DELIVERY_AGENT_MANAGEMENT_STATUS_VALUES,
  DELIVERY_AGENT_MANAGEMENT_VERIFICATION_STATUS_VALUES,
} from '../../modules/delivery-agent-management/validators/admin-delivery-agent.validator';

const deliveryAgentSchema = {
  type: 'object',
  properties: {
    agentId: { type: 'string' },
    userId: { type: 'string' },
    name: { type: 'string' },
    phone: { type: 'string' },
    email: { type: 'string', nullable: true },
    profilePhotoUrl: { type: 'string', nullable: true },
    vehicleType: { type: 'string' },
    vehicleNumber: { type: 'string', nullable: true },
    availabilityStatus: { type: 'string' },
    forcedOfflineAt: { type: 'string', nullable: true },
    forcedOfflineReason: { type: 'string', nullable: true },
    forcedOfflineBy: { type: 'string', nullable: true },
    isVerified: { type: 'boolean' },
    isActive: { type: 'boolean' },
    cityId: { type: 'string', nullable: true },
    currentAssignmentId: { type: 'string', nullable: true },
    totalDeliveries: { type: 'number' },
    createdAt: { type: 'string', format: 'date-time' },
    updatedAt: { type: 'string', format: 'date-time' },
  },
};

const deliveryAgentIdParam = {
  name: 'deliveryAgentId',
  in: 'path',
  required: true,
  schema: { type: 'string' },
};

const paginatedObjectResponse = (description: string) => ({
  description,
  content: { 'application/json': { schema: { type: 'object' } } },
});

const deliveryAgentResponse = (description: string) => ({
  description,
  content: {
    'application/json': {
      schema: {
        type: 'object',
        properties: {
          success: { type: 'boolean' },
          message: { type: 'string' },
          data: deliveryAgentSchema,
        },
      },
    },
  },
});

export const deliveryAgentManagementPaths = {
  '/admin/delivery-agents': {
    get: {
      tags: ['Delivery Agent Management'],
      summary: 'List delivery agents',
      parameters: [
        { name: 'status', in: 'query', schema: { type: 'string', enum: DELIVERY_AGENT_MANAGEMENT_STATUS_VALUES } },
        { name: 'availabilityStatus', in: 'query', schema: { type: 'string', enum: AVAILABILITY_STATUS_VALUES } },
        { name: 'verificationStatus', in: 'query', schema: { type: 'string', enum: DELIVERY_AGENT_MANAGEMENT_VERIFICATION_STATUS_VALUES } },
        { name: 'cityId', in: 'query', schema: { type: 'string' } },
        { name: 'search', in: 'query', schema: { type: 'string', minLength: 1, maxLength: 120 } },
        { name: 'page', in: 'query', schema: { type: 'integer', minimum: 1, default: 1 } },
        { name: 'limit', in: 'query', schema: { type: 'integer', minimum: 1, maximum: 100, default: 20 } },
      ],
      responses: {
        200: {
          description: 'Delivery agents fetched successfully.',
          content: { 'application/json': { schema: { type: 'object' } } },
        },
      },
    },
  },
  '/admin/delivery-agents/{deliveryAgentId}': {
    get: {
      tags: ['Delivery Agent Management'],
      summary: 'Get delivery agent',
      parameters: [deliveryAgentIdParam],
      responses: {
        200: deliveryAgentResponse('Delivery agent fetched successfully.'),
        404: {
          description: 'Delivery agent not found.',
          content: { 'application/json': { schema: ApiErrorResponseSchema } },
        },
      },
    },
  },
  '/admin/delivery-agents/{deliveryAgentId}/assignments': {
    get: {
      tags: ['Delivery Agent Management'],
      summary: 'List delivery agent assignments',
      parameters: [
        deliveryAgentIdParam,
        { name: 'status', in: 'query', schema: { type: 'string', enum: DELIVERY_STATUS_VALUES } },
        { name: 'fromDate', in: 'query', schema: { type: 'string', format: 'date-time' } },
        { name: 'toDate', in: 'query', schema: { type: 'string', format: 'date-time' } },
        { name: 'page', in: 'query', schema: { type: 'integer', minimum: 1, default: 1 } },
        { name: 'limit', in: 'query', schema: { type: 'integer', minimum: 1, maximum: 100, default: 20 } },
      ],
      responses: {
        200: paginatedObjectResponse('Delivery agent assignments fetched successfully.'),
        404: {
          description: 'Delivery agent not found.',
          content: { 'application/json': { schema: ApiErrorResponseSchema } },
        },
      },
    },
  },
  '/admin/delivery-agents/{deliveryAgentId}/audit': {
    get: {
      tags: ['Delivery Agent Management'],
      summary: 'List delivery agent audit records',
      parameters: [
        deliveryAgentIdParam,
        { name: 'page', in: 'query', schema: { type: 'integer', minimum: 1, default: 1 } },
        { name: 'limit', in: 'query', schema: { type: 'integer', minimum: 1, maximum: 100, default: 20 } },
      ],
      responses: {
        200: paginatedObjectResponse('Delivery agent audit fetched successfully.'),
        404: {
          description: 'Delivery agent not found.',
          content: { 'application/json': { schema: ApiErrorResponseSchema } },
        },
      },
    },
  },
  '/admin/delivery-agents/{deliveryAgentId}/status': {
    patch: {
      tags: ['Delivery Agent Management'],
      summary: 'Update delivery agent status',
      parameters: [deliveryAgentIdParam],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['status', 'reason'],
              properties: {
                status: { type: 'string', enum: DELIVERY_AGENT_MANAGEMENT_STATUS_VALUES },
                reason: { type: 'string', minLength: 5, maxLength: 500 },
              },
            },
          },
        },
      },
      responses: { 200: deliveryAgentResponse('Delivery agent status updated successfully.') },
    },
  },
  '/admin/delivery-agents/{deliveryAgentId}/verification': {
    patch: {
      tags: ['Delivery Agent Management'],
      summary: 'Update delivery agent verification',
      parameters: [deliveryAgentIdParam],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['verificationStatus', 'reason'],
              properties: {
                verificationStatus: {
                  type: 'string',
                  enum: DELIVERY_AGENT_MANAGEMENT_VERIFICATION_STATUS_VALUES,
                },
                reason: { type: 'string', minLength: 5, maxLength: 500 },
              },
            },
          },
        },
      },
      responses: { 200: deliveryAgentResponse('Delivery agent verification updated successfully.') },
    },
  },
};
