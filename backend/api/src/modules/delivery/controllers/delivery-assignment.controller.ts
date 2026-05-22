import type { Request, Response } from 'express';
import { asyncHandler } from '../../../utils/async-handler';
import { sendSuccessResponse } from '../../../utils/api-response';
import { AppError } from '../../../errors/AppError';
import { ERROR_CODES } from '../../../errors/error-codes';
import { HTTP_STATUS } from '../../../utils/http-status';
import {
  findDeliveryAssignmentById,
  findPendingAssignmentsByCity,
} from '../repositories/delivery-assignment.repository';
import { DeliveryAssignmentModel } from '../models/delivery-assignment.model';
import {
  runDispatchEngineForOrder,
  markArrivedAtStore,
  markPickedUp,
} from '../services/delivery-assignment.service';

/**
 * POST /api/v1/admin/deliveries/:deliveryId/dispatch
 *
 * Manually trigger the dispatch engine for a specific pending order.
 */
export const manualDispatchController = asyncHandler(async (req: Request, res: Response) => {
  const { deliveryId } = req.params as { deliveryId: string };

  const delivery = await findDeliveryAssignmentById(deliveryId);
  if (!delivery) {
    throw new AppError({
      message: 'Delivery assignment not found',
      statusCode: HTTP_STATUS.NOT_FOUND,
      errorCode: ERROR_CODES.DELIVERY_ASSIGNMENT_NOT_FOUND,
    });
  }

  // Terminal states (delivered, failed, cancelled) should block dispatch.
  const terminalStates = ['delivered', 'failed', 'cancelled'];
  if (terminalStates.includes(delivery.deliveryStatus)) {
    throw new AppError({
      message: 'Delivery has already reached a terminal state',
      statusCode: HTTP_STATUS.CONFLICT,
      errorCode: ERROR_CODES.DELIVERY_ALREADY_COMPLETED,
    });
  }

  const updated = await runDispatchEngineForOrder(deliveryId);

  return sendSuccessResponse({
    res,
    message: 'Dispatch execution completed',
    data: {
      deliveryId: updated?._id ? updated._id.toString() : deliveryId,
      status: updated?.deliveryStatus ?? delivery.deliveryStatus,
      assignedAgentId: updated?.deliveryAgentId ? updated.deliveryAgentId.toString() : null,
    },
  });
});

/**
 * GET /api/v1/admin/deliveries/pending
 *
 * List all pending unassigned deliveries. If cityId is provided in query, filter by it.
 */
export const listPendingDeliveriesController = asyncHandler(async (req: Request, res: Response) => {
  const { cityId } = req.query as { cityId?: string };

  let list;
  if (cityId) {
    list = await findPendingAssignmentsByCity(cityId);
  } else {
    list = await DeliveryAssignmentModel.find({
      deliveryStatus: 'pending_assignment',
    })
      .sort({ createdAt: 1 })
      .exec();
  }

  return sendSuccessResponse({
    res,
    message: 'Pending deliveries queue fetched successfully',
    data: list,
  });
});

/**
 * POST /api/v1/delivery/assignments/:assignmentId/arrived-at-store
 *
 * Mark a delivery assignment as arrived at the store.
 */
export const agentArrivedAtStoreController = asyncHandler(async (req: Request, res: Response) => {
  const { assignmentId } = req.params as { assignmentId: string };
  const agentId = req.deliveryAgentId as string;

  if (!agentId) {
    throw new AppError({
      message: 'Unauthenticated. Delivery agent ID not found in request context.',
      statusCode: HTTP_STATUS.UNAUTHORIZED,
      errorCode: ERROR_CODES.UNAUTHORIZED,
    });
  }

  const updated = await markArrivedAtStore(assignmentId, agentId);

  return sendSuccessResponse({
    res,
    message: 'Registered arrival at store successfully',
    data: updated,
  });
});

/**
 * POST /api/v1/delivery/assignments/:assignmentId/picked-up
 *
 * Mark a delivery assignment as picked up from the store.
 */
export const agentPickedUpController = asyncHandler(async (req: Request, res: Response) => {
  const { assignmentId } = req.params as { assignmentId: string };
  const agentId = req.deliveryAgentId as string;

  if (!agentId) {
    throw new AppError({
      message: 'Unauthenticated. Delivery agent ID not found in request context.',
      statusCode: HTTP_STATUS.UNAUTHORIZED,
      errorCode: ERROR_CODES.UNAUTHORIZED,
    });
  }

  const updated = await markPickedUp(assignmentId, agentId, req.body);

  return sendSuccessResponse({
    res,
    message: 'Registered package pickup successfully',
    data: updated,
  });
});

