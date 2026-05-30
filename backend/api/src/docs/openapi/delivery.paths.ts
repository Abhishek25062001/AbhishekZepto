import { ApiErrorResponseSchema } from './common.schemas';

const deliveryAgentProfileProperties = {
  _id: { type: 'string', example: '603d7b97e6824a1b8cfa3b21' },
  userId: { type: 'string', example: '603d7b97e6824a1b8cfa3b20' },
  name: { type: 'string', example: 'Shivam Chowdhry' },
  phone: { type: 'string', example: '+919876543210' },
  email: { type: 'string', nullable: true, example: 'shivam@zepto-like.com' },
  profilePhotoUrl: { type: 'string', nullable: true, example: 'https://assets.zepto-like.com/profiles/shivam.jpg' },
  vehicleType: { type: 'string', enum: ['bike', 'scooter', 'bicycle', 'foot'], example: 'scooter' },
  vehicleNumber: { type: 'string', nullable: true, example: 'MH-12-AB-1234' },
  availabilityStatus: { type: 'string', enum: ['online', 'offline'], example: 'offline' },
  isVerified: { type: 'boolean', example: true },
  isActive: { type: 'boolean', example: true },
  cityId: { type: 'string', nullable: true, example: '603d7b97e6824a1b8cfa3b19' },
  currentAssignmentId: { type: 'string', nullable: true, example: null },
  totalDeliveries: { type: 'number', example: 12 },
  createdAt: { type: 'string', format: 'date-time', example: '2026-05-20T10:00:00.000Z' },
  updatedAt: { type: 'string', format: 'date-time', example: '2026-05-21T18:00:00.000Z' },
};

