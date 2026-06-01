import type { Request, Response } from 'express';

import { sendSuccessResponse } from '../../../utils/api-response';
import { asyncHandler } from '../../../utils/async-handler';
import {
  createAdminUser,
  getAdminUser,
  listAdminUserAudit,
  listAdminUserSummaries,
  updateAdminUser,
  updateAdminUserPermissions,
  updateAdminUserRole,
  updateAdminUserStatus,
} from '../services/admin-user.service';

const auditContext = (req: Request, reason?: string | null) => ({
  actorAdminId: req.user?.userId ?? null,
  reason: reason ?? null,
  ipAddress: req.ip ?? null,
  deviceInfo: req.get('user-agent') ?? null,
});

const actorId = (req: Request): string | null => req.user?.userId ?? null;

export const createAdminUserController = asyncHandler(
  async (req: Request, res: Response) => {
    const input = {
      ...(req.body as Parameters<typeof createAdminUser>[0]),
      createdBy: actorId(req),
    };
    const result = await createAdminUser(input, auditContext(req, 'Admin user created'));

    return sendSuccessResponse({
      res,
      statusCode: 201,
      message: 'Admin user created successfully',
      data: result,
    });
  },
);

export const listAdminUsersController = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await listAdminUserSummaries(req.query as unknown as Parameters<typeof listAdminUserSummaries>[0]);

    return sendSuccessResponse({
      res,
      message: 'Admin users fetched successfully',
      data: result,
    });
  },
);

export const getAdminUserController = asyncHandler(
  async (req: Request, res: Response) => {
    const { adminUserId } = req.params as { adminUserId: string };
    const result = await getAdminUser(adminUserId);

    return sendSuccessResponse({
      res,
      message: 'Admin user fetched successfully',
      data: result,
    });
  },
);

export const updateAdminUserController = asyncHandler(
  async (req: Request, res: Response) => {
    const { adminUserId } = req.params as { adminUserId: string };
    const result = await updateAdminUser({
      adminUserId,
      input: {
        ...(req.body as Record<string, unknown>),
        updatedBy: actorId(req),
      },
      audit: auditContext(req, 'Admin user updated'),
    });

    return sendSuccessResponse({
      res,
      message: 'Admin user updated successfully',
      data: result,
    });
  },
);

export const updateAdminUserStatusController = asyncHandler(
  async (req: Request, res: Response) => {
    const { adminUserId } = req.params as { adminUserId: string };
    const { status, reason } = req.body as { status: string; reason: string };
    const result = await updateAdminUserStatus({
      adminUserId,
      status,
      updatedBy: actorId(req),
      reason,
      audit: auditContext(req, reason),
    });

    return sendSuccessResponse({
      res,
      message: 'Admin user status updated successfully',
      data: result,
    });
  },
);

export const updateAdminUserRoleController = asyncHandler(
  async (req: Request, res: Response) => {
    const { adminUserId } = req.params as { adminUserId: string };
    const { role, reason } = req.body as {
      role: Parameters<typeof updateAdminUserRole>[0]['role'];
      reason: string;
    };
    const result = await updateAdminUserRole({
      adminUserId,
      role,
      updatedBy: actorId(req),
      reason,
      audit: auditContext(req, reason),
    });

    return sendSuccessResponse({
      res,
      message: 'Admin user role updated successfully',
      data: result,
    });
  },
);

export const updateAdminUserPermissionsController = asyncHandler(
  async (req: Request, res: Response) => {
    const { adminUserId } = req.params as { adminUserId: string };
    const { permissions, reason } = req.body as { permissions: string[]; reason: string };
    const result = await updateAdminUserPermissions({
      adminUserId,
      permissions,
      updatedBy: actorId(req),
      reason,
      audit: auditContext(req, reason),
    });

    return sendSuccessResponse({
      res,
      message: 'Admin user permissions updated successfully',
      data: result,
    });
  },
);

export const listAdminUserAuditController = asyncHandler(
  async (req: Request, res: Response) => {
    const { adminUserId } = req.params as { adminUserId: string };
    const result = await listAdminUserAudit(adminUserId);

    return sendSuccessResponse({
      res,
      message: 'Admin user audit fetched successfully',
      data: result,
    });
  },
);
