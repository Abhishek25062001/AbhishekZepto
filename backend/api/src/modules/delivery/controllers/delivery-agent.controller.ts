import type { Request, Response } from 'express';
import { asyncHandler } from '../../../utils/async-handler';
import { sendPaginatedResponse, sendSuccessResponse } from '../../../utils/api-response';
import {
  getAgentById,
  getOwnProfile,
  listAgents,
  updateOwnProfile,
  setAgentAvailability,
} from '../services/delivery-agent.service';
import type {
  AdminAgentListFilters,
  UpdateDeliveryAgentProfileDto,
  AvailabilityStatus,
} from '../types/delivery-agent.types';

// ---------------------------------------------------------------------------
// Delivery agent surface controllers
// ---------------------------------------------------------------------------

/**
 * GET /api/v1/delivery/profile
 *
 * Returns the authenticated delivery agent's own profile.
 */
export const getOwnProfileController = asyncHandler(async (req: Request, res: Response) => {
  const agentId = req.deliveryAgentId as string;

  const profile = await getOwnProfile(agentId);

  return sendSuccessResponse({
    res,
    message: 'Profile fetched successfully',
    data: profile,
  });
});

/**
 * PATCH /api/v1/delivery/profile
 *
 * Updates the authenticated delivery agent's own profile.
 */
export const updateOwnProfileController = asyncHandler(async (req: Request, res: Response) => {
  const agentId = req.deliveryAgentId as string;
  const data = req.body as UpdateDeliveryAgentProfileDto;

  const profile = await updateOwnProfile(agentId, data);

  return sendSuccessResponse({
    res,
    message: 'Profile updated successfully',
    data: profile,
  });
});

/**
 * PATCH /api/v1/delivery/availability
 *
 * Updates the authenticated delivery agent's availability status.
 */
export const updateOwnAvailabilityController = asyncHandler(async (req: Request, res: Response) => {
  const agentId = req.deliveryAgentId as string;
  const { status } = req.body as { status: AvailabilityStatus };

  const profile = await setAgentAvailability(agentId, status);

  return sendSuccessResponse({
    res,
    message: 'Availability status updated successfully',
    data: profile,
  });
});

/**
 * GET /api/v1/delivery/status
 *
 * Retrieves a lightweight payload containing the current presence state and any active assignment ID.
 */
export const getOwnAvailabilityStatusController = asyncHandler(async (req: Request, res: Response) => {
  const agentId = req.deliveryAgentId as string;

  const profile = await getOwnProfile(agentId);

  return sendSuccessResponse({
    res,
    message: 'Availability status fetched successfully',
    data: {
      availabilityStatus: profile.availabilityStatus,
      currentAssignmentId: profile.currentAssignmentId,
    },
  });
});

// ---------------------------------------------------------------------------
// Admin surface controllers
// ---------------------------------------------------------------------------

/**
 * GET /api/v1/admin/agents
 *
 * Lists all delivery agents with optional filters and pagination.
 */
export const listAgentsController = asyncHandler(async (req: Request, res: Response) => {
  const query = req.query as {
    page?: string;
    limit?: string;
    availabilityStatus?: string;
    cityId?: string;
    isActive?: boolean | undefined;
  };

  const filters: AdminAgentListFilters = {
    page: Number(query.page ?? 1),
    limit: Number(query.limit ?? 20),
    availabilityStatus: query.availabilityStatus,
    cityId: query.cityId,
    isActive: query.isActive,
  };

  const result = await listAgents(filters);

  return sendPaginatedResponse({
    res,
    message: 'Agents fetched successfully',
    data: result.agents,
    pagination: {
      page: result.page,
      limit: result.limit,
      total: result.total,
      totalPages: Math.ceil(result.total / result.limit),
      hasNextPage: result.page * result.limit < result.total,
      hasPreviousPage: result.page > 1,
    },
  });
});

/**
 * GET /api/v1/admin/agents/:agentId
 *
 * Returns a single delivery agent for admin inspection.
 */
export const getAgentByIdController = asyncHandler(async (req: Request, res: Response) => {
  const { agentId } = req.params as { agentId: string };

  const agent = await getAgentById(agentId);

  return sendSuccessResponse({
    res,
    message: 'Agent fetched successfully',
    data: agent,
  });
});
