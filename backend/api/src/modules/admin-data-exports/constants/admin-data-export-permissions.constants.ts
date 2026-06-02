import {
  AUTH_PERMISSION_ACTION,
  AUTH_PERMISSION_RESOURCE,
} from '../../auth/constants/auth-permission.constants';
import { createPermissionCode } from '../../auth/utils/permission-code.util';

export const ADMIN_DATA_EXPORT_PERMISSION_GROUPS = {
  EXPORT: [
    createPermissionCode(
      AUTH_PERMISSION_RESOURCE.REPORTS,
      AUTH_PERMISSION_ACTION.EXPORT,
    ),
  ],
} as const;
