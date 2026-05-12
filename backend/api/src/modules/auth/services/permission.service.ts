import { WILDCARD_PERMISSION } from '../constants/auth-permission.constants';
import type { PermissionCode } from '../types/auth-permission.types';

export const hasPermission = ({
  userPermissions,
  requiredPermission,
}: {
  userPermissions: PermissionCode[];
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
  userPermissions: PermissionCode[];
  requiredPermissions: PermissionCode[];
}): boolean => {
  return requiredPermissions.some((requiredPermission) =>
    hasPermission({ userPermissions, requiredPermission }),
  );
};

export const hasAllPermissions = ({
  userPermissions,
  requiredPermissions,
}: {
  userPermissions: PermissionCode[];
  requiredPermissions: PermissionCode[];
}): boolean => {
  return requiredPermissions.every((requiredPermission) =>
    hasPermission({ userPermissions, requiredPermission }),
  );
};
