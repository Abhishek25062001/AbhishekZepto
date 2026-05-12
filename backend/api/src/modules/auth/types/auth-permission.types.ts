import {
  AUTH_PERMISSION_ACTION,
  AUTH_PERMISSION_RESOURCE,
} from '../constants/auth-permission.constants';

export type PermissionAction =
  (typeof AUTH_PERMISSION_ACTION)[keyof typeof AUTH_PERMISSION_ACTION];

export type PermissionResource =
  (typeof AUTH_PERMISSION_RESOURCE)[keyof typeof AUTH_PERMISSION_RESOURCE];

export type PermissionCode = string;
