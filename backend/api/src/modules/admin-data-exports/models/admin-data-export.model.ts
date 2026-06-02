import { model, Schema } from 'mongoose';
import type { SchemaOptions } from 'mongoose';

import { baseSchemaOptions } from '../../../database/base-schema-options';
import { COLLECTION_NAMES } from '../../../database/constants/collection-names.constants';
import {
  ADMIN_DATA_EXPORT_FORMATS,
  ADMIN_DATA_EXPORT_STATUS,
  ADMIN_DATA_EXPORT_STATUSES,
  ADMIN_DATA_EXPORT_TYPES,
} from '../constants/admin-data-export.constants';
import type { AdminDataExportRecord } from '../types/admin-data-export.types';

const AdminDataExportSchema = new Schema<AdminDataExportRecord>(
  {
    exportType: { type: String, enum: ADMIN_DATA_EXPORT_TYPES, required: true, index: true },
    format: { type: String, enum: ADMIN_DATA_EXPORT_FORMATS, required: true, index: true },
    status: {
      type: String,
      enum: ADMIN_DATA_EXPORT_STATUSES,
      default: ADMIN_DATA_EXPORT_STATUS.QUEUED,
      index: true,
    },
    filters: { type: Schema.Types.Mixed, default: {} },
    requestedByAdminId: { type: Schema.Types.ObjectId, required: true, index: true },
    requestedAt: { type: Date, required: true, default: Date.now, index: true },
    completedAt: { type: Date, default: null },
    failedAt: { type: Date, default: null },
    failureReason: { type: String, default: null, trim: true },
    fileKey: { type: String, default: null, trim: true },
    fileName: { type: String, default: null, trim: true },
    downloadUrl: { type: String, default: null, trim: true },
    expiresAt: { type: Date, default: null },
  },
  baseSchemaOptions as SchemaOptions<AdminDataExportRecord>,
);

AdminDataExportSchema.index({ requestedByAdminId: 1, requestedAt: -1 });
AdminDataExportSchema.index({ status: 1, requestedAt: -1 });
AdminDataExportSchema.index({ exportType: 1, requestedAt: -1 });

export const AdminDataExportModel = model<AdminDataExportRecord>(
  'AdminDataExport',
  AdminDataExportSchema,
  COLLECTION_NAMES.ADMIN_DATA_EXPORTS,
);
