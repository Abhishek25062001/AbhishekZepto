import {
  AUTH_PERMISSION_ACTION,
  AUTH_PERMISSION_RESOURCE,
} from '../../auth/constants/auth-permission.constants';
import { createPermissionCode } from '../../auth/utils/permission-code.util';

const storesRead = createPermissionCode(
  AUTH_PERMISSION_RESOURCE.STORES,
  AUTH_PERMISSION_ACTION.READ,
);

const storesUpdate = createPermissionCode(
  AUTH_PERMISSION_RESOURCE.STORES,
  AUTH_PERMISSION_ACTION.UPDATE,
);

const settingsManage = createPermissionCode(
  AUTH_PERMISSION_RESOURCE.SETTINGS,
  AUTH_PERMISSION_ACTION.MANAGE,
);

export const VENDOR_STORE_MANAGEMENT_PERMISSION_GROUPS = {
  VENDOR_READ: [storesRead, settingsManage],
  VENDOR_STATUS: [storesUpdate, settingsManage],
  STORE_READ: [storesRead, settingsManage],
  STORE_STATUS: [storesUpdate, settingsManage],
  STORE_AUDIT: [storesRead, settingsManage],
} as const;
