import { model, Schema } from 'mongoose';
import type { SchemaOptions } from 'mongoose';

import { baseSchemaOptions } from '../../../database/base-schema-options';
import { COLLECTION_NAMES } from '../../../database/constants/collection-names.constants';
import {
  ADMIN_CONTROL_ACTIVE_MODULES,
  ADMIN_CONTROL_SESSION_TYPES,
} from '../constants/admin-control-session.constants';
import type { AdminControlSessionRecord } from '../types/admin-control-session.types';

const AdminControlSessionSchema = new Schema<AdminControlSessionRecord>(
  {
    adminId: { type: Schema.Types.ObjectId, required: true, index: true },
    sessionType: {
      type: String,
      enum: ADMIN_CONTROL_SESSION_TYPES,
      required: true,
    },
    cityScope: [{ type: Schema.Types.ObjectId, required: true, index: true }],
    startedAt: { type: Date, required: true, default: Date.now, index: true },
    endedAt: { type: Date, default: null, index: true },
    activeModules: [
      {
        type: String,
        enum: ADMIN_CONTROL_ACTIVE_MODULES,
        required: true,
      },
    ],
    lastHeartbeatAt: { type: Date, required: true, default: Date.now },
  },
  baseSchemaOptions as SchemaOptions<AdminControlSessionRecord>,
);

AdminControlSessionSchema.index({ adminId: 1, endedAt: 1 });
AdminControlSessionSchema.index({ cityScope: 1, startedAt: -1 });

export const AdminControlSessionModel = model<AdminControlSessionRecord>(
  'AdminControlSession',
  AdminControlSessionSchema,
  COLLECTION_NAMES.ADMIN_CONTROL_SESSIONS,
);

export { AdminControlSessionSchema };
