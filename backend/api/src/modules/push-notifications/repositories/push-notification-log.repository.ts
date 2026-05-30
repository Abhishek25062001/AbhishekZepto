import type { FilterQuery } from 'mongoose';
import { Types } from 'mongoose';

import { PUSH_NOTIFICATION_STATUS } from '../constants/push-status.constant';
import { PushNotificationLogModel } from '../models/push-notification-log.model';
import type {
  CreatePushLogPayload,
  PushLogListQuery,
  PushNotificationLogDocument,
} from '../types/push-notification.types';

export const createPushLog = async (
  payload: CreatePushLogPayload,
): Promise<PushNotificationLogDocument> => {
  const created = await PushNotificationLogModel.create({
    ...payload,
    status: payload.status ?? PUSH_NOTIFICATION_STATUS.PENDING,
  });
  return created.toObject() as PushNotificationLogDocument;
};

export const markPushSent = async (
  logId: string | Types.ObjectId,
  providerMessageId: string,
): Promise<PushNotificationLogDocument | null> =>
  PushNotificationLogModel.findByIdAndUpdate(
    logId,
    {
      $set: {
        failedAt: null,
        failureReason: null,
        providerMessageId,
        sentAt: new Date(),
        status: PUSH_NOTIFICATION_STATUS.SENT,
      },
    },
    { new: true },
  ).lean();

export const markPushFailed = async (
  logId: string | Types.ObjectId,
  failureReason: string,
): Promise<PushNotificationLogDocument | null> =>
  PushNotificationLogModel.findByIdAndUpdate(
    logId,
    {
      $set: {
        failedAt: new Date(),
        failureReason,
        status: PUSH_NOTIFICATION_STATUS.FAILED,
      },
    },
    { new: true },
  ).lean();

export const markPushSkipped = async (
  logId: string | Types.ObjectId,
  reason: string,
): Promise<PushNotificationLogDocument | null> =>
  PushNotificationLogModel.findByIdAndUpdate(
    logId,
    {
      $set: {
        failureReason: reason,
        status: PUSH_NOTIFICATION_STATUS.SKIPPED,
      },
    },
    { new: true },
  ).lean();

export const findPushLogById = async (
  logId: string,
): Promise<PushNotificationLogDocument | null> => {
  if (!Types.ObjectId.isValid(logId)) {
    return null;
  }

  return PushNotificationLogModel.findById(logId).lean();
};

export const listPushLogs = async (
  query: PushLogListQuery,
): Promise<{ items: PushNotificationLogDocument[]; total: number }> => {
  const filter: FilterQuery<PushNotificationLogDocument> = {};

  if (query.userId && Types.ObjectId.isValid(query.userId)) {
    filter.userId = new Types.ObjectId(query.userId);
  }
  if (query.notificationType) {
    filter.notificationType = query.notificationType;
  }
  if (query.status) {
    filter.status = query.status;
  }

  const skip = (query.page - 1) * query.limit;
  const [items, total] = await Promise.all([
    PushNotificationLogModel.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(query.limit)
      .lean(),
    PushNotificationLogModel.countDocuments(filter),
  ]);

  return { items, total };
};
