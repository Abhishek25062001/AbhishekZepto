import type { Types } from 'mongoose';
import type { PermissionCode } from '../../auth/types/auth-permission.types';
import type { AuthRole } from '../../auth/types/auth-role.types';
import type { UserIdentityRecord } from '../../auth/models/user-identity.model';

export type AdminUserStatus = UserIdentityRecord['accountStatus'];

export type AdminUserRecord = UserIdentityRecord & {
  _id: Types.ObjectId;
};

export type AdminUserSummary = {
  adminUserId: string;
  userId: string;
  name: string | null;
  email: string | null;
  phone: string;
  role: AuthRole;
  permissions: PermissionCode[];
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

export type CreateAdminUserInput = {
  name?: string | null;
  email?: string | null;
  phone: string;
  role: AuthRole;
  permissions?: PermissionCode[];
  cityScope?: string[];
  storeScope?: string[];
  status?: AdminUserStatus;
  createdBy?: string | null;
};

export type UpdateAdminUserInput = {
  name?: string | null;
  email?: string | null;
  phone?: string;
  cityScope?: string[];
  storeScope?: string[];
  updatedBy?: string | null;
};

export type ListAdminUsersInput = {
  role?: AuthRole;
  status?: AdminUserStatus;
  cityId?: string;
  search?: string;
  page: number;
  limit: number;
};

export type PaginatedAdminUsers = {
  items: AdminUserSummary[];
  page: number;
  limit: number;
  total: number;
};
