import { Types } from 'mongoose';
import { DeliveryAgentModel } from '../models/delivery-agent.model';
import type {
  AdminAgentListFilters,
  AvailabilityStatus,
  CreateDeliveryAgentDto,
  IDeliveryAgentDocument,
  UpdateDeliveryAgentProfileDto,
} from '../types/delivery-agent.types';

// ---------------------------------------------------------------------------
// Read functions
// ---------------------------------------------------------------------------

/**
 * Find a delivery agent by their Mongo `_id`.
 * Excludes soft-deleted records.
 */
export const findDeliveryAgentById = async (
  agentId: string,
): Promise<IDeliveryAgentDocument | null> => {
  if (!Types.ObjectId.isValid(agentId)) {
    return null;
  }

  return DeliveryAgentModel.findOne({ _id: agentId, isDeleted: false }).exec();
};

/**
 * Find a delivery agent by their linked `userId`.
 * Excludes soft-deleted records.
 */
export const findDeliveryAgentByUserId = async (
  userId: string,
): Promise<IDeliveryAgentDocument | null> => {
  if (!Types.ObjectId.isValid(userId)) {
    return null;
  }

  return DeliveryAgentModel.findOne({ userId, isDeleted: false }).exec();
};

/**
 * Find a delivery agent by their phone number.
 * Excludes soft-deleted records.
 */
export const findDeliveryAgentByPhone = async (
  phone: string,
): Promise<IDeliveryAgentDocument | null> => {
  return DeliveryAgentModel.findOne({ phone: phone.trim(), isDeleted: false }).exec();
};

// ---------------------------------------------------------------------------
// Write functions
// ---------------------------------------------------------------------------

/**
 * Create a new delivery agent record.
 */
export const createDeliveryAgent = async (
  data: CreateDeliveryAgentDto,
): Promise<IDeliveryAgentDocument> => {
  const agent = new DeliveryAgentModel(data);

  return agent.save();
};

/**
 * Update mutable profile fields for a delivery agent.
 * Returns the updated document.
 *
 * Fields NOT updated here: availabilityStatus, userId, phone, isVerified, isActive, isDeleted.
 */
export const updateDeliveryAgentProfile = async (
  agentId: string,
  data: UpdateDeliveryAgentProfileDto,
): Promise<IDeliveryAgentDocument | null> => {
  if (!Types.ObjectId.isValid(agentId)) {
    return null;
  }

  return DeliveryAgentModel.findOneAndUpdate(
    { _id: agentId, isDeleted: false },
    { $set: data },
    { new: true, runValidators: true },
  ).exec();
};

/**
 * Update the availability status of a delivery agent.
 * Targets only active, non-soft-deleted profiles.
 */
export const updateDeliveryAgentAvailability = async (
  agentId: string,
  status: AvailabilityStatus,
): Promise<IDeliveryAgentDocument | null> => {
  if (!Types.ObjectId.isValid(agentId)) {
    return null;
  }

  return DeliveryAgentModel.findOneAndUpdate(
    { _id: agentId, isDeleted: false },
    { $set: { availabilityStatus: status } },
    { new: true, runValidators: true },
  ).exec();
};

/**
 * List all delivery agents with optional filters and pagination.
 * Admin surface query. Always excludes soft-deleted records.
 */
export const findAllDeliveryAgents = async (
  filters: AdminAgentListFilters,
): Promise<{ agents: IDeliveryAgentDocument[]; total: number }> => {
  const query: Record<string, unknown> = { isDeleted: false };

  if (typeof filters.isActive === 'boolean') {
    query.isActive = filters.isActive;
  }

  if (filters.availabilityStatus) {
    query.availabilityStatus = filters.availabilityStatus;
  }

  if (filters.cityId && Types.ObjectId.isValid(filters.cityId)) {
    query.cityId = new Types.ObjectId(filters.cityId);
  }

  const page = filters.page;
  const limit = filters.limit;
  const skip = (page - 1) * limit;

  const [agents, total] = await Promise.all([
    DeliveryAgentModel.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).exec(),
    DeliveryAgentModel.countDocuments(query).exec(),
  ]);

  return { agents, total };
};

/**
 * Soft-delete a delivery agent.
 * Sets `isDeleted = true` and `deletedAt = now`.
 */
export const softDeleteDeliveryAgent = async (
  agentId: string,
): Promise<IDeliveryAgentDocument | null> => {
  if (!Types.ObjectId.isValid(agentId)) {
    return null;
  }

  return DeliveryAgentModel.findOneAndUpdate(
    { _id: agentId, isDeleted: false },
    { $set: { isDeleted: true, deletedAt: new Date() } },
    { new: true },
  ).exec();
};
