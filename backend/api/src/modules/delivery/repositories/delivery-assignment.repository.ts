import { Types } from 'mongoose';
import { DeliveryAssignmentModel } from '../models/delivery-assignment.model';
import type {
  CreateDeliveryAssignmentDto,
  IDeliveryAssignmentDocument,
  DeliveryStatus,
  IDeliveryTimelineEvent,
  AdminDeliveryListQuery,
} from '../types/delivery-assignment.types';
import type { DeliverySlaStatus, DeliverySlaStage } from '../constants/delivery-sla.constant';

/**
 * Create a new delivery assignment record.
 */
export const createDeliveryAssignment = async (
  data: CreateDeliveryAssignmentDto,
): Promise<IDeliveryAssignmentDocument> => {
  const delivery = new DeliveryAssignmentModel({
    ...data,
    deliveryStatus: 'pending_assignment',
    timeline: [
      {
        actorType: 'system',
        actorId: null,
        fromStatus: 'none',
        toStatus: 'pending_assignment',
        reason: 'Delivery assignment initialized',
        createdAt: new Date(),
      },
    ],
  });
  return delivery.save();
};

/**
 * Find delivery assignment by its Mongo ID.
 */
export const findDeliveryAssignmentById = async (
  deliveryId: string | Types.ObjectId,
): Promise<IDeliveryAssignmentDocument | null> => {
  if (!Types.ObjectId.isValid(deliveryId.toString())) {
    return null;
  }
  return DeliveryAssignmentModel.findById(deliveryId).exec();
};

/**
 * Find delivery assignment by Order ID.
 */
export const findDeliveryAssignmentByOrderId = async (
  orderId: string | Types.ObjectId,
): Promise<IDeliveryAssignmentDocument | null> => {
  if (!Types.ObjectId.isValid(orderId.toString())) {
    return null;
  }
  return DeliveryAssignmentModel.findOne({ orderId }).exec();
};

/**
 * Find active assignment for a given agent ID (non-terminal states).
 * Terminal states are: 'delivered', 'failed', 'cancelled'.
 */
export const findActiveAssignmentByAgentId = async (
  agentId: string | Types.ObjectId,
): Promise<IDeliveryAssignmentDocument | null> => {
  if (!Types.ObjectId.isValid(agentId.toString())) {
    return null;
  }
  return DeliveryAssignmentModel.findOne({
    deliveryAgentId: agentId,
    deliveryStatus: { $nin: ['delivered', 'failed', 'cancelled'] },
  }).exec();
};

/**
 * Find all pending unassigned deliveries in a city, sorted by oldest first.
 */
export const findPendingAssignmentsByCity = async (
  cityId: string | Types.ObjectId,
): Promise<IDeliveryAssignmentDocument[]> => {
  if (!Types.ObjectId.isValid(cityId.toString())) {
    return [];
  }
  return DeliveryAssignmentModel.find({
    cityId,
    deliveryStatus: 'pending_assignment',
  })
    .sort({ createdAt: 1 })
    .exec();
};

/**
 * Update delivery assignment status and push a timeline event.
 */
export const updateDeliveryAssignmentStatus = async (
  deliveryId: string | Types.ObjectId,
  targetStatus: DeliveryStatus,
  updateFields: Partial<IDeliveryAssignmentDocument> = {},
  timelineEvent?: Omit<IDeliveryTimelineEvent, 'createdAt'>,
): Promise<IDeliveryAssignmentDocument | null> => {
  if (!Types.ObjectId.isValid(deliveryId.toString())) {
    return null;
  }

  const setFields: Record<string, unknown> = {
    deliveryStatus: targetStatus,
    ...updateFields,
  };

  // Automatically set timestamps based on status transitions if not explicitly provided
  if (targetStatus === 'assigned' && !setFields.assignedAt) {
    setFields.assignedAt = new Date();
  } else if (targetStatus === 'arrived_at_store' && !setFields.arrivedAtStoreAt) {
    setFields.arrivedAtStoreAt = new Date();
  } else if (targetStatus === 'picked_up' && !setFields.pickedUpAt) {
    setFields.pickedUpAt = new Date();
  } else if (targetStatus === 'en_route_to_customer' && !setFields.enRouteToCustomerAt) {
    setFields.enRouteToCustomerAt = new Date();
  } else if (targetStatus === 'arrived_at_customer' && !setFields.arrivedAtCustomerAt) {
    setFields.arrivedAtCustomerAt = new Date();
  } else if (targetStatus === 'delivered' && !setFields.completedAt) {
    setFields.completedAt = new Date();
  } else if (targetStatus === 'cancelled' && !setFields.cancelledAt) {
    setFields.cancelledAt = new Date();
  }


  const pushQuery: Record<string, unknown> = {};
  if (timelineEvent) {
    pushQuery.$push = {
      timeline: {
        ...timelineEvent,
        createdAt: new Date(),
      },
    };
  }

  return DeliveryAssignmentModel.findByIdAndUpdate(
    deliveryId,
    {
      $set: setFields,
      ...pushQuery,
    },
    { new: true, runValidators: true },
  ).exec();
};

/**
 * Find delivery assignments with optional filters, paginated.
 * Used by GET /api/v1/admin/deliveries (Module 15).
 */
export const findDeliveryAssignmentsPaginated = async (
  query: AdminDeliveryListQuery,
): Promise<{ items: IDeliveryAssignmentDocument[]; total: number }> => {
  const { status, agentId, storeId, cityId, slaStatus, page, limit } = query;
  const skip = (page - 1) * limit;

  // Build filter dynamically — only add fields that were provided
  const filter: Record<string, unknown> = {};

  if (status) {
    filter.deliveryStatus = status;
  }
  if (agentId && Types.ObjectId.isValid(agentId)) {
    filter.deliveryAgentId = new Types.ObjectId(agentId);
  }
  if (storeId && Types.ObjectId.isValid(storeId)) {
    filter.storeId = new Types.ObjectId(storeId);
  }
  if (cityId && Types.ObjectId.isValid(cityId)) {
    filter.cityId = new Types.ObjectId(cityId);
  }
  if (slaStatus) {
    filter.slaStatus = slaStatus;
  }

  const [total, items] = await Promise.all([
    DeliveryAssignmentModel.countDocuments(filter).exec(),
    DeliveryAssignmentModel.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .exec(),
  ]);

  return { items, total };
};

/**
 * List active deliveries for SLA evaluation.
 */
export const listDeliveriesForSlaEvaluation = async (
  options: { limit: number },
): Promise<IDeliveryAssignmentDocument[]> => {
  return DeliveryAssignmentModel.find({
    deliveryStatus: {
      $nin: ['delivered', 'failed', 'cancelled'],
    },
  })
    .sort({ createdAt: 1 })
    .limit(options.limit)
    .exec();
};

/**
 * Update delivery SLA status and record optional timeline event.
 */
export const updateDeliverySlaById = async (
  deliveryId: string | Types.ObjectId,
  payload: {
    slaStatus: DeliverySlaStatus;
    slaBreachedStage: DeliverySlaStage | null;
    slaBreachedAt: Date | null;
  },
  timelineEvent?: IDeliveryTimelineEvent,
): Promise<IDeliveryAssignmentDocument | null> => {
  if (!Types.ObjectId.isValid(deliveryId.toString())) {
    return null;
  }

  const update = timelineEvent
    ? {
        $push: { timeline: timelineEvent },
        $set: payload,
      }
    : { $set: payload };

  return DeliveryAssignmentModel.findByIdAndUpdate(
    deliveryId,
    update,
    { new: true, runValidators: true },
  ).exec();
};

