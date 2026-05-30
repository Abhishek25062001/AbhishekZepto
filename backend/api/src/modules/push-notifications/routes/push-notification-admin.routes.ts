import { Router } from 'express';

import { validateRequest } from '../../../middlewares/validate-request.middleware';
import { requirePermission } from '../../auth/middlewares/require-permission.middleware';
import { createPermissionCode } from '../../auth/utils/permission-code.util';
import {
  AUTH_PERMISSION_ACTION,
  AUTH_PERMISSION_RESOURCE,
} from '../../auth/constants/auth-permission.constants';
import {
  getPushNotificationLogController,
  listPushNotificationLogsController,
} from '../controllers/push-notification-admin.controller';
import {
  pushLogIdParamsValidator,
  pushLogListQueryValidator,
} from '../validators/device-token.validator';

const router = Router();
const pushNotificationsRead = createPermissionCode(
  AUTH_PERMISSION_RESOURCE.PUSH_NOTIFICATIONS,
  AUTH_PERMISSION_ACTION.READ,
);

router.get(
  '/logs',
  requirePermission(pushNotificationsRead),
  validateRequest({ query: pushLogListQueryValidator }),
  listPushNotificationLogsController,
);

router.get(
  '/logs/:logId',
  requirePermission(pushNotificationsRead),
  validateRequest({ params: pushLogIdParamsValidator }),
  getPushNotificationLogController,
);

export default router;
