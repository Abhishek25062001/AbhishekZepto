import type { Request, Response } from 'express';

import { sendSuccessResponse } from '../../../utils/api-response';
import { asyncHandler } from '../../../utils/async-handler';
import {
  getPlatformSettingForAdmin,
  listPlatformSettingAuditForAdmin,
  listPlatformSettingsForAdmin,
  updatePlatformSettingForAdmin,
} from '../services/platform-settings.service';

export const listPlatformSettingsController = asyncHandler(async (req: Request, res: Response) => {
  const result = await listPlatformSettingsForAdmin(
    req.query as unknown as Parameters<typeof listPlatformSettingsForAdmin>[0],
  );

  return sendSuccessResponse({
    res,
    message: 'Platform settings fetched successfully',
    data: result,
  });
});

export const getPlatformSettingController = asyncHandler(async (req: Request, res: Response) => {
  const { settingKey } = req.params as { settingKey: string };
  const result = await getPlatformSettingForAdmin(settingKey);

  return sendSuccessResponse({
    res,
    message: 'Platform setting fetched successfully',
    data: result,
  });
});

export const updatePlatformSettingController = asyncHandler(async (req: Request, res: Response) => {
  const { settingKey } = req.params as { settingKey: string };
  const { reason } = req.body as { reason: string };
  const result = await updatePlatformSettingForAdmin({
    settingKey,
    ...(req.body as Omit<Parameters<typeof updatePlatformSettingForAdmin>[0], 'settingKey' | 'adminId' | 'ipAddress' | 'deviceInfo'>),
    reason,
    adminId: req.user?.userId ?? '',
    ipAddress: req.ip ?? null,
    deviceInfo: req.get('user-agent') ?? null,
  });

  return sendSuccessResponse({
    res,
    message: 'Platform setting updated successfully',
    data: result,
  });
});

export const listPlatformSettingAuditController = asyncHandler(async (req: Request, res: Response) => {
  const { settingKey } = req.params as { settingKey: string };
  const result = await listPlatformSettingAuditForAdmin(settingKey);

  return sendSuccessResponse({
    res,
    message: 'Platform setting audit fetched successfully',
    data: result,
  });
});
