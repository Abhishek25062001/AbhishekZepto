import type {
  PermissionAction,
  PermissionResource,
} from '../types/auth-permission.types';

export const createPermissionCode = (
  resource: PermissionResource,
  action: PermissionAction,
): string => {
  return `${resource}:${action}`;
};
