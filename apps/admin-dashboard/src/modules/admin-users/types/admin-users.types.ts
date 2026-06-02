import type { ApiPaginationMeta } from '../../../types/api.types';

export type AdminUserRole =
  | 'super_admin'
  | 'operations_admin'
  | 'support_admin'
  | 'catalog_admin'
  | 'finance_admin'
  | 'city_admin'
  | 'store_admin';

export type AdminUserStatus = 'active' | 'inactive' | 'blocked' | 'suspended' | 'deleted';

export type AdminUserSummary = {
  adminUserId: string;
  userId: string;
  name: string | null;
  email: string | null;
  phone: string;
  role: AdminUserRole;
  permissions: string[];
  status: AdminUserStatus;
  cityScope: string[];
  storeScope: string[];
  createdBy: string | null;
  updatedBy: string | null;
  lastLoginAt: string | null;
  disabledAt: string | null;
  disabledBy: string | null;
  disableReason: string | null;
  createdAt: string;
  updatedAt: string;
};

export type AdminUserListQuery = {
  role?: AdminUserRole;
  status?: AdminUserStatus;
  cityId?: string;
  search?: string;
  page?: number;
  limit?: number;
};

export type AdminUserListResponse = {
  items: AdminUserSummary[];
  page: number;
  limit: number;
  total: number;
};

export type AdminUserListResult = {
  items: AdminUserSummary[];
  pagination: ApiPaginationMeta;
};

export type CreateAdminUserPayload = {
  name?: string;
  email?: string | null;
  phone: string;
  role: AdminUserRole;
  permissions?: string[];
  cityScope?: string[];
  storeScope?: string[];
  status?: AdminUserStatus;
};

export type UpdateAdminUserPayload = {
  name?: string | null;
  email?: string | null;
  phone?: string;
  cityScope?: string[];
  storeScope?: string[];
};

export type AdminUserStatusPayload = {
  status: AdminUserStatus;
  reason: string;
};

export type AdminUserRolePayload = {
  role: AdminUserRole;
  reason: string;
};

export type AdminUserPermissionsPayload = {
  permissions: string[];
  reason: string;
};

export type AdminUserAuditRecord = {
  adminId: string;
  actionType: string;
  entityType: 'admin_user';
  entityId: string;
  beforeState: Record<string, unknown>;
  afterState: Record<string, unknown>;
  reason: string;
  ipAddress: string | null;
  deviceInfo: string | null;
  createdAt: string;
  updatedAt: string;
};

