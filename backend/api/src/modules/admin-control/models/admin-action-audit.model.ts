import { model, Schema } from 'mongoose';
import type { SchemaOptions } from 'mongoose';

import { baseSchemaOptions } from '../../../database/base-schema-options';
import { COLLECTION_NAMES } from '../../../database/constants/collection-names.constants';
import { ADMIN_ACTION_TYPES } from '../constants/admin-action-types';
import type { AdminActionAuditRecord } from '../types/admin-action-audit.types';

const AdminActionAuditSchema = new Schema<AdminActionAuditRecord>(
  {
    adminId: { type: Schema.Types.ObjectId, required: true, index: true },
    actionType: {
      type: String,
      enum: [...ADMIN_ACTION_TYPES, 'STORE_REOPEN', 'AGENT_RESTORE_ONLINE'],
      required: true,
      index: true,
    },
    entityType: { type: String, required: true, trim: true, index: true },
    entityId: { type: Schema.Types.ObjectId, required: true, index: true },
    beforeState: { type: Schema.Types.Mixed, required: true, default: {} },
    afterState: { type: Schema.Types.Mixed, required: true, default: {} },
    reason: { type: String, required: true, trim: true },
    ipAddress: { type: String, default: null, trim: true },
    deviceInfo: { type: String, default: null, trim: true },
  },
  baseSchemaOptions as SchemaOptions<AdminActionAuditRecord>,
);

AdminActionAuditSchema.index({ adminId: 1, createdAt: -1 });
AdminActionAuditSchema.index({ entityType: 1, entityId: 1, createdAt: -1 });

export const AdminActionAuditModel = model<AdminActionAuditRecord>(
  'AdminActionAudit',
  AdminActionAuditSchema,
  COLLECTION_NAMES.ADMIN_ACTION_AUDITS,
);

export { AdminActionAuditSchema };
