import type { PermissionCode } from '../../../../packages/shared/api';

export function hasPermission(
  permissions: readonly PermissionCode[],
  requiredPermission: PermissionCode,
) {
  return permissions.includes('*:*') || permissions.includes(requiredPermission);
}

export function hasAnyPermission(
  permissions: readonly PermissionCode[],
  requiredPermissions: readonly PermissionCode[],
) {
  return requiredPermissions.some((requiredPermission) =>
    hasPermission(permissions, requiredPermission),
  );
}
