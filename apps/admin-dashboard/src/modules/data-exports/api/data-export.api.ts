import { apiClient } from '../../../services/api/client';
import type { ApiSuccessResponse } from '../../../types/api.types';
import type {
  CreateDataExportRequest,
  DataExportListQuery,
  DataExportListResponse,
  DataExportListResult,
  DataExportRecord,
} from '../types/data-export.types';

const BASE = '/api/v1/admin/data-exports';

export const buildDataExportParams = (
  query: DataExportListQuery = {},
): DataExportListQuery => Object.fromEntries(
  Object.entries(query).filter(([, value]) => value !== undefined && value !== ''),
) as DataExportListQuery;

const toPagination = (data: DataExportListResponse): DataExportListResult => {
  const totalPages = Math.max(1, Math.ceil(data.total / data.limit));

  return {
    items: data.items,
    pagination: {
      page: data.page,
      limit: data.limit,
      total: data.total,
      totalPages,
      hasNextPage: data.page < totalPages,
      hasPreviousPage: data.page > 1,
    },
  };
};

export const listDataExports = async (
  query: DataExportListQuery = {},
): Promise<DataExportListResult> => {
  const response = await apiClient.get<ApiSuccessResponse<DataExportListResponse>>(BASE, {
    params: buildDataExportParams(query),
  });

  return toPagination(response.data.data);
};

export const createDataExport = async (
  input: CreateDataExportRequest,
): Promise<DataExportRecord> => {
  const response = await apiClient.post<ApiSuccessResponse<DataExportRecord>>(BASE, input);

  return response.data.data;
};

export const getDataExport = async (exportId: string): Promise<DataExportRecord> => {
  const response = await apiClient.get<ApiSuccessResponse<DataExportRecord>>(
    `${BASE}/${exportId}`,
  );

  return response.data.data;
};
