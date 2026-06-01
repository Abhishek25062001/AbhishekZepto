import {
  AUTH_PERMISSION_ACTION,
  AUTH_PERMISSION_RESOURCE,
} from '../../auth/constants/auth-permission.constants';
import { createPermissionCode } from '../../auth/utils/permission-code.util';

const customerRead = createPermissionCode(
  AUTH_PERMISSION_RESOURCE.CUSTOMER,
  AUTH_PERMISSION_ACTION.READ,
);

const customerUpdate = createPermissionCode(
  AUTH_PERMISSION_RESOURCE.CUSTOMER,
  AUTH_PERMISSION_ACTION.UPDATE,
);

const customerUpdateStatus = createPermissionCode(
  AUTH_PERMISSION_RESOURCE.CUSTOMER,
  AUTH_PERMISSION_ACTION.UPDATE_STATUS,
);

const settingsManage = createPermissionCode(
  AUTH_PERMISSION_RESOURCE.SETTINGS,
  AUTH_PERMISSION_ACTION.MANAGE,
);

export const CUSTOMER_MANAGEMENT_PERMISSION_GROUPS = {
  READ: [customerRead, settingsManage],
  STATUS: [customerUpdateStatus, settingsManage],
  NOTES: [customerUpdate, settingsManage],
  AUDIT: [customerRead, settingsManage],
} as const;