export const deliveryPaths = {
  '/delivery/profile': {
    get: {
      description: 'Get the authenticated delivery agent\'s own profile. Protected by secure JWT authentication.',
      responses: {
        200: {
          content: {
            'application/json': {
              schema: {
                properties: {
                  data: {
                    properties: deliveryAgentProfileProperties,
                    type: 'object',
                  },
                  message: { type: 'string', example: 'Profile fetched successfully' },
                  success: { type: 'boolean', example: true },
                },
                type: 'object',
              },
            },
          },
          description: 'Profile fetched successfully.',
        },
        401: {
          content: { 'application/json': { schema: ApiErrorResponseSchema } },
          description: 'Authentication failure response.',
        },
        404: {
          content: { 'application/json': { schema: ApiErrorResponseSchema } },
          description: 'Delivery agent profile not found.',
        },
      },
      summary: 'Get own delivery agent profile',
      tags: ['Delivery Agent'],
    },
    patch: {
      description: 'Update mutable fields on the authenticated delivery agent\'s own profile. Protected by secure JWT authentication.',
      requestBody: {
        content: {
          'application/json': {
            schema: {
              properties: {
                name: { type: 'string', example: 'Shivam Chowdhry' },
                email: { type: 'string', nullable: true, example: 'shivam.new@zepto-like.com' },
                profilePhotoUrl: { type: 'string', nullable: true, example: 'https://assets.zepto-like.com/profiles/shivam_new.jpg' },
                vehicleType: { type: 'string', enum: ['bike', 'scooter', 'bicycle', 'foot'], example: 'scooter' },
                vehicleNumber: { type: 'string', nullable: true, example: 'MH-12-AB-5678' },
              },
              type: 'object',
            },
          },
        },
        required: true,
      },
      responses: {
        200: {
          content: {
            'application/json': {
              schema: {
                properties: {
                  data: {
                    properties: deliveryAgentProfileProperties,
                    type: 'object',
                  },
                  message: { type: 'string', example: 'Profile updated successfully' },
                  success: { type: 'boolean', example: true },
                },
                type: 'object',
              },
            },
          },
          description: 'Profile updated successfully.',
        },
        401: {
          content: { 'application/json': { schema: ApiErrorResponseSchema } },
          description: 'Authentication failure response.',
        },
        404: {
          content: { 'application/json': { schema: ApiErrorResponseSchema } },
          description: 'Delivery agent profile not found.',
        },
        422: {
          content: { 'application/json': { schema: ApiErrorResponseSchema } },
          description: 'Request validation failed.',
        },
      },
      summary: 'Update own delivery agent profile',
      tags: ['Delivery Agent'],
    },
  },
  '/delivery/availability': {
    patch: {
      description: 'Toggle the availability status of the authenticated delivery agent between online and offline. Protected by secure JWT authentication.',
      requestBody: {
        content: {
          'application/json': {
            schema: {
              properties: {
                status: {
                  enum: ['online', 'offline'],
                  type: 'string',
                },
              },
              required: ['status'],
              type: 'object',
            },
          },
        },
        required: true,
      },
      responses: {
        200: {
          content: {
            'application/json': {
              schema: {
                properties: {
                  data: {
                    properties: {
                      _id: { type: 'string', example: '603d7b97e6824a1b8cfa3b21' },
                      availabilityStatus: { enum: ['online', 'offline'], type: 'string', example: 'online' },
                      cityId: { nullable: true, type: 'string', example: '603d7b97e6824a1b8cfa3b19' },
                      vehicleNumber: { nullable: true, type: 'string', example: 'MH-12-AB-5678' },
                      isVerified: { type: 'boolean', example: true },
                      isActive: { type: 'boolean', example: true },
                      currentAssignmentId: { nullable: true, type: 'string', example: null },
                    },
                    type: 'object',
                  },
                  message: { type: 'string', example: 'Availability status updated successfully' },
                  success: { type: 'boolean', example: true },
                },
                type: 'object',
              },
            },
          },
          description: 'Availability status updated successfully.',
        },
        401: {
          content: { 'application/json': { schema: ApiErrorResponseSchema } },
          description: 'Authentication failure response.',
        },
        404: {
          content: { 'application/json': { schema: ApiErrorResponseSchema } },
          description: 'Delivery agent not found.',
        },
        409: {
          content: { 'application/json': { schema: ApiErrorResponseSchema } },
          description: 'Profile is incomplete or unverified.',
        },
        422: {
          content: { 'application/json': { schema: ApiErrorResponseSchema } },
          description: 'Request validation failed.',
        },
      },
      summary: 'Toggle delivery agent availability status',
      tags: ['Delivery Agent'],
    },
  },
  '/delivery/status': {
    get: {
      description: 'Retrieve lightweight availability and active assignment status for the authenticated agent. Protected by secure JWT authentication.',
      responses: {
        200: {
          content: {
            'application/json': {
              schema: {
                properties: {
                  data: {
                    properties: {
                      availabilityStatus: { enum: ['online', 'offline'], type: 'string', example: 'online' },
                      currentAssignmentId: { nullable: true, type: 'string', example: null },
                    },
                    type: 'object',
                  },
                  message: { type: 'string', example: 'Availability status fetched successfully' },
                  success: { type: 'boolean', example: true },
                },
                type: 'object',
              },
            },
          },
          description: 'Availability status fetched successfully.',
        },
        401: {
          content: { 'application/json': { schema: ApiErrorResponseSchema } },
          description: 'Authentication failure response.',
        },
        404: {
          content: { 'application/json': { schema: ApiErrorResponseSchema } },
          description: 'Delivery agent not found.',
        },
      },
      summary: 'Get delivery agent availability status',
      tags: ['Delivery Agent'],
    },
  },
  '/delivery/assignments/{assignmentId}/arrived-at-store': {
    post: {
      description: "Register that the authenticated delivery agent has physically arrived at the store location. Protected by secure JWT authentication.",
      parameters: [
        {
          name: 'assignmentId',
          in: 'path',
          required: true,
          description: 'The 24-character hexadecimal MongoDB ObjectId of the delivery assignment.',
          schema: { type: 'string', example: '603d7b97e6824a1b8cfa3b22' },
        },
      ],
      responses: {
        200: {
          content: {
            'application/json': {
              schema: {
                properties: {
                  data: {
                    type: 'object',
                    properties: {
                      _id: { type: 'string', example: '603d7b97e6824a1b8cfa3b22' },
                      deliveryStatus: { type: 'string', example: 'arrived_at_store' },
                      arrivedAtStoreAt: { type: 'string', format: 'date-time', example: '2026-05-22T01:31:00.000Z' },
                    },
                  },
                  message: { type: 'string', example: 'Registered arrival at store successfully' },
                  success: { type: 'boolean', example: true },
                },
                type: 'object',
              },
            },
          },
          description: 'Registered arrival successfully.',
        },
        401: {
          content: { 'application/json': { schema: ApiErrorResponseSchema } },
          description: 'Authentication failure response.',
        },
        403: {
          content: { 'application/json': { schema: ApiErrorResponseSchema } },
          description: 'Forbidden: Delivery agent is not assigned to this order.',
        },
        404: {
          content: { 'application/json': { schema: ApiErrorResponseSchema } },
          description: 'Delivery assignment not found.',
        },
        409: {
          content: { 'application/json': { schema: ApiErrorResponseSchema } },
          description: 'Conflict: Invalid transition or delivery is in terminal state.',
        },
      },
      summary: 'Register arrival at store',
      tags: ['Delivery Agent'],
    },
  },
  '/delivery/assignments/{assignmentId}/picked-up': {
    post: {
      description: "Register that the authenticated delivery agent has verified and picked up the order items from the store. Protected by secure JWT authentication.",
      parameters: [
        {
          name: 'assignmentId',
          in: 'path',
          required: true,
          description: 'The 24-character hexadecimal MongoDB ObjectId of the delivery assignment.',
          schema: { type: 'string', example: '603d7b97e6824a1b8cfa3b22' },
        },
      ],
      requestBody: {
        content: {
          'application/json': {
            schema: {
              properties: {
                verificationMethod: { type: 'string', enum: ['otp', 'barcode', 'manual'], example: 'manual' },
                verificationValue: { type: 'string', example: 'VERIFIED' },
                notes: { type: 'string', example: 'Package is in good condition' },
              },
              type: 'object',
            },
          },
        },
        required: false,
      },
      responses: {
        200: {
          content: {
            'application/json': {
              schema: {
                properties: {
                  data: {
                    type: 'object',
                    properties: {
                      _id: { type: 'string', example: '603d7b97e6824a1b8cfa3b22' },
                      deliveryStatus: { type: 'string', example: 'picked_up' },
                      pickedUpAt: { type: 'string', format: 'date-time', example: '2026-05-22T01:35:00.000Z' },
                    },
                  },
                  message: { type: 'string', example: 'Registered package pickup successfully' },
                  success: { type: 'boolean', example: true },
                },
                type: 'object',
              },
            },
          },
          description: 'Registered package pickup successfully.',
        },
        401: {
          content: { 'application/json': { schema: ApiErrorResponseSchema } },
          description: 'Authentication failure response.',
        },
        403: {
          content: { 'application/json': { schema: ApiErrorResponseSchema } },
          description: 'Forbidden: Delivery agent is not assigned to this order.',
        },
        404: {
          content: { 'application/json': { schema: ApiErrorResponseSchema } },
          description: 'Delivery assignment not found.',
        },
        409: {
          content: { 'application/json': { schema: ApiErrorResponseSchema } },
          description: 'Conflict: Invalid transition or delivery is in terminal state.',
        },
      },
      summary: 'Register package pickup from store',
      tags: ['Delivery Agent'],
    },
  },
  '/delivery/assignments/{assignmentId}/en-route-to-customer': {
    post: {
      description: 'Transitions the delivery assignment from picked_up to en_route_to_customer. The agent must be the assigned agent for this delivery.',
      parameters: [
        {
          description: 'The delivery assignment ObjectId.',
          in: 'path',
          name: 'assignmentId',
          required: true,
          schema: { type: 'string', example: '603d7b97e6824a1b8cfa3b22' },
        },
      ],
      responses: {
        200: {
          content: {
            'application/json': {
              schema: {
                properties: {
                  data: {
                    type: 'object',
                    properties: {
                      _id: { type: 'string', example: '603d7b97e6824a1b8cfa3b22' },
                      deliveryStatus: { type: 'string', example: 'en_route_to_customer' },
                      enRouteToCustomerAt: { type: 'string', format: 'date-time', example: '2026-05-28T06:20:00.000Z' },
                    },
                  },
                  message: { type: 'string', example: 'En-route to customer registered successfully' },
                  success: { type: 'boolean', example: true },
                },
                type: 'object',
              },
            },
          },
          description: 'En-route to customer status registered successfully.',
        },
        401: {
          content: { 'application/json': { schema: ApiErrorResponseSchema } },
          description: 'Authentication failure response.',
        },
        403: {
          content: { 'application/json': { schema: ApiErrorResponseSchema } },
          description: 'Forbidden: Delivery agent is not assigned to this order.',
        },
        404: {
          content: { 'application/json': { schema: ApiErrorResponseSchema } },
          description: 'Delivery assignment not found.',
        },
        409: {
          content: { 'application/json': { schema: ApiErrorResponseSchema } },
          description: 'Conflict: Invalid state transition or delivery is in terminal state.',
        },
        422: {
          content: { 'application/json': { schema: ApiErrorResponseSchema } },
          description: 'Validation error: assignmentId is not a valid ObjectId.',
        },
      },
      security: [{ bearerAuth: [] }],
      summary: 'Mark delivery as en-route to customer',
      tags: ['Delivery Agent'],
    },
  },
  '/delivery/assignments/{assignmentId}/arrived-at-customer': {
    post: {
      description: 'Transitions the delivery assignment from en_route_to_customer to arrived_at_customer. The agent must be the assigned agent for this delivery.',
      parameters: [
        {
          description: 'The delivery assignment ObjectId.',
          in: 'path',
          name: 'assignmentId',
          required: true,
          schema: { type: 'string', example: '603d7b97e6824a1b8cfa3b22' },
        },
      ],
      responses: {
        200: {
          content: {
            'application/json': {
              schema: {
                properties: {
                  data: {
                    type: 'object',
                    properties: {
                      _id: { type: 'string', example: '603d7b97e6824a1b8cfa3b22' },
                      deliveryStatus: { type: 'string', example: 'arrived_at_customer' },
                      arrivedAtCustomerAt: { type: 'string', format: 'date-time', example: '2026-05-28T06:28:00.000Z' },
                    },
                  },
                  message: { type: 'string', example: 'Arrived at customer registered successfully' },
                  success: { type: 'boolean', example: true },
                },
                type: 'object',
              },
            },
          },
          description: 'Arrived at customer status registered successfully.',
        },
        401: {
          content: { 'application/json': { schema: ApiErrorResponseSchema } },
          description: 'Authentication failure response.',
        },
        403: {
          content: { 'application/json': { schema: ApiErrorResponseSchema } },
          description: 'Forbidden: Delivery agent is not assigned to this order.',
        },
        404: {
          content: { 'application/json': { schema: ApiErrorResponseSchema } },
          description: 'Delivery assignment not found.',
        },
        409: {
          content: { 'application/json': { schema: ApiErrorResponseSchema } },
          description: 'Conflict: Invalid state transition or delivery is in terminal state.',
        },
        422: {
          content: { 'application/json': { schema: ApiErrorResponseSchema } },
          description: 'Validation error: assignmentId is not a valid ObjectId.',
        },
      },
      security: [{ bearerAuth: [] }],
      summary: 'Mark delivery as arrived at customer',
      tags: ['Delivery Agent'],
    },
  },
  '/delivery/assignments/{assignmentId}/delivered': {
    post: {
      description: 'Mark the delivery assignment as successfully delivered. Updates corresponding order status to delivered, sets completion timestamps, and releases the delivery agent. Protected by secure JWT authentication.',
      parameters: [
        {
          description: 'The delivery assignment ObjectId.',
          in: 'path',
          name: 'assignmentId',
          required: true,
          schema: { type: 'string', example: '603d7b97e6824a1b8cfa3b22' },
        },
      ],
      requestBody: {
        content: {
          'application/json': {
            schema: {
              properties: {
                verificationMethod: { type: 'string', enum: ['otp', 'photo', 'manual'], example: 'otp' },
                verificationValue: { type: 'string', example: '123456' },
                notes: { type: 'string', example: 'Handed over directly to customer front door.' },
              },
              type: 'object',
            },
          },
        },
        required: false,
      },
      responses: {
        200: {
          content: {
            'application/json': {
              schema: {
                properties: {
                  data: {
                    type: 'object',
                    properties: {
                      _id: { type: 'string', example: '603d7b97e6824a1b8cfa3b22' },
                      deliveryStatus: { type: 'string', example: 'delivered' },
                      completedAt: { type: 'string', format: 'date-time', example: '2026-05-28T09:00:00.000Z' },
                      deliveredAt: { type: 'string', format: 'date-time', example: '2026-05-28T09:00:00.000Z' },
                    },
                  },
                  message: { type: 'string', example: 'Delivery completed successfully' },
                  success: { type: 'boolean', example: true },
                },
                type: 'object',
              },
            },
          },
          description: 'Delivery marked as successfully completed.',
        },
        401: {
          content: { 'application/json': { schema: ApiErrorResponseSchema } },
          description: 'Authentication failure response.',
        },
        403: {
          content: { 'application/json': { schema: ApiErrorResponseSchema } },
          description: 'Forbidden: Delivery agent is not assigned to this order.',
        },
        404: {
          content: { 'application/json': { schema: ApiErrorResponseSchema } },
          description: 'Delivery assignment not found.',
        },
        409: {
          content: { 'application/json': { schema: ApiErrorResponseSchema } },
          description: 'Conflict: Invalid state transition or delivery is in terminal state.',
        },
        422: {
          content: { 'application/json': { schema: ApiErrorResponseSchema } },
          description: 'Validation error: assignmentId is not a valid ObjectId or request body has invalid verification schema.',
        },
      },
      security: [{ bearerAuth: [] }],
      summary: 'Mark delivery as delivered',
      tags: ['Delivery Agent'],
    },
  },
  '/delivery/assignments/{assignmentId}/failed': {
    post: {
      description: 'Mark the delivery assignment as failed. Updates corresponding order status to failed, sets failure timestamps and reason, and releases the delivery agent. Protected by secure JWT authentication.',
      parameters: [
        {
          description: 'The delivery assignment ObjectId.',
          in: 'path',
          name: 'assignmentId',
          required: true,
          schema: { type: 'string', example: '603d7b97e6824a1b8cfa3b22' },
        },
      ],
      requestBody: {
        content: {
          'application/json': {
            schema: {
              properties: {
                failureReason: { type: 'string', example: 'Customer not available' },
              },
              required: ['failureReason'],
              type: 'object',
            },
          },
        },
        required: true,
      },
      responses: {
        200: {
          content: {
            'application/json': {
              schema: {
                properties: {
                  data: {
                    type: 'object',
                    properties: {
                      _id: { type: 'string', example: '603d7b97e6824a1b8cfa3b22' },
                      deliveryStatus: { type: 'string', example: 'failed' },
                      failedAt: { type: 'string', format: 'date-time', example: '2026-05-28T09:05:00.000Z' },
                      failureReason: { type: 'string', example: 'Customer not available' },
                    },
                  },
                  message: { type: 'string', example: 'Delivery failure registered successfully' },
                  success: { type: 'boolean', example: true },
                },
                type: 'object',
              },
            },
          },
          description: 'Delivery failure registered successfully.',
        },
        401: {
          content: { 'application/json': { schema: ApiErrorResponseSchema } },
          description: 'Authentication failure response.',
        },
        403: {
          content: { 'application/json': { schema: ApiErrorResponseSchema } },
          description: 'Forbidden: Delivery agent is not assigned to this order.',
        },
        404: {
          content: { 'application/json': { schema: ApiErrorResponseSchema } },
          description: 'Delivery assignment not found.',
        },
        409: {
          content: { 'application/json': { schema: ApiErrorResponseSchema } },
          description: 'Conflict: Invalid state transition or delivery is in terminal state.',
        },
        422: {
          content: { 'application/json': { schema: ApiErrorResponseSchema } },
          description: 'Validation error: assignmentId is not a valid ObjectId or missing required failureReason field.',
        },
      },
      security: [{ bearerAuth: [] }],
      summary: 'Mark delivery as failed',
      tags: ['Delivery Agent'],
    },
  },
};


