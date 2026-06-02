export const DATA_EXPORT_TYPES = [
  'admin_users',
  'customers',
  'delivery_agents',
  'vendors',
  'stores',
  'support_tickets',
  'audit_logs',
  'operational_analytics',
  'platform_settings',
] as const;

export const DATA_EXPORT_FORMATS = ['csv', 'json'] as const;

export const DATA_EXPORT_STATUSES = ['queued', 'completed', 'failed'] as const;

export type DataExportType = (typeof DATA_EXPORT_TYPES)[number];

export type DataExportFormat = (typeof DATA_EXPORT_FORMATS)[number];

export type DataExportStatus = (typeof DATA_EXPORT_STATUSES)[number];

export type DataExportFilters = Record<string, unknown>;

export type DataExportRecord = {
  id: string;
  exportType: DataExportType;
  format: DataExportFormat;
  status: DataExportStatus;
  filters: DataExportFilters;
  requestedByAdminId: string;
  requestedAt: string;
  completedAt: string | null;
  failedAt: string | null;
  failureReason: string | null;
  fileKey: string | null;
  fileName: string | null;
  downloadUrl: string | null;
  expiresAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type CreateDataExportRequest = {
  exportType: DataExportType;
  format: DataExportFormat;
  filters: DataExportFilters;
  reason: string;
};

export type DataExportListQuery = {
  exportType?: DataExportType;
  format?: DataExportFormat;
  status?: DataExportStatus;
  requestedByAdminId?: string;
  fromDate?: string;
  toDate?: string;
  page?: number;
  limit?: number;
};

export type DataExportListResponse = {
  items: DataExportRecord[];
  page: number;
  limit: number;
  total: number;
};

export type DataExportListResult = {
  items: DataExportRecord[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
};
