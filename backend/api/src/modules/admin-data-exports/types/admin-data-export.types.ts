import type { HydratedDocument, Types } from 'mongoose';

import type {
  ADMIN_DATA_EXPORT_FORMAT,
  ADMIN_DATA_EXPORT_STATUS,
  ADMIN_DATA_EXPORT_TYPE,
} from '../constants/admin-data-export.constants';

export type AdminDataExportType =
  (typeof ADMIN_DATA_EXPORT_TYPE)[keyof typeof ADMIN_DATA_EXPORT_TYPE];

export type AdminDataExportFormat =
  (typeof ADMIN_DATA_EXPORT_FORMAT)[keyof typeof ADMIN_DATA_EXPORT_FORMAT];

export type AdminDataExportStatus =
  (typeof ADMIN_DATA_EXPORT_STATUS)[keyof typeof ADMIN_DATA_EXPORT_STATUS];

export type AdminDataExportFilters = Record<string, unknown>;

export type AdminDataExportRecord = {
  _id: Types.ObjectId;
  exportType: AdminDataExportType;
  format: AdminDataExportFormat;
  status: AdminDataExportStatus;
  filters: AdminDataExportFilters;
  requestedByAdminId: Types.ObjectId;
  requestedAt: Date;
  completedAt: Date | null;
  failedAt: Date | null;
  failureReason: string | null;
  fileKey: string | null;
  fileName: string | null;
  downloadUrl: string | null;
  expiresAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

export type AdminDataExportDocument = HydratedDocument<AdminDataExportRecord>;

export type CreateAdminDataExportInput = {
  exportType: AdminDataExportType;
  format: AdminDataExportFormat;
  filters: AdminDataExportFilters;
  requestedByAdminId: string;
};

export type CreateAdminDataExportForAdminInput = CreateAdminDataExportInput & {
  reason: string;
  ipAddress?: string | null;
  deviceInfo?: string | null;
};

export type ListAdminDataExportsInput = {
  exportType?: AdminDataExportType;
  format?: AdminDataExportFormat;
  status?: AdminDataExportStatus;
  requestedByAdminId?: string;
  fromDate?: Date;
  toDate?: Date;
  page: number;
  limit: number;
};

export type AdminDataExportResponse = {
  id: string;
  exportType: AdminDataExportType;
  format: AdminDataExportFormat;
  status: AdminDataExportStatus;
  filters: AdminDataExportFilters;
  requestedByAdminId: string;
  requestedAt: Date;
  completedAt: Date | null;
  failedAt: Date | null;
  failureReason: string | null;
  fileKey: string | null;
  fileName: string | null;
  downloadUrl: string | null;
  expiresAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
};
