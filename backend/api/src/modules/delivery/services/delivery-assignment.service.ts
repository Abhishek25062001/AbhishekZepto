import { Types } from 'mongoose';
import { AppError } from '../../../errors/AppError';
import { env } from '../../../config/env';
import { ERROR_CODES } from '../../../errors/error-codes';
import { HTTP_STATUS } from '../../../utils/http-status';
import { DeliveryAgentModel } from '../models/delivery-agent.model';
import { DeliveryAssignmentModel } from '../models/delivery-assignment.model';
import {
  createDeliveryAssignment,
  findDeliveryAssignmentById,
  findDeliveryAssignmentByOrderId,
  findDeliveryAssignmentsPaginated,
  updateDeliveryAssignmentStatus,
} from '../repositories/delivery-assignment.repository';
import { findDeliveryAgentById } from '../repositories/delivery-agent.repository';
import { findOrderById } from '../../orders/repositories/order.repository';
import { findStoreById } from '../../stores/repositories/store.repository';
import { transitionOrderById } from '../../orders/repositories/order.repository';
import { ORDER_STATUS } from '../../orders/constants/order-status.constant';
import {
  publishAssignmentCreated,
  publishDeliveryCompleted,
  publishDeliveryFailed,
  publishDeliveryLocationUpdated,
  publishDeliveryReachedCustomer,
  publishOutForDelivery,
  publishPickupCompleted,
} from '../../internal-events/publishers/delivery-event.publisher';
import {
  publishOrderDelivered,
  publishOrderOutForDelivery,
} from '../../internal-events/publishers/order-event.publisher';
import { areInternalEventSubscribersRegistered } from '../../internal-events/services/internal-event-registry.service';
import { publishDeliveryNotificationPlaceholders } from './delivery-notification.service';
import {
  emitAssignmentCreated,
  emitDeliveryCompleted,
  emitDeliveryLocationUpdated,
  emitDeliveryProgressUpdated,
  emitPickupCompleted,
} from '../../realtime/services/realtime-emitter.service';
import type {
  IDeliveryAssignmentDocument,
  IPickupVerificationData,
  AdminDeliveryListQuery,
  AdminDeliveryListItem,
  AdminDeliveryOverrideBody,
  AdminDeliveryDetailResponse,
} from '../types/delivery-assignment.types';

const shouldRunLegacyDeliverySideEffects = (): boolean =>
  !areInternalEventSubscribersRegistered();

const toLocationNumber = (value: unknown): number | null => {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }

  return null;
};

const getLocationUpdatedAt = (delivery: unknown): Date | null => {
  if (!delivery || typeof delivery !== 'object') {
    return null;
  }

  const value = (delivery as { lastLocationUpdatedAt?: unknown; updatedAt?: unknown })
    .lastLocationUpdatedAt ?? (delivery as { updatedAt?: unknown }).updatedAt;

  return value instanceof Date ? value : null;
};

const shouldEmitDeliveryLocationEvent = (
  previousDelivery: unknown,
  updatedDelivery: unknown,
): boolean => {
  if (!previousDelivery || typeof previousDelivery !== 'object') {
    return true;
  }

  if (!updatedDelivery || typeof updatedDelivery !== 'object') {
    return true;
  }

  const previous = previousDelivery as { currentLatitude?: unknown; currentLongitude?: unknown };
  const updated = updatedDelivery as { currentLatitude?: unknown; currentLongitude?: unknown };
  const previousLatitude = toLocationNumber(previous.currentLatitude);
  const previousLongitude = toLocationNumber(previous.currentLongitude);
  const updatedLatitude = toLocationNumber(updated.currentLatitude);
  const updatedLongitude = toLocationNumber(updated.currentLongitude);

  if (
    previousLatitude === null ||
    previousLongitude === null ||
    updatedLatitude === null ||
    updatedLongitude === null ||
    previousLatitude !== updatedLatitude ||
    previousLongitude !== updatedLongitude
  ) {
    return true;
  }

  const previousLocationUpdatedAt = getLocationUpdatedAt(previousDelivery);
  const updatedLocationUpdatedAt = getLocationUpdatedAt(updatedDelivery);
  if (!previousLocationUpdatedAt || !updatedLocationUpdatedAt) {
    return true;
  }

  const elapsedMs = updatedLocationUpdatedAt.getTime() - previousLocationUpdatedAt.getTime();
  return elapsedMs >= env.DELIVERY_LOCATION_EMIT_MIN_INTERVAL_SECONDS * 1_000;
};

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

  publishAssignmentCreated(updatedDelivery);
  if (shouldRunLegacyDeliverySideEffects()) {
    publishDeliveryNotificationPlaceholders(updatedDelivery, 'assigned').catch((err) => {
      console.error('Failed to trigger assignment notification:', err);
    });
    emitAssignmentCreated(updatedDelivery);
  }

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

  publishAssignmentCreated(updatedDelivery);
  if (shouldRunLegacyDeliverySideEffects()) {
    publishDeliveryNotificationPlaceholders(updatedDelivery, 'assigned').catch((err) => {
      console.error('Failed to trigger agent online assignment notification:', err);
    });
    emitAssignmentCreated(updatedDelivery);
  }

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

  publishDeliveryNotificationPlaceholders(updated, 'arrived_at_store').catch((err) => {
    console.error('Failed to trigger arrived_at_store notification:', err);
  });
  emitDeliveryProgressUpdated(updated);

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

  publishPickupCompleted(updated);
  if (shouldRunLegacyDeliverySideEffects()) {
    publishDeliveryNotificationPlaceholders(updated, 'picked_up').catch((err) => {
      console.error('Failed to trigger picked_up notification:', err);
    });
    emitPickupCompleted(updated);
  }
  emitDeliveryProgressUpdated(updated);

  return updated;
};

