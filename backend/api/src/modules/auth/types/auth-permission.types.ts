import {
  AUTH_PERMISSION_ACTION,
  AUTH_PERMISSION_RESOURCE,
  WILDCARD_PERMISSION,
} from '../constants/auth-permission.constants';

export type PermissionAction =
  (typeof AUTH_PERMISSION_ACTION)[keyof typeof AUTH_PERMISSION_ACTION];

export type PermissionResource =
  (typeof AUTH_PERMISSION_RESOURCE)[keyof typeof AUTH_PERMISSION_RESOURCE];

export type PermissionCode =
  | `${PermissionResource}:${PermissionAction}`
  | typeof WILDCARD_PERMISSION;
