import { model, Schema, Types } from 'mongoose';
import type { SchemaOptions } from 'mongoose';

import { baseSchemaOptions } from '../../../database/base-schema-options';
import { COLLECTION_NAMES } from '../../../database/constants/collection-names.constants';

export type RealtimeEventLogRecord = {
  eventId: string;
  eventName: string;
  recipientUserId: Types.ObjectId;
  appSurface: string;
  deliveryStatus: 'pending' | 'delivered' | 'failed' | 'acknowledged';
  payload: Record<string, unknown>;
  emittedAt: Date;
  acknowledgedAt: Date | null;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
};

const RealtimeEventLogSchema = new Schema<RealtimeEventLogRecord>(
  {
    eventId: { type: String, required: true, unique: true, index: true },
    eventName: { type: String, required: true, index: true },
    recipientUserId: { type: Schema.Types.ObjectId, required: true, index: true },
    appSurface: { type: String, required: true, index: true },
    deliveryStatus: {
      type: String,
      enum: ['pending', 'delivered', 'failed', 'acknowledged'],
      required: true,
      default: 'pending',
      index: true,
    },
    payload: { type: Schema.Types.Mixed, required: true },
    emittedAt: { type: Date, required: true, default: Date.now },
    acknowledgedAt: { type: Date, default: null, index: true },
    expiresAt: { type: Date, required: true },
  },
  baseSchemaOptions as SchemaOptions<RealtimeEventLogRecord>,
);

// TTL index to automatically delete logs after they expire (expiresAt is a specific date)
RealtimeEventLogSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const RealtimeEventLogModel = model<RealtimeEventLogRecord>(
  'RealtimeEventLog',
  RealtimeEventLogSchema,
  COLLECTION_NAMES.REALTIME_EVENT_LOGS,
);

export { RealtimeEventLogSchema };
