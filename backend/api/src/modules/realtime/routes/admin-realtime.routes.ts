import { Router } from 'express';

import {
  AUTH_PERMISSION_ACTION,
  AUTH_PERMISSION_RESOURCE,
} from '../../auth/constants/auth-permission.constants';
import { requirePermission } from '../../auth/middlewares/require-permission.middleware';
import { createPermissionCode } from '../../auth/utils/permission-code.util';
import { getAdminRealtimeHealthController } from '../controllers/admin-realtime.controller';

const router = Router();
const realtimeControlTowerRead = createPermissionCode(
  AUTH_PERMISSION_RESOURCE.REALTIME_CONTROL_TOWER,
  AUTH_PERMISSION_ACTION.READ,
);

router.get(
  '/health',
  requirePermission(realtimeControlTowerRead),
  getAdminRealtimeHealthController,
);

export default router;
