import { Types } from 'mongoose';
import { AppError } from '../../../errors/AppError';
import { ERROR_CODES } from '../../../errors/error-codes';
import { HTTP_STATUS } from '../../../utils/http-status';
import { DeliveryAgentModel } from '../models/delivery-agent.model';
import { DeliveryAssignmentModel } from '../models/delivery-assignment.model';
import {
  createDeliveryAssignment,
  findDeliveryAssignmentById,
  findDeliveryAssignmentByOrderId,
  updateDeliveryAssignmentStatus,
} from '../repositories/delivery-assignment.repository';
import { findOrderById } from '../../orders/repositories/order.repository';
import { findStoreById } from '../../stores/repositories/store.repository';
import { publishDeliveryNotificationPlaceholders } from './delivery-notification.service';
import type {
  IDeliveryAssignmentDocument,
  IPickupVerificationData,
} from '../types/delivery-assignment.types';


/**
 * Initialize a new delivery assignment record for an order.
 * Copies customer, store, and city details (city is resolved from the store).
 */
export const initializeDeliveryForOrder = async (
  orderId: string | Types.ObjectId,
): Promise<IDeliveryAssignmentDocument | null> => {
  const existing = await findDeliveryAssignmentByOrderId(orderId);
  if (existing) {
    return existing;
  }

  const order = await findOrderById(orderId.toString());
  if (!order) {
    throw new Error(`Order not found for initialization: ${orderId}`);
  }

  const store = await findStoreById(order.storeId.toString());
  if (!store) {
    throw new Error(`Store not found for order store ID: ${order.storeId}`);
  }

  if (!store.cityId) {
    throw new Error(`Store ${store._id} does not have a cityId assigned`);
  }

  return createDeliveryAssignment({
    orderId: order._id,
    customerId: order.customerId,
    storeId: order.storeId,
    cityId: store.cityId,
  });
};

/**
 * Run the dispatch matching engine to auto-assign an idle delivery agent to a pending order.
 * Follows oldest-idle matching rules.
 */
export const runDispatchEngineForOrder = async (
  deliveryId: string | Types.ObjectId,
): Promise<IDeliveryAssignmentDocument | null> => {
  const delivery = await findDeliveryAssignmentById(deliveryId);
  if (!delivery || delivery.deliveryStatus !== 'pending_assignment') {
    return delivery;
  }

  // Find eligible online agents in the same city, sorted by oldest idle (updatedAt ascending)
  const eligibleAgents = await DeliveryAgentModel.find({
    availabilityStatus: 'online',
    cityId: delivery.cityId,
    isActive: true,
    isVerified: true,
    isDeleted: false,
    currentAssignmentId: null,
  })
    .sort({ updatedAt: 1 })
    .limit(10)
    .exec();

  let assignedAgent = null;

  // Optimistic locking loop to find and secure an agent atomically
  for (const eligibleAgent of eligibleAgents) {
    const lockedAgent = await DeliveryAgentModel.findOneAndUpdate(
      {
        _id: eligibleAgent._id,
        currentAssignmentId: null,
        availabilityStatus: 'online',
        isActive: true,
        isVerified: true,
        isDeleted: false,
      },
      { $set: { currentAssignmentId: delivery._id } },
      { new: true },
    ).exec();

    if (lockedAgent) {
      assignedAgent = lockedAgent;
      break;
    }
  }

  if (!assignedAgent) {
    // No agent found or successfully locked, delivery remains pending_assignment
    return delivery;
  }

  // Atomically lock and update the delivery assignment record
  const updatedDelivery = await DeliveryAssignmentModel.findOneAndUpdate(
    {
      _id: delivery._id,
      deliveryStatus: 'pending_assignment',
    },
    {
      $set: {
        deliveryAgentId: assignedAgent._id,
        deliveryStatus: 'assigned',
        assignedAt: new Date(),
      },
      $push: {
        timeline: {
          actorType: 'system',
          actorId: null,
          fromStatus: 'pending_assignment',
          toStatus: 'assigned',
          reason: 'Auto-assigned by matching engine (oldest-idle routing)',
        },
      },
    },
    { new: true },
  ).exec();

  if (!updatedDelivery) {
    // Rollback agent assignment if the delivery was concurrently assigned or cancelled
    await DeliveryAgentModel.updateOne(
      { _id: assignedAgent._id, currentAssignmentId: delivery._id },
      { $set: { currentAssignmentId: null } },
    ).exec();
    return null;
  }

  // Asynchronously trigger notification placeholder publishing
  publishDeliveryNotificationPlaceholders(updatedDelivery, 'assigned').catch((err) => {
    console.error('Failed to trigger assignment notification:', err);
  });

  return updatedDelivery;
};

