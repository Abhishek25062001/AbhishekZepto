import type { FilterQuery } from 'mongoose';
import { Types } from 'mongoose';

import { IN_APP_NOTIFICATION_PRIORITY } from '../constants/in-app-notification-priority.constant';
import { InAppNotificationModel } from '../models/in-app-notification.model';
import type {
  CreateInAppNotificationInput,
  InAppNotificationDocument,
  NotificationListQuery,
} from '../types/in-app-notification.types';

const toObjectId = (value: string | Types.ObjectId): Types.ObjectId =>
  value instanceof Types.ObjectId ? value : new Types.ObjectId(value);

export const createNotification = async (
  payload: CreateInAppNotificationInput,
): Promise<InAppNotificationDocument> => {
  const created = await InAppNotificationModel.create({
    ...payload,
    dataPayload: payload.dataPayload ?? {},
    isRead: false,
    priority: payload.priority ?? IN_APP_NOTIFICATION_PRIORITY.NORMAL,
    userId: toObjectId(payload.userId),
  });

  return created.toObject() as InAppNotificationDocument;
};

export const findNotificationById = async (
  notificationId: string,
): Promise<InAppNotificationDocument | null> => {
  if (!Types.ObjectId.isValid(notificationId)) {
    return null;
  }

  return InAppNotificationModel.findById(notificationId).lean();
};

export const listUserNotifications = async (
  query: NotificationListQuery,
): Promise<{ items: InAppNotificationDocument[]; total: number }> => {
  const filter: FilterQuery<InAppNotificationDocument> = {
    appSurface: query.appSurface,
    isArchived: false,
    userId: toObjectId(query.userId),
  };

  if (query.isRead !== undefined) {
    filter.isRead = query.isRead;
  }

  if (query.notificationType) {
    filter.notificationType = query.notificationType;
  }

  const skip = (query.page - 1) * query.limit;
  const [items, total] = await Promise.all([
    InAppNotificationModel.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(query.limit)
      .lean(),
    InAppNotificationModel.countDocuments(filter),
  ]);

  return { items, total };
};

export const countUnreadNotifications = async (
  userId: string | Types.ObjectId,
  appSurface: NotificationListQuery['appSurface'],
): Promise<number> =>
  InAppNotificationModel.countDocuments({
    appSurface,
    isArchived: false,
    isRead: false,
    userId: toObjectId(userId),
  });

export const markNotificationRead = async (
  notificationId: string,
  userId: string | Types.ObjectId,
): Promise<InAppNotificationDocument | null> => {
  if (!Types.ObjectId.isValid(notificationId)) {
    return null;
  }

  return InAppNotificationModel.findOneAndUpdate(
    {
      _id: new Types.ObjectId(notificationId),
      userId: toObjectId(userId),
      isArchived: false,
    },
    {
      $set: {
        isRead: true,
        readAt: new Date(),
      },
    },
    { new: true },
  ).lean();
};

export const markAllNotificationsRead = async (
  userId: string | Types.ObjectId,
  appSurface: NotificationListQuery['appSurface'],
): Promise<number> => {
  const result = await InAppNotificationModel.updateMany(
    {
      appSurface,
      isArchived: false,
      isRead: false,
      userId: toObjectId(userId),
    },
    {
      $set: {
        isRead: true,
        readAt: new Date(),
      },
    },
  );

  return result.modifiedCount;
};

export const archiveNotification = async (
  notificationId: string,
  userId: string | Types.ObjectId,
): Promise<InAppNotificationDocument | null> => {
  if (!Types.ObjectId.isValid(notificationId)) {
    return null;
  }

  return InAppNotificationModel.findOneAndUpdate(
    {
      _id: new Types.ObjectId(notificationId),
      userId: toObjectId(userId),
      isArchived: false,
    },
    {
      $set: {
        archivedAt: new Date(),
        isArchived: true,
      },
    },
    { new: true },
  ).lean();
};
