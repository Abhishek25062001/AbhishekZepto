import {
  AUTH_PERMISSION_ACTION,
  AUTH_PERMISSION_RESOURCE,
} from '../../auth/constants/auth-permission.constants';
import { createPermissionCode } from '../../auth/utils/permission-code.util';

export const OPERATIONAL_ANALYTICS_PERMISSION_GROUPS = {
  READ: [
    createPermissionCode(
      AUTH_PERMISSION_RESOURCE.REPORTS,
      AUTH_PERMISSION_ACTION.READ,
    ),
  ],
} as const;
