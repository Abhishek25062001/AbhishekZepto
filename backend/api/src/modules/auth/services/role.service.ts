import { AppError } from '../../../errors/AppError';
import { ERROR_CODES } from '../../../errors/error-codes';
import { HTTP_STATUS } from '../../../utils/http-status';
import type { RoleRecord } from '../models/role.model';
import {
  createRole as createRoleRecord,
  findRoleById,
  listRoles as listRolesRecord,
  roleExistsByCode,
  softDeleteRoleById,
  updateRoleById,
} from '../repositories/role.repository';
import type { PermissionCode } from '../types/auth-permission.types';
import { normalizePermissionCodes } from './permission.service';

const assertNoWildcardPermissionForCustomRole = ({
  permissions,
  isSystemRole,
}: {
  permissions: PermissionCode[];
  isSystemRole: boolean;
}) => {
  if (!isSystemRole && permissions.includes('*:*')) {
    throw new AppError({
      message: 'Wildcard permission is only allowed for system roles',
      statusCode: HTTP_STATUS.UNPROCESSABLE_ENTITY,
      errorCode: ERROR_CODES.VALIDATION_ERROR,
    });
  }
};

const assertRoleIsEditable = (role: Pick<RoleRecord, 'isSystemRole' | 'isEditable'>) => {
  if (role.isSystemRole && !role.isEditable) {
    throw new AppError({
      message: 'System role cannot be modified',
      statusCode: HTTP_STATUS.FORBIDDEN,
      errorCode: ERROR_CODES.FORBIDDEN,
    });
  }
};

export const listRoles = async ({
  page,
  limit,
  search,
  status,
}: {
  page: number;
  limit: number;
  search?: string;
  status?: RoleRecord['status'];
}) => {
  const response = await listRolesRecord({
    page,
    limit,
    search,
    status,
  });

  return {
    items: response.items,
    pagination: {
      page,
      limit,
      total: response.total,
      totalPages: Math.max(1, Math.ceil(response.total / limit)),
      hasNextPage: page * limit < response.total,
      hasPreviousPage: page > 1,
    },
  };
};

export const getRoleById = async (roleId: string) => {
  const role = await findRoleById(roleId);

  if (!role) {
    throw new AppError({
      message: 'Role not found',
      statusCode: HTTP_STATUS.NOT_FOUND,
      errorCode: ERROR_CODES.NOT_FOUND,
    });
  }

  return role;
};

export const createRole = async (
  input: Pick<
    RoleRecord,
    'code' | 'name' | 'description' | 'permissions' | 'isSystemRole' | 'isEditable'
  >,
) => {
  const permissions = normalizePermissionCodes(input.permissions);
  const isSystemRole = input.isSystemRole ?? false;

  assertNoWildcardPermissionForCustomRole({
    permissions,
    isSystemRole,
  });

  const existingRole = await roleExistsByCode(input.code);

  if (existingRole) {
    throw new AppError({
      message: 'Role code already exists',
      statusCode: HTTP_STATUS.CONFLICT,
      errorCode: ERROR_CODES.CONFLICT,
    });
  }

  return createRoleRecord({
    ...input,
    permissions,
    isSystemRole,
    isEditable: input.isEditable ?? true,
  });
};

export const updateRole = async (
  roleId: string,
  input: Partial<
    Pick<RoleRecord, 'name' | 'description' | 'permissions' | 'isEditable' | 'status'>
  >,
) => {
  const role = await getRoleById(roleId);
  assertRoleIsEditable(role);

  const nextPermissions = input.permissions
    ? normalizePermissionCodes(input.permissions)
    : undefined;

  if (nextPermissions) {
    assertNoWildcardPermissionForCustomRole({
      permissions: nextPermissions,
      isSystemRole: role.isSystemRole,
    });
  }

  const updatedRole = await updateRoleById(roleId, {
    ...input,
    permissions: nextPermissions,
  });

  if (!updatedRole) {
    throw new AppError({
      message: 'Role not found',
      statusCode: HTTP_STATUS.NOT_FOUND,
      errorCode: ERROR_CODES.NOT_FOUND,
    });
  }

  return updatedRole;
};

export const deleteRole = async (roleId: string) => {
  const role = await getRoleById(roleId);
  assertRoleIsEditable(role);

  const deletedRole = await softDeleteRoleById(roleId);

  if (!deletedRole) {
    throw new AppError({
      message: 'Role not found',
      statusCode: HTTP_STATUS.NOT_FOUND,
      errorCode: ERROR_CODES.NOT_FOUND,
    });
  }

  return deletedRole;
};

export const getRolePermissions = async (roleId: string) => {
  const role = await getRoleById(roleId);
  return normalizePermissionCodes(role.permissions);
};

export const roleService = {
  listRoles,
  getRoleById,
  createRole,
  updateRole,
  deleteRole,
  getRolePermissions,
};
