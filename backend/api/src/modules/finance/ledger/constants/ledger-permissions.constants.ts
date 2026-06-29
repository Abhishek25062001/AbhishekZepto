import {
  AUTH_PERMISSION_ACTION,
  AUTH_PERMISSION_RESOURCE,
} from '../../../auth/constants/auth-permission.constants';
import { createPermissionCode } from '../../../auth/utils/permission-code.util';

export const LEDGER_PERMISSIONS = {
  READ: createPermissionCode(AUTH_PERMISSION_RESOURCE.FINANCE_LEDGER, AUTH_PERMISSION_ACTION.READ),
  MANAGE_ACCOUNTS: createPermissionCode(
    AUTH_PERMISSION_RESOURCE.FINANCE_LEDGER,
    AUTH_PERMISSION_ACTION.MANAGE_ACCOUNTS,
  ),
  REVERSE: createPermissionCode(
    AUTH_PERMISSION_RESOURCE.FINANCE_LEDGER,
    AUTH_PERMISSION_ACTION.REVERSE,
  ),
  MANUAL_ADJUSTMENT: createPermissionCode(
    AUTH_PERMISSION_RESOURCE.FINANCE_LEDGER,
    AUTH_PERMISSION_ACTION.MANUAL_ADJUSTMENT,
  ),
} as const;
