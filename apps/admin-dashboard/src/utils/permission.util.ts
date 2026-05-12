export function hasPermission(permissions: string[], requiredPermission: string) {
  return permissions.includes('*:*') || permissions.includes(requiredPermission);
}
