import type { Request, Response } from 'express';

import { AppError } from '../../../errors/AppError';
import { ERROR_CODES } from '../../../errors/error-codes';
import { sendSuccessResponse } from '../../../utils/api-response';
import { asyncHandler } from '../../../utils/async-handler';
import { HTTP_STATUS } from '../../../utils/http-status';
import {
  endAdminControlSession,
  heartbeatAdminControlSession,
  listActiveAdminControlSessions,
  startAdminControlSession,
} from '../services/admin-control-session.service';
import type { CreateAdminControlSessionInput } from '../types/admin-control-session.types';

const requireAdminUserId = (req: Request): string => {
  const adminId = req.user?.userId;
  if (!adminId) {
    throw new AppError({
      message: 'Admin user context is required',
      statusCode: HTTP_STATUS.UNAUTHORIZED,
      errorCode: ERROR_CODES.UNAUTHORIZED,
    });
  }

  return adminId;
};

export const startAdminControlSessionController = asyncHandler(
  async (req: Request, res: Response) => {
    const adminId = requireAdminUserId(req);
    const session = await startAdminControlSession({
      ...(req.body as Omit<CreateAdminControlSessionInput, 'adminId'>),
      adminId,
    });

    return sendSuccessResponse({
      res,
      message: 'Admin control session started successfully',
      data: session,
      statusCode: HTTP_STATUS.CREATED,
    });
  },
);

export const endAdminControlSessionController = asyncHandler(
  async (req: Request, res: Response) => {
    const { sessionId } = req.body as { sessionId: string };
    const session = await endAdminControlSession(sessionId);

    return sendSuccessResponse({
      res,
      message: 'Admin control session ended successfully',
      data: session,
    });
  },
);

export const heartbeatAdminControlSessionController = asyncHandler(
  async (req: Request, res: Response) => {
    const { sessionId } = req.body as { sessionId: string };
    const session = await heartbeatAdminControlSession(sessionId);

    return sendSuccessResponse({
      res,
      message: 'Admin control session heartbeat updated successfully',
      data: session,
    });
  },
);

export const listActiveAdminControlSessionsController = asyncHandler(
  async (_req: Request, res: Response) => {
    const sessions = await listActiveAdminControlSessions();

    return sendSuccessResponse({
      res,
      message: 'Active admin control sessions fetched successfully',
      data: sessions,
    });
  },
);
