import { Router } from 'express';

import { validateRequest } from '../../../middlewares/validate-request.middleware';
import { requirePermission } from '../../auth/middlewares/require-permission.middleware';
import { PLATFORM_SETTINGS_PERMISSIONS } from '../constants/platform-settings.constants';
import {
  getPlatformSettingController,
  listPlatformSettingAuditController,
  listPlatformSettingsController,
  updatePlatformSettingController,
} from '../controllers/platform-settings.controller';
import {
  listPlatformSettingsQueryValidator,
  platformSettingKeyParamValidator,
  updatePlatformSettingValidator,
} from '../validators/platform-settings.validator';

const router = Router();

router.get(
  '/',
  requirePermission(PLATFORM_SETTINGS_PERMISSIONS.READ),
  validateRequest(listPlatformSettingsQueryValidator),
  listPlatformSettingsController,
);

router.get(
  '/:settingKey/audit',
  requirePermission(PLATFORM_SETTINGS_PERMISSIONS.READ),
  validateRequest(platformSettingKeyParamValidator),
  listPlatformSettingAuditController,
);

router.get(
  '/:settingKey',
  requirePermission(PLATFORM_SETTINGS_PERMISSIONS.READ),
  validateRequest(platformSettingKeyParamValidator),
  getPlatformSettingController,
);

router.patch(
  '/:settingKey',
  requirePermission(PLATFORM_SETTINGS_PERMISSIONS.MANAGE),
  validateRequest(platformSettingKeyParamValidator),
  validateRequest(updatePlatformSettingValidator),
  updatePlatformSettingController,
);

export default router;
