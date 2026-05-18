import type { Types } from 'mongoose';
import { AppError } from '../../../errors/AppError';
import { ERROR_CODES } from '../../../errors/error-codes';
import { HTTP_STATUS } from '../../../utils/http-status';
import { AUTH_ROLE } from '../constants/auth-role.constants';
import {
  assignUserRole as assignUserRoleRecord,
  findActiveUserIdentityById,
  updateUserPermissions as updateUserPermissionsRecord,
} from '../repositories/user-identity.repository';
import { findRoleByCode } from '../repositories/role.repository';
import type { PermissionCode } from '../types/auth-permission.types';
import type { AuthRole } from '../types/auth-role.types';
import { normalizePermissionCodes } from './permission.service';

const assertWildcardPermissionAllowed = ({
  permissions,
  targetRole,
}: {
  permissions: PermissionCode[];
  targetRole: AuthRole;
}) => {
  if (permissions.includes('*:*') && targetRole !== AUTH_ROLE.SUPER_ADMIN) {
    throw new AppError({
      message: 'Wildcard permission is only allowed for super admin users',
      statusCode: HTTP_STATUS.UNPROCESSABLE_ENTITY,
      errorCode: ERROR_CODES.VALIDATION_ERROR,
    });
  }
};

const getActiveUserOrThrow = async (userId: string) => {
  const user = await findActiveUserIdentityById(userId);

  if (!user) {
    throw new AppError({
      message: 'User not found',
      statusCode: HTTP_STATUS.NOT_FOUND,
      errorCode: ERROR_CODES.NOT_FOUND,
    });
  }

  return user;
};

export const updateUserPermissions = async ({
  userId,
  permissions,
  updatedBy,
}: {
  userId: string;
  permissions: string[];
  updatedBy?: Types.ObjectId | null;
}) => {
  const user = await getActiveUserOrThrow(userId);
  const normalizedPermissions = normalizePermissionCodes(permissions);

  assertWildcardPermissionAllowed({
    permissions: normalizedPermissions,
    targetRole: user.role,
  });

  const updatedUser = await updateUserPermissionsRecord({
    userId,
    permissions: normalizedPermissions,
    updatedBy,
  });

  if (!updatedUser) {
    throw new AppError({
      message: 'User not found',
      statusCode: HTTP_STATUS.NOT_FOUND,
      errorCode: ERROR_CODES.NOT_FOUND,
    });
  }

  return updatedUser;
};

export const assignUserRole = async ({
  userId,
  role,
  updatedBy,
}: {
  userId: string;
  role: AuthRole;
  updatedBy?: Types.ObjectId | null;
}) => {
  await getActiveUserOrThrow(userId);

  const updatedUser = await assignUserRoleRecord({
    userId,
    role,
    updatedBy,
  });

  if (!updatedUser) {
    throw new AppError({
      message: 'User not found',
      statusCode: HTTP_STATUS.NOT_FOUND,
      errorCode: ERROR_CODES.NOT_FOUND,
    });
  }

  return updatedUser;
};

export const syncUserPermissionsFromRole = async ({
  userId,
  roleCode,
  updatedBy,
}: {
  userId: string;
  roleCode: AuthRole;
  updatedBy?: Types.ObjectId | null;
}) => {
  await getActiveUserOrThrow(userId);

  const role = await findRoleByCode(roleCode);

  if (!role) {
    throw new AppError({
      message: 'Role not found',
      statusCode: HTTP_STATUS.NOT_FOUND,
      errorCode: ERROR_CODES.NOT_FOUND,
    });
  }

  const permissions = normalizePermissionCodes(role.permissions);

  const updatedUser = await updateUserPermissionsRecord({
    userId,
    permissions,
    updatedBy,
  });

  if (!updatedUser) {
    throw new AppError({
      message: 'User not found',
      statusCode: HTTP_STATUS.NOT_FOUND,
      errorCode: ERROR_CODES.NOT_FOUND,
    });
  }

  return updatedUser;
};

export const getCurrentUserPermissions = async (userId: string) => {
  const user = await getActiveUserOrThrow(userId);

  return {
    role: user.role,
    permissions: normalizePermissionCodes(user.permissions),
  };
};

export const userPermissionService = {
  updateUserPermissions,
  assignUserRole,
  syncUserPermissionsFromRole,
  getCurrentUserPermissions,
};
