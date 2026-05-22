import { AppError } from '../../../errors/AppError';
import { ERROR_CODES } from '../../../errors/error-codes';
import { HTTP_STATUS } from '../../../utils/http-status';
import {
  findAllDeliveryAgents,
  findDeliveryAgentById,
  updateDeliveryAgentProfile,
  updateDeliveryAgentAvailability,
} from '../repositories/delivery-agent.repository';
import type {
  AdminAgentListFilters,
  AdminDeliveryAgentResponse,
  AvailabilityStatus,
  DeliveryAgentProfileResponse,
  IDeliveryAgentDocument,
  UpdateDeliveryAgentProfileDto,
} from '../types/delivery-agent.types';

// ---------------------------------------------------------------------------
// Response mappers (private helpers)
// ---------------------------------------------------------------------------

/**
 * Maps a delivery agent document to the public profile response.
 * Excludes: isDeleted, deletedAt, isVerified, isActive (admin-only fields).
 */
const mapToProfileResponse = (doc: IDeliveryAgentDocument): DeliveryAgentProfileResponse => ({
  agentId: doc._id.toString(),
  userId: doc.userId.toString(),
  name: doc.name,
  phone: doc.phone,
  email: doc.email,
  profilePhotoUrl: doc.profilePhotoUrl,
  vehicleType: doc.vehicleType,
  vehicleNumber: doc.vehicleNumber,
  availabilityStatus: doc.availabilityStatus,
  cityId: doc.cityId?.toString() ?? null,
  currentAssignmentId: doc.currentAssignmentId?.toString() ?? null,
  totalDeliveries: doc.totalDeliveries,
  createdAt: doc.createdAt.toISOString(),
  updatedAt: doc.updatedAt.toISOString(),
});

/**
 * Maps a delivery agent document to the admin-facing response.
 * Extends the public profile with isVerified and isActive.
 */
const mapToAdminResponse = (doc: IDeliveryAgentDocument): AdminDeliveryAgentResponse => ({
  ...mapToProfileResponse(doc),
  isVerified: doc.isVerified,
  isActive: doc.isActive,
});

// ---------------------------------------------------------------------------
// Delivery agent surface service functions
// ---------------------------------------------------------------------------

/**
 * Get the profile for the authenticated delivery agent.
 * Throws DELIVERY_AGENT_NOT_FOUND (404) if the agent does not exist.
 */
export const getOwnProfile = async (agentId: string): Promise<DeliveryAgentProfileResponse> => {
  const agent = await findDeliveryAgentById(agentId);

  if (!agent) {
    throw new AppError({
      message: 'Delivery agent not found',
      statusCode: HTTP_STATUS.NOT_FOUND,
      errorCode: ERROR_CODES.DELIVERY_AGENT_NOT_FOUND,
    });
  }

  return mapToProfileResponse(agent);
};

/**
 * Update the profile for the authenticated delivery agent.
 * Only the fields in UpdateDeliveryAgentProfileDto are mutable here.
 * Throws DELIVERY_AGENT_NOT_FOUND (404) if the agent does not exist.
 */
export const updateOwnProfile = async (
  agentId: string,
  data: UpdateDeliveryAgentProfileDto,
): Promise<DeliveryAgentProfileResponse> => {
  // Confirm existence first (gives a clear 404 before the update attempt)
  const existing = await findDeliveryAgentById(agentId);

  if (!existing) {
    throw new AppError({
      message: 'Delivery agent not found',
      statusCode: HTTP_STATUS.NOT_FOUND,
      errorCode: ERROR_CODES.DELIVERY_AGENT_NOT_FOUND,
    });
  }

  const updated = await updateDeliveryAgentProfile(agentId, data);

  if (!updated) {
    // This can only happen if the agent was soft-deleted concurrently
    throw new AppError({
      message: 'Delivery agent not found',
      statusCode: HTTP_STATUS.NOT_FOUND,
      errorCode: ERROR_CODES.DELIVERY_AGENT_NOT_FOUND,
    });
  }

  return mapToProfileResponse(updated);
};

/**
 * Toggle the availability status for the authenticated agent.
 * Enforces profile completeness checks (city, vehicle, verification, active state) before allowing going online.
 * Throws DELIVERY_AGENT_NOT_FOUND (404) or DELIVERY_AGENT_PROFILE_INCOMPLETE (409).
 */
export const setAgentAvailability = async (
  agentId: string,
  status: AvailabilityStatus,
): Promise<DeliveryAgentProfileResponse> => {
  const agent = await findDeliveryAgentById(agentId);

  if (!agent) {
    throw new AppError({
      message: 'Delivery agent not found',
      statusCode: HTTP_STATUS.NOT_FOUND,
      errorCode: ERROR_CODES.DELIVERY_AGENT_NOT_FOUND,
    });
  }

  // Completeness checks when trying to go ONLINE
  if (status === 'online') {
    const hasCity = !!agent.cityId;
    const hasVehicle = !!agent.vehicleNumber && agent.vehicleNumber.trim().length > 0;
    const isApproved = agent.isVerified === true;
    const isActive = agent.isActive === true;

    if (!hasCity || !hasVehicle || !isApproved || !isActive) {
      throw new AppError({
        message: 'Delivery agent profile is incomplete or unverified',
        statusCode: HTTP_STATUS.CONFLICT, // 409
        errorCode: ERROR_CODES.DELIVERY_AGENT_PROFILE_INCOMPLETE,
      });
    }
  }

  const updated = await updateDeliveryAgentAvailability(agentId, status);

  if (!updated) {
    throw new AppError({
      message: 'Delivery agent not found',
      statusCode: HTTP_STATUS.NOT_FOUND,
      errorCode: ERROR_CODES.DELIVERY_AGENT_NOT_FOUND,
    });
  }

  return mapToProfileResponse(updated);
};

// ---------------------------------------------------------------------------
// Admin surface service functions
// ---------------------------------------------------------------------------

/**
 * Get a delivery agent by ID for admin inspection.
 * Returns admin-facing response (includes isVerified, isActive).
 * Throws DELIVERY_AGENT_NOT_FOUND (404) if the agent does not exist.
 */
export const getAgentById = async (agentId: string): Promise<AdminDeliveryAgentResponse> => {
  const agent = await findDeliveryAgentById(agentId);

  if (!agent) {
    throw new AppError({
      message: 'Delivery agent not found',
      statusCode: HTTP_STATUS.NOT_FOUND,
      errorCode: ERROR_CODES.DELIVERY_AGENT_NOT_FOUND,
    });
  }

  return mapToAdminResponse(agent);
};

/**
 * List delivery agents with optional filters and pagination.
 * Returns admin-facing response for each agent.
 */
export const listAgents = async (
  filters: AdminAgentListFilters,
): Promise<{
  agents: AdminDeliveryAgentResponse[];
  total: number;
  page: number;
  limit: number;
}> => {
  const { agents, total } = await findAllDeliveryAgents(filters);

  return {
    agents: agents.map(mapToAdminResponse),
    total,
    page: filters.page,
    limit: filters.limit,
  };
};
