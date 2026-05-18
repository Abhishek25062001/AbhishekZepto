export const shouldRenderPermissionGatedContent = (
  permissions: readonly string[],
  requiredPermission: string,
): boolean => permissions.includes('*:*') || permissions.includes(requiredPermission);

export const shouldRenderAnyPermissionGatedContent = (
  permissions: readonly string[],
  requiredPermissions: readonly string[],
): boolean =>
  requiredPermissions.some((requiredPermission) =>
    shouldRenderPermissionGatedContent(permissions, requiredPermission),
  );
