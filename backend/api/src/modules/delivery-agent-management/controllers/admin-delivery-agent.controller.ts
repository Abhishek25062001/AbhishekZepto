import type { Request, Response } from 'express';

import { sendSuccessResponse } from '../../../utils/api-response';
import { asyncHandler } from '../../../utils/async-handler';
import {
  getDeliveryAgentForAdmin,
  listDeliveryAgentAssignmentsForAdmin,
  listDeliveryAgentAuditForAdmin,
  listDeliveryAgentsForAdmin,
  updateDeliveryAgentStatusForAdmin,
  updateDeliveryAgentVerificationForAdmin,
} from '../services/admin-delivery-agent.service';
import type {
  DeliveryAgentManagementStatus,
  DeliveryAgentManagementVerificationStatus,
} from '../types/admin-delivery-agent-management.types';

const auditContext = (req: Request, reason?: string | null) => ({
  actorAdminId: req.user?.userId ?? null,
  reason: reason ?? null,
  ipAddress: req.ip ?? null,
  deviceInfo: req.get('user-agent') ?? null,
});

export const listDeliveryAgentsController = asyncHandler(async (req: Request, res: Response) => {
  const result = await listDeliveryAgentsForAdmin({
    ...(req.query as unknown as Parameters<typeof listDeliveryAgentsForAdmin>[0]),
    actorCityId: req.user?.cityId ?? null,
  });

  return sendSuccessResponse({
    res,
    message: 'Delivery agents fetched successfully',
    data: result,
  });
});

export const getDeliveryAgentController = asyncHandler(async (req: Request, res: Response) => {
  const { deliveryAgentId } = req.params as { deliveryAgentId: string };
  const result = await getDeliveryAgentForAdmin(deliveryAgentId, req.user?.cityId ?? null);

  return sendSuccessResponse({
    res,
    message: 'Delivery agent fetched successfully',
    data: result,
  });
});

export const listDeliveryAgentAssignmentsController = asyncHandler(async (req: Request, res: Response) => {
  const { deliveryAgentId } = req.params as { deliveryAgentId: string };
  const result = await listDeliveryAgentAssignmentsForAdmin({
    deliveryAgentId,
    ...(req.query as unknown as Omit<Parameters<typeof listDeliveryAgentAssignmentsForAdmin>[0], 'deliveryAgentId'>),
    actorCityId: req.user?.cityId ?? null,
  });

  return sendSuccessResponse({
    res,
    message: 'Delivery agent assignments fetched successfully',
    data: result,
  });
});

export const listDeliveryAgentAuditController = asyncHandler(async (req: Request, res: Response) => {
  const { deliveryAgentId } = req.params as { deliveryAgentId: string };
  const result = await listDeliveryAgentAuditForAdmin({
    deliveryAgentId,
    ...(req.query as unknown as Omit<Parameters<typeof listDeliveryAgentAuditForAdmin>[0], 'deliveryAgentId'>),
    actorCityId: req.user?.cityId ?? null,
  });

  return sendSuccessResponse({
    res,
    message: 'Delivery agent audit fetched successfully',
    data: result,
  });
});

export const updateDeliveryAgentStatusController = asyncHandler(async (req: Request, res: Response) => {
  const { deliveryAgentId } = req.params as { deliveryAgentId: string };
  const { status, reason } = req.body as { status: DeliveryAgentManagementStatus; reason: string };
  const result = await updateDeliveryAgentStatusForAdmin({
    deliveryAgentId,
    status,
    reason,
    adminId: req.user?.userId ?? null,
    actorCityId: req.user?.cityId ?? null,
    audit: auditContext(req, reason),
  });

  return sendSuccessResponse({
    res,
    message: 'Delivery agent status updated successfully',
    data: result,
  });
});

export const updateDeliveryAgentVerificationController = asyncHandler(async (req: Request, res: Response) => {
  const { deliveryAgentId } = req.params as { deliveryAgentId: string };
  const { verificationStatus, reason } = req.body as {
    verificationStatus: DeliveryAgentManagementVerificationStatus;
    reason: string;
  };
  const result = await updateDeliveryAgentVerificationForAdmin({
    deliveryAgentId,
    verificationStatus,
    reason,
    adminId: req.user?.userId ?? null,
    actorCityId: req.user?.cityId ?? null,
    audit: auditContext(req, reason),
  });

  return sendSuccessResponse({
    res,
    message: 'Delivery agent verification updated successfully',
    data: result,
  });
});