/**
 * Mark a delivery assignment as en_route_to_customer.
 * Pre-condition: current status must be picked_up.
 */
export const markEnRouteToCustomer = async (
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

  // Sequence check: must be picked_up
  if (delivery.deliveryStatus !== 'picked_up') {
    throw new AppError({
      message: 'Requested delivery state change is not allowed',
      statusCode: HTTP_STATUS.CONFLICT,
      errorCode: ERROR_CODES.DELIVERY_INVALID_STATE_TRANSITION,
    });
  }

  const updated = await updateDeliveryAssignmentStatus(
    deliveryId,
    'en_route_to_customer',
    {},
    {
      actorType: 'delivery_agent',
      actorId: new Types.ObjectId(agentId.toString()),
      fromStatus: 'picked_up',
      toStatus: 'en_route_to_customer',
      reason: 'Agent started en-route to customer',
    },
  );

  if (!updated) {
    throw new AppError({
      message: 'Failed to update delivery assignment status',
      statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR,
      errorCode: ERROR_CODES.INTERNAL_SERVER_ERROR,
    });
  }

  publishOutForDelivery(updated);
  publishOrderOutForDelivery({
    _id: updated.orderId,
    customerId: updated.customerId,
    storeId: updated.storeId,
    cityId: updated.cityId,
    orderStatus: ORDER_STATUS.SHIPPED,
    paymentStatus: null,
    updatedAt: updated.updatedAt,
  });
  emitDeliveryLocationUpdated(updated);
  emitDeliveryProgressUpdated(updated);

  return updated;
};

/**
 * Mark a delivery assignment as arrived_at_customer.
 * Pre-condition: current status must be en_route_to_customer.
 */
export const markArrivedAtCustomer = async (
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

  // Sequence check: must be en_route_to_customer
  if (delivery.deliveryStatus !== 'en_route_to_customer') {
    throw new AppError({
      message: 'Requested delivery state change is not allowed',
      statusCode: HTTP_STATUS.CONFLICT,
      errorCode: ERROR_CODES.DELIVERY_INVALID_STATE_TRANSITION,
    });
  }

  const updated = await updateDeliveryAssignmentStatus(
    deliveryId,
    'arrived_at_customer',
    {},
    {
      actorType: 'delivery_agent',
      actorId: new Types.ObjectId(agentId.toString()),
      fromStatus: 'en_route_to_customer',
      toStatus: 'arrived_at_customer',
      reason: 'Agent arrived at customer delivery address',
    },
  );

  if (!updated) {
    throw new AppError({
      message: 'Failed to update delivery assignment status',
      statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR,
      errorCode: ERROR_CODES.INTERNAL_SERVER_ERROR,
    });
  }

  publishDeliveryNotificationPlaceholders(updated, 'arrived_at_customer').catch((err) => {
    console.error('Failed to trigger arrived_at_customer notification:', err);
  });
  publishDeliveryReachedCustomer(updated);
  if (shouldEmitDeliveryLocationEvent(delivery, updated)) {
    publishDeliveryLocationUpdated(updated);
    if (shouldRunLegacyDeliverySideEffects()) {
      emitDeliveryLocationUpdated(updated);
    }
  }
  emitDeliveryProgressUpdated(updated);

  return updated;
};

