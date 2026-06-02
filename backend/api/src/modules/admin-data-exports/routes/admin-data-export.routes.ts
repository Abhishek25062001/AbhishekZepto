import { Router } from 'express';

import { validateRequest } from '../../../middlewares/validate-request.middleware';
import { requireAnyPermission } from '../../auth/middlewares/require-any-permission.middleware';
import { ADMIN_DATA_EXPORT_PERMISSION_GROUPS } from '../constants/admin-data-export-permissions.constants';
import {
  createAdminDataExportController,
  getAdminDataExportController,
  listAdminDataExportsController,
} from '../controllers/admin-data-export.controller';
import {
  adminDataExportIdParamValidator,
  createAdminDataExportBodyValidator,
  listAdminDataExportsQueryValidator,
} from '../validators/admin-data-export.validator';

const router = Router();

router.post(
  '/',
  requireAnyPermission(ADMIN_DATA_EXPORT_PERMISSION_GROUPS.EXPORT),
  validateRequest(createAdminDataExportBodyValidator),
  createAdminDataExportController,
);

router.get(
  '/',
  requireAnyPermission(ADMIN_DATA_EXPORT_PERMISSION_GROUPS.EXPORT),
  validateRequest(listAdminDataExportsQueryValidator),
  listAdminDataExportsController,
);

router.get(
  '/:exportId',
  requireAnyPermission(ADMIN_DATA_EXPORT_PERMISSION_GROUPS.EXPORT),
  validateRequest(adminDataExportIdParamValidator),
  getAdminDataExportController,
);

export default router;
