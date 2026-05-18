import { WILDCARD_PERMISSION } from '../constants/auth-permission.constants';
import type { PermissionCode } from '../types/auth-permission.types';
import { isPermissionCode } from '../utils/permission-code.util';

export const normalizePermissionCodes = (permissions: string[]): PermissionCode[] => {
  return Array.from(new Set(permissions)).filter(isPermissionCode);
};

export const resolveEffectivePermissions = ({
  rolePermissions,
  userPermissions,
}: {
  rolePermissions: string[];
  userPermissions: string[];
}): PermissionCode[] => {
  return normalizePermissionCodes([...rolePermissions, ...userPermissions]);
};

export const hasPermission = ({
  userPermissions,
  requiredPermission,
}: {
  userPermissions: readonly PermissionCode[];
  requiredPermission: PermissionCode;
}): boolean => {
  return (
    userPermissions.includes(requiredPermission) ||
    userPermissions.includes(WILDCARD_PERMISSION)
  );
};

export const hasAnyPermission = ({
  userPermissions,
  requiredPermissions,
}: {
  userPermissions: readonly PermissionCode[];
  requiredPermissions: readonly PermissionCode[];
}): boolean => {
  return requiredPermissions.some((requiredPermission) =>
    hasPermission({ userPermissions, requiredPermission }),
  );
};

export const hasAllPermissions = ({
  userPermissions,
  requiredPermissions,
}: {
  userPermissions: readonly PermissionCode[];
  requiredPermissions: readonly PermissionCode[];
}): boolean => {
  return requiredPermissions.every((requiredPermission) =>
    hasPermission({ userPermissions, requiredPermission }),
  );
};
