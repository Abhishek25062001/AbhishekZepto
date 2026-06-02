import { Types } from 'mongoose';

import { AdminActionAuditModel } from '../../admin-control/models/admin-action-audit.model';
import { AVAILABILITY_STATUS } from '../../delivery/constants/delivery-agent-status.constant';
import { DeliveryAssignmentModel } from '../../delivery/models/delivery-assignment.model';
import type { AdminActionAuditRecord } from '../../admin-control/types/admin-action-audit.types';
import type { IDeliveryAssignmentDocument } from '../../delivery/types/delivery-assignment.types';
import { DeliveryAgentModel } from '../../delivery/models/delivery-agent.model';
import type { IDeliveryAgentDocument } from '../../delivery/types/delivery-agent.types';
import type {
  DeliveryAgentManagementStatus,
  DeliveryAgentManagementVerificationStatus,
  ListDeliveryAgentAssignmentsInput,
  ListDeliveryAgentAuditInput,
  ListDeliveryAgentsInput,
} from '../types/admin-delivery-agent-management.types';

const escapeRegex = (value: string): string => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export const findAdminDeliveryAgentById = (
  deliveryAgentId: string,
): Promise<IDeliveryAgentDocument | null> => {
  if (!Types.ObjectId.isValid(deliveryAgentId)) {
    return Promise.resolve(null);
  }

  return DeliveryAgentModel.findOne({
    _id: new Types.ObjectId(deliveryAgentId),
    isDeleted: false,
  }).exec();
};

export const listAdminDeliveryAgents = async ({
  status,
  availabilityStatus,
  verificationStatus,
  cityId,
  search,
  page,
  limit,
}: ListDeliveryAgentsInput): Promise<{ items: IDeliveryAgentDocument[]; total: number }> => {
  const filter: Record<string, unknown> = { isDeleted: false };

  if (status) {
    filter.isActive = status === 'active';
  }

  if (availabilityStatus) {
    filter.availabilityStatus = availabilityStatus;
  }

  if (verificationStatus) {
    filter.isVerified = verificationStatus === 'verified';
  }

  if (cityId && Types.ObjectId.isValid(cityId)) {
    filter.cityId = new Types.ObjectId(cityId);
  }

  if (search?.trim()) {
    const pattern = escapeRegex(search.trim());
    filter.$or = [
      { name: { $regex: pattern, $options: 'i' } },
      { phone: { $regex: pattern, $options: 'i' } },
      { email: { $regex: pattern, $options: 'i' } },
      { vehicleNumber: { $regex: pattern, $options: 'i' } },
    ];
  }

  const skip = (page - 1) * limit;

  const [items, total] = await Promise.all([
    DeliveryAgentModel.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).exec(),
    DeliveryAgentModel.countDocuments(filter).exec(),
  ]);

  return { items, total };
};

export const updateAdminDeliveryAgentStatus = ({
  deliveryAgentId,
  status,
  adminId,
  reason,
}: {
  deliveryAgentId: string;
  status: DeliveryAgentManagementStatus;
  adminId: string | null;
  reason: string;
}): Promise<IDeliveryAgentDocument | null> => {
  if (!Types.ObjectId.isValid(deliveryAgentId)) {
    return Promise.resolve(null);
  }

  const adminObjectId = adminId && Types.ObjectId.isValid(adminId)
    ? new Types.ObjectId(adminId)
    : null;

  return DeliveryAgentModel.findOneAndUpdate(
    { _id: new Types.ObjectId(deliveryAgentId), isDeleted: false },
    {
      $set: {
        isActive: status === 'active',
        ...(status === 'inactive'
          ? {
              availabilityStatus: AVAILABILITY_STATUS.OFFLINE,
              forcedOfflineAt: new Date(),
              forcedOfflineReason: reason,
              forcedOfflineBy: adminObjectId,
            }
          : {}),
      },
    },
    { new: true, runValidators: true },
  ).exec();
};

export const updateAdminDeliveryAgentVerification = ({
  deliveryAgentId,
  verificationStatus,
}: {
  deliveryAgentId: string;
  verificationStatus: DeliveryAgentManagementVerificationStatus;
}): Promise<IDeliveryAgentDocument | null> => {
  if (!Types.ObjectId.isValid(deliveryAgentId)) {
    return Promise.resolve(null);
  }

  return DeliveryAgentModel.findOneAndUpdate(
    { _id: new Types.ObjectId(deliveryAgentId), isDeleted: false },
    { $set: { isVerified: verificationStatus === 'verified' } },
    { new: true, runValidators: true },
  ).exec();
};

export const listAdminDeliveryAgentAssignments = async ({
  deliveryAgentId,
  status,
  fromDate,
  toDate,
  page,
  limit,
}: ListDeliveryAgentAssignmentsInput): Promise<{ items: IDeliveryAssignmentDocument[]; total: number }> => {
  if (!Types.ObjectId.isValid(deliveryAgentId)) {
    return { items: [], total: 0 };
  }

  const filter: Record<string, unknown> = {
    deliveryAgentId: new Types.ObjectId(deliveryAgentId),
  };

  if (status) {
    filter.deliveryStatus = status;
  }

  if (fromDate || toDate) {
    filter.createdAt = {
      ...(fromDate ? { $gte: fromDate } : {}),
      ...(toDate ? { $lte: toDate } : {}),
    };
  }

  const skip = (page - 1) * limit;

  const [items, total] = await Promise.all([
    DeliveryAssignmentModel.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).exec(),
    DeliveryAssignmentModel.countDocuments(filter).exec(),
  ]);

  return { items, total };
};

export const listAdminDeliveryAgentAudit = async ({
  deliveryAgentId,
  page,
  limit,
}: ListDeliveryAgentAuditInput): Promise<{ items: AdminActionAuditRecord[]; total: number }> => {
  if (!Types.ObjectId.isValid(deliveryAgentId)) {
    return { items: [], total: 0 };
  }

  const filter = {
    entityType: 'delivery_agent',
    entityId: new Types.ObjectId(deliveryAgentId),
  };
  const skip = (page - 1) * limit;

  const [items, total] = await Promise.all([
    AdminActionAuditModel.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).exec(),
    AdminActionAuditModel.countDocuments(filter).exec(),
  ]);

  return { items, total };
};
