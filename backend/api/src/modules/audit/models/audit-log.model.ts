import { model, Schema, Types } from 'mongoose';
import type { SchemaOptions } from 'mongoose';

import { baseSchemaOptions } from '../../../database/base-schema-options';
import { COLLECTION_NAMES } from '../../../database/constants/collection-names.constants';
import type {
  AuditActorSurface,
  AuditLogStatus,
} from '../types/audit-log.types';

export type AuditLogRecord = {
  eventType: string;
  actorId: Types.ObjectId | null;
  actorRole: string | null;
  actorSurface: AuditActorSurface | null;
  entityType: string | null;
  entityId: Types.ObjectId | null;
  vendorId: Types.ObjectId | null;
  storeId: Types.ObjectId | null;
  cityId: Types.ObjectId | null;
  requestId: string | null;
  traceId: string | null;
  ipAddress: string | null;
  userAgent: string | null;
  metadata: Record<string, unknown>;
  status: AuditLogStatus;
  createdAt: Date;
  updatedAt: Date;
};

const AuditLogSchema = new Schema<AuditLogRecord>(
  {
    eventType: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    actorId: {
      type: Schema.Types.ObjectId,
      default: null,
      index: true,
    },
    actorRole: {
      type: String,
      default: null,
      trim: true,
    },
    actorSurface: {
      type: String,
      enum: [
        'customer_app',
        'delivery_agent_app',
        'vendor_panel',
        'admin_dashboard',
        'backend',
      ],
      default: null,
    },
    entityType: {
      type: String,
      default: null,
      trim: true,
    },
    entityId: {
      type: Schema.Types.ObjectId,
      default: null,
    },
    vendorId: {
      type: Schema.Types.ObjectId,
      default: null,
      index: true,
    },
    storeId: {
      type: Schema.Types.ObjectId,
      default: null,
      index: true,
    },
    cityId: {
      type: Schema.Types.ObjectId,
      default: null,
    },
    requestId: {
      type: String,
      default: null,
      trim: true,
    },
    traceId: {
      type: String,
      default: null,
      trim: true,
    },
    ipAddress: {
      type: String,
      default: null,
      trim: true,
    },
    userAgent: {
      type: String,
      default: null,
      trim: true,
    },
    metadata: {
      type: Schema.Types.Mixed,
      default: {},
    },
    status: {
      type: String,
      enum: ['success', 'failed'],
      required: true,
      index: true,
    },
  },
  baseSchemaOptions as SchemaOptions<AuditLogRecord>,
);

AuditLogSchema.index({ eventType: 1, createdAt: -1 });
AuditLogSchema.index({ actorId: 1, createdAt: -1 });
AuditLogSchema.index({ entityType: 1, entityId: 1 });
AuditLogSchema.index({ vendorId: 1, storeId: 1, createdAt: -1 });

export const AuditLogModel = model<AuditLogRecord>(
  'AuditLog',
  AuditLogSchema,
  COLLECTION_NAMES.AUDIT_LOGS,
);