/**
 * Triggered when a delivery agent goes online or becomes idle.
 * Looks for the oldest pending order in the agent's city and assigns it.
 */
export const runDispatchEngineForAgent = async (
  agentId: string | Types.ObjectId,
): Promise<IDeliveryAssignmentDocument | null> => {
  const agent = await DeliveryAgentModel.findOne({
    _id: agentId,
    availabilityStatus: 'online',
    isActive: true,
    isVerified: true,
    isDeleted: false,
    currentAssignmentId: null,
  }).exec();

  if (!agent || !agent.cityId) {
    return null;
  }

  // Fetch oldest pending delivery in the agent's city
  const pendingDeliveries = await DeliveryAssignmentModel.find({
    cityId: agent.cityId,
    deliveryStatus: 'pending_assignment',
  })
    .sort({ createdAt: 1 })
    .limit(1)
    .exec();

  if (pendingDeliveries.length === 0) {
    return null;
  }

  const delivery = pendingDeliveries[0];
  if (!delivery) {
    return null;
  }

  // Try to lock the agent atomically
  const lockedAgent = await DeliveryAgentModel.findOneAndUpdate(
    {
      _id: agent._id,
      currentAssignmentId: null,
      availabilityStatus: 'online',
      isActive: true,
      isVerified: true,
      isDeleted: false,
    },
    { $set: { currentAssignmentId: delivery._id } },
    { new: true },
  ).exec();

  if (!lockedAgent) {
    return null;
  }

  // Atomically lock and update delivery assignment
  const updatedDelivery = await DeliveryAssignmentModel.findOneAndUpdate(
    {
      _id: delivery._id,
      deliveryStatus: 'pending_assignment',
    },
    {
      $set: {
        deliveryAgentId: lockedAgent._id,
        deliveryStatus: 'assigned',
        assignedAt: new Date(),
      },
      $push: {
        timeline: {
          actorType: 'system',
          actorId: null,
          fromStatus: 'pending_assignment',
          toStatus: 'assigned',
          reason: 'Auto-assigned on agent status change (online/idle)',
        },
      },
    },
    { new: true },
  ).exec();

  if (!updatedDelivery) {
    // Rollback agent assignment
    await DeliveryAgentModel.updateOne(
      { _id: lockedAgent._id, currentAssignmentId: delivery._id },
      { $set: { currentAssignmentId: null } },
    ).exec();
    return null;
  }

  // Asynchronously trigger notification placeholder publishing
  publishDeliveryNotificationPlaceholders(updatedDelivery, 'assigned').catch((err) => {
    console.error('Failed to trigger agent online assignment notification:', err);
  });

  return updatedDelivery;
};

/**
 * Mark a delivery assignment as arrived_at_store.
 */
