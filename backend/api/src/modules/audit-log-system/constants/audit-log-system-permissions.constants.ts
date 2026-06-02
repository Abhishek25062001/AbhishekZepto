import {
  AUTH_PERMISSION_ACTION,
  AUTH_PERMISSION_RESOURCE,
} from '../../auth/constants/auth-permission.constants';
import { createPermissionCode } from '../../auth/utils/permission-code.util';

const auditLogsRead = createPermissionCode(
  AUTH_PERMISSION_RESOURCE.AUDIT_LOGS,
  AUTH_PERMISSION_ACTION.READ,
);

export const AUDIT_LOG_SYSTEM_PERMISSION_GROUPS = {
  READ: [auditLogsRead],
} as const;
