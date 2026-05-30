import { Router } from 'express';

import { validateRequest } from '../../../middlewares/validate-request.middleware';
import {
  AUTH_PERMISSION_ACTION,
  AUTH_PERMISSION_RESOURCE,
} from '../../auth/constants/auth-permission.constants';
import { requirePermission } from '../../auth/middlewares/require-permission.middleware';
import { createPermissionCode } from '../../auth/utils/permission-code.util';
import type { createNotificationControllers } from '../controllers/notification-controller.factory';
import {
  notificationIdParamsValidator,
  notificationListQueryValidator,
} from '../validators/in-app-notification.validator';

type NotificationControllers = ReturnType<typeof createNotificationControllers>;

const notificationsReadSelf = createPermissionCode(
  AUTH_PERMISSION_RESOURCE.NOTIFICATIONS,
  AUTH_PERMISSION_ACTION.READ_SELF,
);
const notificationsUpdateSelf = createPermissionCode(
  AUTH_PERMISSION_RESOURCE.NOTIFICATIONS,
  AUTH_PERMISSION_ACTION.UPDATE_SELF,
);

export const createNotificationRouter = (
  controllers: NotificationControllers,
): Router => {
  const router = Router();

  router.get(
    '/',
    requirePermission(notificationsReadSelf),
    validateRequest({ query: notificationListQueryValidator }),
    controllers.list,
  );

  router.get(
    '/unread-count',
    requirePermission(notificationsReadSelf),
    controllers.unreadCount,
  );

  router.patch(
    '/:notificationId/read',
    requirePermission(notificationsUpdateSelf),
    validateRequest({ params: notificationIdParamsValidator }),
    controllers.markRead,
  );

  router.patch(
    '/read-all',
    requirePermission(notificationsUpdateSelf),
    controllers.markAllRead,
  );

  return router;
};