export const markArrivedAtStore = async (
  deliveryId: string | Types.ObjectId,
  agentId: string | Types.ObjectId,
): Promise<IDeliveryAssignmentDocument> => {
  const delivery = await findDeliveryAssignmentById(deliveryId);
  if (!delivery) {
    throw new AppError({
      message: 'Delivery assignment not found',
      statusCode: HTTP_STATUS.NOT_FOUND,
      errorCode: ERROR_CODES.DELIVERY_ASSIGNMENT_NOT_FOUND,
    });
  }

  // Validate agent ownership
  if (!delivery.deliveryAgentId || delivery.deliveryAgentId.toString() !== agentId.toString()) {
    throw new AppError({
      message: 'Authenticated agent is not the assigned agent for this delivery',
      statusCode: HTTP_STATUS.FORBIDDEN,
      errorCode: ERROR_CODES.DELIVERY_AGENT_NOT_ASSIGNED_TO_ORDER,
    });
  }

  // Check terminal state lockout
  const terminalStates = ['delivered', 'failed', 'cancelled'];
  if (terminalStates.includes(delivery.deliveryStatus)) {
    throw new AppError({
      message: 'Delivery has already reached a terminal state',
      statusCode: HTTP_STATUS.CONFLICT,
      errorCode: ERROR_CODES.DELIVERY_ALREADY_COMPLETED,
    });
  }

  // Sequence check: must be en_route_to_store
  if (delivery.deliveryStatus !== 'en_route_to_store') {
    throw new AppError({
      message: 'Requested delivery state change is not allowed',
      statusCode: HTTP_STATUS.CONFLICT,
      errorCode: ERROR_CODES.DELIVERY_INVALID_STATE_TRANSITION,
    });
  }

  // Mutate
  const updated = await updateDeliveryAssignmentStatus(
    deliveryId,
    'arrived_at_store',
    {},
    {
      actorType: 'delivery_agent',
      actorId: new Types.ObjectId(agentId.toString()),
      fromStatus: 'en_route_to_store',
      toStatus: 'arrived_at_store',
      reason: 'Rider registered arrival at store',
    },
  );

  if (!updated) {
    throw new AppError({
      message: 'Failed to update delivery assignment status',
      statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR,
      errorCode: ERROR_CODES.INTERNAL_SERVER_ERROR,
    });
  }

  return updated;
};

/**
 * Mark a delivery assignment as picked_up.
 */
export const markPickedUp = async (
  deliveryId: string | Types.ObjectId,
  agentId: string | Types.ObjectId,
  verificationData?: IPickupVerificationData,
): Promise<IDeliveryAssignmentDocument> => {
  const delivery = await findDeliveryAssignmentById(deliveryId);
  if (!delivery) {
    throw new AppError({
      message: 'Delivery assignment not found',
      statusCode: HTTP_STATUS.NOT_FOUND,
      errorCode: ERROR_CODES.DELIVERY_ASSIGNMENT_NOT_FOUND,
    });
  }

  // Validate agent ownership
  if (!delivery.deliveryAgentId || delivery.deliveryAgentId.toString() !== agentId.toString()) {
    throw new AppError({
      message: 'Authenticated agent is not the assigned agent for this delivery',
      statusCode: HTTP_STATUS.FORBIDDEN,
      errorCode: ERROR_CODES.DELIVERY_AGENT_NOT_ASSIGNED_TO_ORDER,
    });
  }

  // Check terminal state lockout
  const terminalStates = ['delivered', 'failed', 'cancelled'];
  if (terminalStates.includes(delivery.deliveryStatus)) {
    throw new AppError({
      message: 'Delivery has already reached a terminal state',
      statusCode: HTTP_STATUS.CONFLICT,
      errorCode: ERROR_CODES.DELIVERY_ALREADY_COMPLETED,
    });
  }

  // Sequence check: must be arrived_at_store
  if (delivery.deliveryStatus !== 'arrived_at_store') {
    throw new AppError({
      message: 'Requested delivery state change is not allowed',
      statusCode: HTTP_STATUS.CONFLICT,
      errorCode: ERROR_CODES.DELIVERY_INVALID_STATE_TRANSITION,
    });
  }

  // Format reason or comments with verification data placeholder info
  let reason = 'Order goods picked up';
  if (verificationData && verificationData.verificationMethod) {
    reason += `; verification: ${verificationData.verificationMethod}`;
  }

  // Mutate
  const updated = await updateDeliveryAssignmentStatus(
    deliveryId,
    'picked_up',
    {},
    {
      actorType: 'delivery_agent',
      actorId: new Types.ObjectId(agentId.toString()),
      fromStatus: 'arrived_at_store',
      toStatus: 'picked_up',
      reason,
    },
  );

  if (!updated) {
    throw new AppError({
      message: 'Failed to update delivery assignment status',
      statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR,
      errorCode: ERROR_CODES.INTERNAL_SERVER_ERROR,
    });
  }

  return updated;
};
