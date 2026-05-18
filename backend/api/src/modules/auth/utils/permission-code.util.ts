import { WILDCARD_PERMISSION } from '../constants/auth-permission.constants';
import type {
  PermissionCode,
  PermissionAction,
  PermissionResource,
} from '../types/auth-permission.types';

export const createPermissionCode = (
  resource: PermissionResource,
  action: PermissionAction,
): PermissionCode => {
  return `${resource}:${action}`;
};

export const isWildcardPermission = (
  permissionCode: string,
): permissionCode is typeof WILDCARD_PERMISSION => {
  return permissionCode === WILDCARD_PERMISSION;
};

export const isPermissionCode = (
  permissionCode: string,
): permissionCode is PermissionCode => {
  if (isWildcardPermission(permissionCode)) {
    return true;
  }

  return permissionCode.includes(':');
};
