import type { Request, Response } from 'express';

import { sendSuccessResponse } from '../../../utils/api-response';
import { asyncHandler } from '../../../utils/async-handler';
import {
  getCustomerForAdmin,
  listCustomerAddressesForAdmin,
  listCustomerAuditForAdmin,
  listCustomerOrdersForAdmin,
  listCustomersForAdmin,
  updateCustomerNotesForAdmin,
  updateCustomerStatusForAdmin,
} from '../services/customer-management.service';
import type { CustomerManagementAccountStatus } from '../types/customer-management.types';

const auditContext = (req: Request, reason?: string | null) => ({
  actorAdminId: req.user?.userId ?? null,
  reason: reason ?? null,
  ipAddress: req.ip ?? null,
  deviceInfo: req.get('user-agent') ?? null,
});

export const listCustomersController = asyncHandler(async (req: Request, res: Response) => {
  const result = await listCustomersForAdmin({
    ...(req.query as unknown as Parameters<typeof listCustomersForAdmin>[0]),
    actorCityId: req.user?.cityId ?? null,
  });
  return sendSuccessResponse({ res, message: 'Customers fetched successfully', data: result });
});

export const getCustomerController = asyncHandler(async (req: Request, res: Response) => {
  const { customerId } = req.params as { customerId: string };
  const result = await getCustomerForAdmin(customerId, req.user?.cityId ?? null);
  return sendSuccessResponse({ res, message: 'Customer fetched successfully', data: result });
});

export const updateCustomerStatusController = asyncHandler(async (req: Request, res: Response) => {
  const { customerId } = req.params as { customerId: string };
  const { status, reason } = req.body as { status: CustomerManagementAccountStatus; reason: string };
  const result = await updateCustomerStatusForAdmin({
    customerId,
    status,
    reason,
    adminId: req.user?.userId ?? null,
    actorCityId: req.user?.cityId ?? null,
    audit: auditContext(req, reason),
  });
  return sendSuccessResponse({ res, message: 'Customer status updated successfully', data: result });
});

export const updateCustomerNotesController = asyncHandler(async (req: Request, res: Response) => {
  const { customerId } = req.params as { customerId: string };
  const { adminNotes } = req.body as { adminNotes: string | null };
  const result = await updateCustomerNotesForAdmin({
    customerId,
    adminNotes,
    adminId: req.user?.userId ?? null,
    actorCityId: req.user?.cityId ?? null,
    audit: auditContext(req, 'Customer admin note updated'),
  });
  return sendSuccessResponse({ res, message: 'Customer notes updated successfully', data: result });
});

export const listCustomerOrdersController = asyncHandler(async (req: Request, res: Response) => {
  const { customerId } = req.params as { customerId: string };
  const result = await listCustomerOrdersForAdmin({
    customerId,
    ...(req.query as unknown as Omit<Parameters<typeof listCustomerOrdersForAdmin>[0], 'customerId'>),
    actorCityId: req.user?.cityId ?? null,
  });
  return sendSuccessResponse({ res, message: 'Customer orders fetched successfully', data: result });
});

export const listCustomerAddressesController = asyncHandler(async (req: Request, res: Response) => {
  const { customerId } = req.params as { customerId: string };
  const result = await listCustomerAddressesForAdmin(customerId, req.user?.cityId ?? null);
  return sendSuccessResponse({ res, message: 'Customer addresses fetched successfully', data: result });
});

export const listCustomerAuditController = asyncHandler(async (req: Request, res: Response) => {
  const { customerId } = req.params as { customerId: string };
  const result = await listCustomerAuditForAdmin(customerId, req.user?.cityId ?? null);
  return sendSuccessResponse({ res, message: 'Customer audit fetched successfully', data: result });
});
