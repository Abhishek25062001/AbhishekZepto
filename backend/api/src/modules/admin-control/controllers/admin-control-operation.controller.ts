import type { Request, Response } from 'express';

import { AppError } from '../../../errors/AppError';
import { ERROR_CODES } from '../../../errors/error-codes';
import { sendSuccessResponse } from '../../../utils/api-response';
import { asyncHandler } from '../../../utils/async-handler';
import { HTTP_STATUS } from '../../../utils/http-status';
import {
  escalateSla,
  forceAgentOffline,
  forceAssignAgent,
  forceCancelOrder,
  forceCloseStore,
  reopenStore,
  restoreAgentOnline,
  unassignAgent,
} from '../services/admin-control-operations.service';
import type { AdminControlActor } from '../types/admin-control-operation.types';

const getActor = (req: Request): AdminControlActor => {
  const adminId = req.user?.userId;
  if (!adminId) {
    throw new AppError({
      message: 'Admin user context is required',
      statusCode: HTTP_STATUS.UNAUTHORIZED,
      errorCode: ERROR_CODES.UNAUTHORIZED,
    });
  }

  return {
    adminId,
    role: req.user?.role ?? null,
    requestId: req.requestId ?? null,
    traceId: req.traceId ?? null,
    ipAddress: req.ip ?? null,
    deviceInfo: req.get('user-agent') ?? null,
    cityId: req.user?.cityId ?? null,
  };
};

export const forceCancelOrderController = asyncHandler(
  async (req: Request, res: Response) => {
    const { orderId } = req.params as { orderId: string };
    const result = await forceCancelOrder({
      orderId,
      reason: (req.body as { reason: string }).reason,
      actor: getActor(req),
    });

    return sendSuccessResponse({
      res,
      message: 'Order force-cancelled successfully',
      data: result,
    });
  },
);

export const forceAssignAgentController = asyncHandler(
  async (req: Request, res: Response) => {
    const { orderId } = req.params as { orderId: string };
    const body = req.body as { deliveryAgentId: string; reason: string };
    const result = await forceAssignAgent({
      orderId,
      deliveryAgentId: body.deliveryAgentId,
      reason: body.reason,
      actor: getActor(req),
    });

    return sendSuccessResponse({
      res,
      message: 'Delivery agent force-assigned successfully',
      data: result,
    });
  },
);

export const unassignAgentController = asyncHandler(
  async (req: Request, res: Response) => {
    const { orderId } = req.params as { orderId: string };
    const result = await unassignAgent({
      orderId,
      reason: (req.body as { reason: string }).reason,
      actor: getActor(req),
    });

    return sendSuccessResponse({
      res,
      message: 'Delivery agent unassigned successfully',
      data: result,
    });
  },
);

export const forceCloseStoreController = asyncHandler(
  async (req: Request, res: Response) => {
    const { storeId } = req.params as { storeId: string };
    const result = await forceCloseStore({
      storeId,
      reason: (req.body as { reason: string }).reason,
      actor: getActor(req),
    });

    return sendSuccessResponse({
      res,
      message: 'Store force-closed successfully',
      data: result,
    });
  },
);

export const reopenStoreController = asyncHandler(
  async (req: Request, res: Response) => {
    const { storeId } = req.params as { storeId: string };
    const result = await reopenStore({
      storeId,
      reason: (req.body as { reason: string }).reason,
      actor: getActor(req),
    });

    return sendSuccessResponse({
      res,
      message: 'Store reopened successfully',
      data: result,
    });
  },
);

export const forceAgentOfflineController = asyncHandler(
  async (req: Request, res: Response) => {
    const { agentId } = req.params as { agentId: string };
    const result = await forceAgentOffline({
      agentId,
      reason: (req.body as { reason: string }).reason,
      actor: getActor(req),
    });

    return sendSuccessResponse({
      res,
      message: 'Delivery agent forced offline successfully',
      data: result,
    });
  },
);

export const restoreAgentOnlineController = asyncHandler(
  async (req: Request, res: Response) => {
    const { agentId } = req.params as { agentId: string };
    const result = await restoreAgentOnline({
      agentId,
      reason: (req.body as { reason: string }).reason,
      actor: getActor(req),
    });

    return sendSuccessResponse({
      res,
      message: 'Delivery agent restored online successfully',
      data: result,
    });
  },
);

export const escalateSlaController = asyncHandler(
  async (req: Request, res: Response) => {
    const { slaId } = req.params as { slaId: string };
    const body = req.body as { reason: string; escalationLevel: number };
    const result = await escalateSla({
      slaId,
      reason: body.reason,
      escalationLevel: body.escalationLevel,
      actor: getActor(req),
    });

    return sendSuccessResponse({
      res,
      message: 'SLA escalated successfully',
      data: result,
    });
  },
);
