import type { Request } from 'express';

import { sendSuccessResponse } from '../../../utils/api-response';
import { asyncHandler } from '../../../utils/async-handler';
import type { InAppNotificationSurface } from '../constants/in-app-notification-surface.constant';
import {
  getMyNotifications,
  getUnreadCount,
  markAllRead,
  markRead,
} from '../services/in-app-notification.service';
import type { InAppNotificationUserContext } from '../types/in-app-notification.types';
import {
  toInAppNotificationResponse,
  toInAppNotificationResponses,
} from '../utils/in-app-notification-response.mapper';
import type { NotificationListQueryBody } from '../validators/in-app-notification.validator';

const buildUserContext = (
  req: Request,
  appSurface: InAppNotificationSurface,
): InAppNotificationUserContext => ({
  appSurface,
  role: req.user!.role,
  userId: req.user!.userId,
});

export const createNotificationControllers = (appSurface: InAppNotificationSurface) => ({
  list: asyncHandler(async (req, res) => {
    const result = await getMyNotifications(
      buildUserContext(req, appSurface),
      req.query as unknown as NotificationListQueryBody,
    );

    return sendSuccessResponse({
      res,
      message: 'Notifications fetched successfully',
      data: {
        items: toInAppNotificationResponses(result.items),
        pagination: {
          limit: result.limit,
          page: result.page,
          total: result.total,
        },
      },
      meta: { requestId: req.requestId, traceId: req.traceId },
    });
  }),

  unreadCount: asyncHandler(async (req, res) => {
    const data = await getUnreadCount(buildUserContext(req, appSurface));

    return sendSuccessResponse({
      res,
      message: 'Unread notification count fetched successfully',
      data,
      meta: { requestId: req.requestId, traceId: req.traceId },
    });
  }),

  markRead: asyncHandler(async (req, res) => {
    const { notificationId } = req.params as { notificationId: string };
    const notification = await markRead(notificationId, buildUserContext(req, appSurface));

    return sendSuccessResponse({
      res,
      message: 'Notification marked as read successfully',
      data: toInAppNotificationResponse(notification),
      meta: { requestId: req.requestId, traceId: req.traceId },
    });
  }),

  markAllRead: asyncHandler(async (req, res) => {
    const data = await markAllRead(buildUserContext(req, appSurface));

    return sendSuccessResponse({
      res,
      message: 'Notifications marked as read successfully',
      data,
      meta: { requestId: req.requestId, traceId: req.traceId },
    });
  }),
});
