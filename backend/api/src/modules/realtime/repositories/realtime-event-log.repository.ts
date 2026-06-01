import { Types } from 'mongoose';
import { RealtimeEventLogModel } from '../models/realtime-event-log.model';
import type { RealtimeEventLogRecord } from '../models/realtime-event-log.model';

const toObjectId = (value: string | Types.ObjectId): Types.ObjectId =>
  value instanceof Types.ObjectId ? value : new Types.ObjectId(value);

export const createRealtimeEventLog = async (
  payload: Omit<RealtimeEventLogRecord, 'createdAt' | 'updatedAt'>,
): Promise<RealtimeEventLogRecord> => {
  const doc = await RealtimeEventLogModel.create(payload);
  return doc.toObject() as RealtimeEventLogRecord;
};

export const findUnacknowledgedEvents = async (
  recipientUserId: string | Types.ObjectId,
  appSurface: string,
): Promise<RealtimeEventLogRecord[]> => {
  const docs = await RealtimeEventLogModel.find({
    recipientUserId: toObjectId(recipientUserId),
    appSurface,
    acknowledgedAt: null,
    expiresAt: { $gt: new Date() },
  })
    .sort({ emittedAt: 1 })
    .lean();

  return docs as unknown as RealtimeEventLogRecord[];
};

export const acknowledgeEvent = async (
  eventId: string,
  recipientUserId: string | Types.ObjectId,
): Promise<RealtimeEventLogRecord | null> => {
  const updated = await RealtimeEventLogModel.findOneAndUpdate(
    {
      eventId,
      recipientUserId: toObjectId(recipientUserId),
      acknowledgedAt: null,
    },
    {
      $set: {
        deliveryStatus: 'acknowledged',
        acknowledgedAt: new Date(),
      },
    },
    { new: true },
  ).lean();

  return updated as unknown as RealtimeEventLogRecord | null;
};
