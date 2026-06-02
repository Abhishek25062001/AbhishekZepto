import type { Request, Response } from 'express';

import { sendSuccessResponse } from '../../../utils/api-response';
import { asyncHandler } from '../../../utils/async-handler';
import {
  getStoreForAdmin,
  getVendorForAdmin,
  listStoreAuditForAdmin,
  listStoreInventoryForAdmin,
  listStoreOrdersForAdmin,
  listStoresForAdmin,
  listVendorsForAdmin,
  updateStoreStatusForAdmin,
  updateVendorStatusForAdmin,
} from '../services/admin-vendor-store.service';
import type {
  StoreManagementStatus,
  VendorManagementStatus,
} from '../types/admin-vendor-store-management.types';

const auditContext = (req: Request, reason?: string | null) => ({
  actorAdminId: req.user?.userId ?? null,
  reason: reason ?? null,
  ipAddress: req.ip ?? null,
  deviceInfo: req.get('user-agent') ?? null,
});

export const listVendorsController = asyncHandler(async (req: Request, res: Response) => {
  const result = await listVendorsForAdmin(
    {
      ...(req.query as unknown as Parameters<typeof listVendorsForAdmin>[0]),
      actorCityId: req.user?.cityId ?? null,
    },
  );

  return sendSuccessResponse({
    res,
    message: 'Vendors fetched successfully',
    data: result,
  });
});

export const getVendorController = asyncHandler(async (req: Request, res: Response) => {
  const { vendorId } = req.params as { vendorId: string };
  const result = await getVendorForAdmin(vendorId, req.user?.cityId ?? null);

  return sendSuccessResponse({
    res,
    message: 'Vendor fetched successfully',
    data: result,
  });
});

export const listStoresController = asyncHandler(async (req: Request, res: Response) => {
  const result = await listStoresForAdmin(
    {
      ...(req.query as unknown as Parameters<typeof listStoresForAdmin>[0]),
      actorCityId: req.user?.cityId ?? null,
    },
  );

  return sendSuccessResponse({
    res,
    message: 'Stores fetched successfully',
    data: result,
  });
});

export const getStoreController = asyncHandler(async (req: Request, res: Response) => {
  const { storeId } = req.params as { storeId: string };
  const result = await getStoreForAdmin(storeId, req.user?.cityId ?? null);

  return sendSuccessResponse({
    res,
    message: 'Store fetched successfully',
    data: result,
  });
});

export const updateVendorStatusController = asyncHandler(async (req: Request, res: Response) => {
  const { vendorId } = req.params as { vendorId: string };
  const { status, reason } = req.body as { status: VendorManagementStatus; reason: string };
  const result = await updateVendorStatusForAdmin({
    vendorId,
    status,
    reason,
    adminId: req.user?.userId ?? null,
    actorCityId: req.user?.cityId ?? null,
    audit: auditContext(req, reason),
  });

  return sendSuccessResponse({
    res,
    message: 'Vendor status updated successfully',
    data: result,
  });
});

export const updateStoreStatusController = asyncHandler(async (req: Request, res: Response) => {
  const { storeId } = req.params as { storeId: string };
  const { status, reason } = req.body as { status: StoreManagementStatus; reason: string };
  const result = await updateStoreStatusForAdmin({
    storeId,
    status,
    reason,
    adminId: req.user?.userId ?? null,
    actorCityId: req.user?.cityId ?? null,
    audit: auditContext(req, reason),
  });

  return sendSuccessResponse({
    res,
    message: 'Store status updated successfully',
    data: result,
  });
});

export const listStoreOrdersController = asyncHandler(async (req: Request, res: Response) => {
  const { storeId } = req.params as { storeId: string };
  const result = await listStoreOrdersForAdmin({
    storeId,
    ...(req.query as unknown as Omit<Parameters<typeof listStoreOrdersForAdmin>[0], 'storeId'>),
    actorCityId: req.user?.cityId ?? null,
  });

  return sendSuccessResponse({
    res,
    message: 'Store orders fetched successfully',
    data: result,
  });
});

export const listStoreInventoryController = asyncHandler(async (req: Request, res: Response) => {
  const { storeId } = req.params as { storeId: string };
  const result = await listStoreInventoryForAdmin({
    storeId,
    ...(req.query as unknown as Omit<Parameters<typeof listStoreInventoryForAdmin>[0], 'storeId'>),
    actorCityId: req.user?.cityId ?? null,
  });

  return sendSuccessResponse({
    res,
    message: 'Store inventory fetched successfully',
    data: result,
  });
});

export const listStoreAuditController = asyncHandler(async (req: Request, res: Response) => {
  const { storeId } = req.params as { storeId: string };
  const result = await listStoreAuditForAdmin({
    storeId,
    ...(req.query as unknown as Omit<Parameters<typeof listStoreAuditForAdmin>[0], 'storeId'>),
    actorCityId: req.user?.cityId ?? null,
  });

  return sendSuccessResponse({
    res,
    message: 'Store audit fetched successfully',
    data: result,
  });
});
