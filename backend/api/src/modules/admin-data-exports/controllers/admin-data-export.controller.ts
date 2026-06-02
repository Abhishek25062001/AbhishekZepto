import type { Request, Response } from 'express';

import {
  sendCreatedResponse,
  sendSuccessResponse,
} from '../../../utils/api-response';
import { asyncHandler } from '../../../utils/async-handler';
import {
  createAdminDataExportForAdmin,
  getAdminDataExportForAdmin,
  listAdminDataExportsForAdmin,
} from '../services/admin-data-export.service';

export const createAdminDataExportController = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await createAdminDataExportForAdmin({
      ...(req.body as Omit<
        Parameters<typeof createAdminDataExportForAdmin>[0],
        'requestedByAdminId' | 'ipAddress' | 'deviceInfo'
      >),
      requestedByAdminId: req.user?.userId ?? '',
      ipAddress: req.ip ?? null,
      deviceInfo: req.get('user-agent') ?? null,
    });

    return sendCreatedResponse({
      res,
      message: 'Admin data export queued successfully',
      data: result,
    });
  },
);

export const listAdminDataExportsController = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await listAdminDataExportsForAdmin(
      req.query as unknown as Parameters<typeof listAdminDataExportsForAdmin>[0],
    );

    return sendSuccessResponse({
      res,
      message: 'Admin data exports fetched successfully',
      data: result,
    });
  },
);

export const getAdminDataExportController = asyncHandler(
  async (req: Request, res: Response) => {
    const { exportId } = req.params as { exportId: string };
    const result = await getAdminDataExportForAdmin(exportId);

    return sendSuccessResponse({
      res,
      message: 'Admin data export fetched successfully',
      data: result,
    });
  },
);
