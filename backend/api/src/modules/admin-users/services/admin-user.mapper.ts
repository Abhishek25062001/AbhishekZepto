import type { Types } from 'mongoose';

import type { PermissionCode } from '../../auth/types/auth-permission.types';
import type { AdminUserRecord, AdminUserSummary } from '../types/admin-user.types';

const toId = (value: Types.ObjectId | null | undefined): string | null => {
  return value ? value.toString() : null;
};

const toIso = (value: Date | null | undefined): string | null => {
  return value ? value.toISOString() : null;
};

export const mapAdminUserSummary = (user: AdminUserRecord): AdminUserSummary => ({
  adminUserId: user._id.toString(),
  userId: user._id.toString(),
  name: user.name,
  email: user.email,
  phone: user.phone,
  role: user.role,
  permissions: user.permissions as PermissionCode[],
  status: user.accountStatus,
  cityScope: user.cityId ? [user.cityId.toString()] : [],
  storeScope: user.storeId ? [user.storeId.toString()] : [],
  createdBy: toId(user.createdBy),
  updatedBy: toId(user.updatedBy),
  lastLoginAt: toIso(user.lastLoginAt),
  disabledAt: user.accountStatus === 'active' ? null : toIso(user.updatedAt),
  disabledBy: user.accountStatus === 'active' ? null : toId(user.updatedBy),
  disableReason: null,
  createdAt: user.createdAt.toISOString(),
  updatedAt: user.updatedAt.toISOString(),
});