/**
 * Mark a delivery assignment as delivered.
 * Pre-condition: current status must be arrived_at_customer.
 * Idempotent: returns success on already delivered state.
 */
export const markDelivered = async (
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

  // Idempotency: if already delivered, return success instantly
  if (delivery.deliveryStatus === 'delivered') {
    return delivery;
  }

  // Check terminal state lockout
  const terminalStates = ['failed', 'cancelled'];
  if (terminalStates.includes(delivery.deliveryStatus)) {
    throw new AppError({
      message: 'Delivery has already reached a terminal state',
      statusCode: HTTP_STATUS.CONFLICT,
      errorCode: ERROR_CODES.DELIVERY_ALREADY_COMPLETED,
    });
  }

  // Sequence check: must be arrived_at_customer
  if (delivery.deliveryStatus !== 'arrived_at_customer') {
    throw new AppError({
      message: 'Requested delivery state change is not allowed',
      statusCode: HTTP_STATUS.CONFLICT,
      errorCode: ERROR_CODES.DELIVERY_INVALID_STATE_TRANSITION,
    });
  }

  let reason = 'Order goods delivered to customer';
  if (verificationData && verificationData.verificationMethod) {
    reason += `; verification: ${verificationData.verificationMethod}`;
  }

  // Update delivery status to delivered
  const updated = await updateDeliveryAssignmentStatus(
    deliveryId,
    'delivered',
    { completedAt: new Date(), deliveredAt: new Date() },
    {
      actorType: 'delivery_agent',
      actorId: new Types.ObjectId(agentId.toString()),
      fromStatus: 'arrived_at_customer',
      toStatus: 'delivered',
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

  // Sync to Order status
  const orderTimelineEvent = {
    event: 'delivery_completed',
    fromStatus: ORDER_STATUS.READY_FOR_PICKUP,
    toStatus: ORDER_STATUS.DELIVERED,
    actorId: new Types.ObjectId(agentId.toString()),
    actorType: 'system' as const,
    actorRole: 'delivery_agent',
    reason: 'Rider confirmed package handover',
    createdAt: new Date(),
  };

  const deliveredOrder = await transitionOrderById(
    delivery.orderId.toString(),
    { orderStatus: ORDER_STATUS.DELIVERED },
    orderTimelineEvent,
  );
  if (deliveredOrder) {
    publishOrderDelivered(deliveredOrder);
  }

  // Release the agent
  await DeliveryAgentModel.updateOne(
    { _id: new Types.ObjectId(agentId.toString()) },
    { $set: { currentAssignmentId: null } },
  );

  publishDeliveryCompleted(updated);
  if (shouldRunLegacyDeliverySideEffects()) {
    publishDeliveryNotificationPlaceholders(updated, 'delivered').catch((err) => {
      console.error('Failed to trigger delivered notification:', err);
    });
    emitDeliveryCompleted(updated);
  }
  emitDeliveryProgressUpdated(updated);

  return updated;
};

/**
 * Mark a delivery assignment as failed.
 * Pre-condition: current status must be one of picked_up, en_route_to_customer, arrived_at_customer.
 */
export const markFailed = async (
  deliveryId: string | Types.ObjectId,
  agentId: string | Types.ObjectId,
  failureReason: string,
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

  // Sequence check: must be picked_up, en_route_to_customer, or arrived_at_customer
  const allowedPreceding = ['picked_up', 'en_route_to_customer', 'arrived_at_customer'];
  if (!allowedPreceding.includes(delivery.deliveryStatus)) {
    throw new AppError({
      message: 'Requested delivery state change is not allowed',
      statusCode: HTTP_STATUS.CONFLICT,
      errorCode: ERROR_CODES.DELIVERY_INVALID_STATE_TRANSITION,
    });
  }

  // Update delivery status to failed
  const updated = await updateDeliveryAssignmentStatus(
    deliveryId,
    'failed',
    { failedAt: new Date(), failureReason },
    {
      actorType: 'delivery_agent',
      actorId: new Types.ObjectId(agentId.toString()),
      fromStatus: delivery.deliveryStatus,
      toStatus: 'failed',
      reason: `Delivery attempt failed: ${failureReason}`,
    },
  );

  if (!updated) {
    throw new AppError({
      message: 'Failed to update delivery assignment status',
      statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR,
      errorCode: ERROR_CODES.INTERNAL_SERVER_ERROR,
    });
  }

  // Sync to Order status
  const orderTimelineEvent = {
    event: 'delivery_failed',
    fromStatus: ORDER_STATUS.READY_FOR_PICKUP,
    toStatus: ORDER_STATUS.FAILED,
    actorId: new Types.ObjectId(agentId.toString()),
    actorType: 'system' as const,
    actorRole: 'delivery_agent',
    reason: `Delivery failed: ${failureReason}`,
    createdAt: new Date(),
  };

  await transitionOrderById(
    delivery.orderId.toString(),
    { orderStatus: ORDER_STATUS.FAILED },
    orderTimelineEvent,
  );

  // Release the agent
  await DeliveryAgentModel.updateOne(
    { _id: new Types.ObjectId(agentId.toString()) },
    { $set: { currentAssignmentId: null } },
  );

  publishDeliveryFailed(updated);
  if (shouldRunLegacyDeliverySideEffects()) {
    publishDeliveryNotificationPlaceholders(updated, 'failed').catch((err) => {
      console.error('Failed to trigger failed notification:', err);
    });
  }

  return updated;
};

// ---------------------------------------------------------------------------
// Module 15 — Admin Delivery Operations Service Functions
// ---------------------------------------------------------------------------

/**
 * Fetch a paginated, filtered list of delivery assignments for the admin dashboard.
 * Returns projected AdminDeliveryListItem objects (no timeline, no customer data).
 */
export const listAdminDeliveries = async (
  query: AdminDeliveryListQuery,
): Promise<{ items: AdminDeliveryListItem[]; total: number }> => {
  const { items: rawItems, total } = await findDeliveryAssignmentsPaginated(query);

  const items: AdminDeliveryListItem[] = rawItems.map((doc) => ({
    deliveryId: doc._id.toString(),
    orderId: doc.orderId.toString(),
    storeId: doc.storeId.toString(),
    cityId: doc.cityId.toString(),
    deliveryAgentId: doc.deliveryAgentId ? doc.deliveryAgentId.toString() : null,
    deliveryStatus: doc.deliveryStatus,
    assignedAt: doc.assignedAt ? doc.assignedAt.toISOString() : null,
    pickedUpAt: doc.pickedUpAt ? doc.pickedUpAt.toISOString() : null,
    completedAt: doc.completedAt ? doc.completedAt.toISOString() : null,
    cancelledAt: doc.cancelledAt ? doc.cancelledAt.toISOString() : null,
    slaStatus: doc.slaStatus,
    slaBreachedStage: doc.slaBreachedStage,
    createdAt: doc.createdAt.toISOString(),
  }));

  return { items, total };
};

/**
 * Fetch full detail of a single delivery assignment, including the full timeline
 * and an agent snapshot (if assigned). Used by admin detail view.
 */
export const getAdminDeliveryDetail = async (
  deliveryId: string,
): Promise<AdminDeliveryDetailResponse> => {
  const delivery = await findDeliveryAssignmentById(deliveryId);
  if (!delivery) {
    throw new AppError({
      message: 'Delivery assignment not found',
      statusCode: HTTP_STATUS.NOT_FOUND,
      errorCode: ERROR_CODES.DELIVERY_ASSIGNMENT_NOT_FOUND,
    });
  }

  // Build agent snapshot if an agent is assigned
  let agentSnapshot: AdminDeliveryDetailResponse['agentSnapshot'] = null;
  if (delivery.deliveryAgentId) {
    const agent = await findDeliveryAgentById(delivery.deliveryAgentId.toString());
    if (agent) {
      agentSnapshot = {
        name: agent.name,
        phone: agent.phone,
        vehicleType: agent.vehicleType,
        vehicleNumber: agent.vehicleNumber ?? null,
        profilePhotoUrl: agent.profilePhotoUrl ?? null,
      };
    }
  }

  const detail: AdminDeliveryDetailResponse = {
    deliveryId: delivery._id.toString(),
    orderId: delivery.orderId.toString(),
    customerId: delivery.customerId.toString(),
    storeId: delivery.storeId.toString(),
    cityId: delivery.cityId.toString(),
    deliveryAgentId: delivery.deliveryAgentId ? delivery.deliveryAgentId.toString() : null,
    deliveryStatus: delivery.deliveryStatus,
    assignedAt: delivery.assignedAt ? delivery.assignedAt.toISOString() : null,
    arrivedAtStoreAt: delivery.arrivedAtStoreAt ? delivery.arrivedAtStoreAt.toISOString() : null,
    pickedUpAt: delivery.pickedUpAt ? delivery.pickedUpAt.toISOString() : null,
    enRouteToCustomerAt: delivery.enRouteToCustomerAt ? delivery.enRouteToCustomerAt.toISOString() : null,
    arrivedAtCustomerAt: delivery.arrivedAtCustomerAt ? delivery.arrivedAtCustomerAt.toISOString() : null,
    completedAt: delivery.completedAt ? delivery.completedAt.toISOString() : null,
    deliveredAt: delivery.deliveredAt ? delivery.deliveredAt.toISOString() : null,
    failedAt: delivery.failedAt ? delivery.failedAt.toISOString() : null,
    failureReason: delivery.failureReason ?? null,
    cancelledAt: delivery.cancelledAt ? delivery.cancelledAt.toISOString() : null,
    cancellationReason: delivery.cancellationReason ?? null,
    timeline: delivery.timeline.map((event) => ({
      actorType: event.actorType,
      actorId: event.actorId ? event.actorId.toString() : null,
      fromStatus: event.fromStatus,
      toStatus: event.toStatus,
      reason: event.reason ?? null,
      createdAt: event.createdAt.toISOString(),
    })),
    createdAt: delivery.createdAt.toISOString(),
    updatedAt: delivery.updatedAt.toISOString(),
    agentSnapshot,
    slaStatus: delivery.slaStatus,
    slaBreachedStage: delivery.slaBreachedStage,
    slaBreachedAt: delivery.slaBreachedAt ? delivery.slaBreachedAt.toISOString() : null,
    slaAssignmentDeadline: delivery.slaAssignmentDeadline ? delivery.slaAssignmentDeadline.toISOString() : null,
    slaPickupDeadline: delivery.slaPickupDeadline ? delivery.slaPickupDeadline.toISOString() : null,
    slaDropDeadline: delivery.slaDropDeadline ? delivery.slaDropDeadline.toISOString() : null,
    slaTotalDeadline: delivery.slaTotalDeadline ? delivery.slaTotalDeadline.toISOString() : null,
  };

  return detail;
};

/**
 * Admin override of a delivery assignment state.
 * Only 'cancelled' and 'failed' are allowed target statuses.
 * Writes an admin actor timeline event for full auditability.
 */
export const adminOverrideDelivery = async (
  deliveryId: string | Types.ObjectId,
  adminUserId: string | Types.ObjectId,
  body: AdminDeliveryOverrideBody,
): Promise<IDeliveryAssignmentDocument> => {
  const delivery = await findDeliveryAssignmentById(deliveryId);
  if (!delivery) {
    throw new AppError({
      message: 'Delivery assignment not found',
      statusCode: HTTP_STATUS.NOT_FOUND,
      errorCode: ERROR_CODES.DELIVERY_ASSIGNMENT_NOT_FOUND,
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

  // Sequence check: admin override can only transition to cancelled or failed
  if (body.targetStatus !== 'cancelled' && body.targetStatus !== 'failed') {
    throw new AppError({
      message: 'Requested delivery state change is not allowed',
      statusCode: HTTP_STATUS.CONFLICT,
      errorCode: ERROR_CODES.DELIVERY_INVALID_STATE_TRANSITION,
    });
  }

  // Build additional update fields based on target status
  const updateFields: Partial<IDeliveryAssignmentDocument> = {};
  if (body.targetStatus === 'cancelled') {
    (updateFields as Record<string, unknown>).cancellationReason = body.reason;
  } else {
    (updateFields as Record<string, unknown>).failureReason = body.reason;
  }

  const updated = await updateDeliveryAssignmentStatus(
    deliveryId,
    body.targetStatus,
    updateFields,
    {
      actorType: 'admin',
      actorId: new Types.ObjectId(adminUserId),
      fromStatus: delivery.deliveryStatus,
      toStatus: body.targetStatus,
      reason: body.reason,
    },
  );

  if (!updated) {
    throw new AppError({
      message: 'Failed to apply delivery override',
      statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR,
      errorCode: ERROR_CODES.INTERNAL_SERVER_ERROR,
    });
  }

  publishDeliveryNotificationPlaceholders(updated, updated.deliveryStatus).catch((err) => {
    console.error(`Failed to trigger override ${updated.deliveryStatus} notification:`, err);
  });

  return updated;
};
