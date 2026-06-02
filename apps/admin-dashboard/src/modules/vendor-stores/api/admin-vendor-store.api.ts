import { apiClient } from '../../../services/api/client';
import type { ApiSuccessResponse } from '../../../types/api.types';
import type {
  AdminStoreAuditSummary,
  AdminStoreInspectionQuery,
  AdminStoreInspectionResult,
  AdminStoreInventorySummary,
  AdminStoreListQuery,
  AdminStoreListResult,
  AdminStoreOrderSummary,
  AdminStoreSummary,
  AdminVendorListQuery,
  AdminVendorListResult,
  AdminVendorSummary,
  PaginatedAdminStoreInspection,
  PaginatedAdminStores,
  PaginatedAdminVendors,
  StoreStatusPayload,
  VendorStatusPayload,
} from '../types/admin-vendor-store.types';

const ADMIN_VENDOR_BASE = '/api/v1/admin/vendors';
const ADMIN_STORE_BASE = '/api/v1/admin/stores';

const unwrapData = <T>(response: ApiSuccessResponse<T>): T => response.data;

const toPagination = <T extends { items: unknown[]; page: number; limit: number; total: number }>(
  data: T,
) => {
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

export const listAdminVendors = async (
  query: AdminVendorListQuery = {},
): Promise<AdminVendorListResult> => {
  const response = await apiClient.get<ApiSuccessResponse<PaginatedAdminVendors>>(
    ADMIN_VENDOR_BASE,
    { params: query },
  );
  return toPagination(response.data.data) as AdminVendorListResult;
};

export const getAdminVendor = async (vendorId: string): Promise<AdminVendorSummary> => {
  const response = await apiClient.get<ApiSuccessResponse<AdminVendorSummary>>(
    `${ADMIN_VENDOR_BASE}/${vendorId}`,
  );
  return unwrapData(response.data);
};

export const updateAdminVendorStatus = async (
  vendorId: string,
  payload: VendorStatusPayload,
): Promise<AdminVendorSummary> => {
  const response = await apiClient.patch<ApiSuccessResponse<AdminVendorSummary>>(
    `${ADMIN_VENDOR_BASE}/${vendorId}/status`,
    payload,
  );
  return unwrapData(response.data);
};

export const listAdminStores = async (
  query: AdminStoreListQuery = {},
): Promise<AdminStoreListResult> => {
  const response = await apiClient.get<ApiSuccessResponse<PaginatedAdminStores>>(
    ADMIN_STORE_BASE,
    { params: query },
  );
  return toPagination(response.data.data) as AdminStoreListResult;
};

export const getAdminStore = async (storeId: string): Promise<AdminStoreSummary> => {
  const response = await apiClient.get<ApiSuccessResponse<AdminStoreSummary>>(
    `${ADMIN_STORE_BASE}/${storeId}`,
  );
  return unwrapData(response.data);
};

export const updateAdminStoreStatus = async (
  storeId: string,
  payload: StoreStatusPayload,
): Promise<AdminStoreSummary> => {
  const response = await apiClient.patch<ApiSuccessResponse<AdminStoreSummary>>(
    `${ADMIN_STORE_BASE}/${storeId}/status`,
    payload,
  );
  return unwrapData(response.data);
};

export const listAdminStoreOrders = async (
  storeId: string,
  query: AdminStoreInspectionQuery = {},
): Promise<AdminStoreInspectionResult<AdminStoreOrderSummary>> => {
  const response = await apiClient.get<
    ApiSuccessResponse<PaginatedAdminStoreInspection<AdminStoreOrderSummary>>
  >(`${ADMIN_STORE_BASE}/${storeId}/orders`, { params: query });
  return toPagination(response.data.data) as AdminStoreInspectionResult<AdminStoreOrderSummary>;
};

export const listAdminStoreInventory = async (
  storeId: string,
  query: AdminStoreInspectionQuery = {},
): Promise<AdminStoreInspectionResult<AdminStoreInventorySummary>> => {
  const response = await apiClient.get<
    ApiSuccessResponse<PaginatedAdminStoreInspection<AdminStoreInventorySummary>>
  >(`${ADMIN_STORE_BASE}/${storeId}/inventory`, { params: query });
  return toPagination(response.data.data) as AdminStoreInspectionResult<AdminStoreInventorySummary>;
};

export const listAdminStoreAudit = async (
  storeId: string,
  query: AdminStoreInspectionQuery = {},
): Promise<AdminStoreInspectionResult<AdminStoreAuditSummary>> => {
  const response = await apiClient.get<
    ApiSuccessResponse<PaginatedAdminStoreInspection<AdminStoreAuditSummary>>
  >(`${ADMIN_STORE_BASE}/${storeId}/audit`, { params: query });
  return toPagination(response.data.data) as AdminStoreInspectionResult<AdminStoreAuditSummary>;
};
