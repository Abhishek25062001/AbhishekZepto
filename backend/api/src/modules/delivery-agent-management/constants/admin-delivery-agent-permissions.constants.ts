import {
  AUTH_PERMISSION_ACTION,
  AUTH_PERMISSION_RESOURCE,
} from '../../auth/constants/auth-permission.constants';
import { createPermissionCode } from '../../auth/utils/permission-code.util';

const deliveryRead = createPermissionCode(
  AUTH_PERMISSION_RESOURCE.DELIVERY,
  AUTH_PERMISSION_ACTION.READ,
);

const deliveryUpdate = createPermissionCode(
  AUTH_PERMISSION_RESOURCE.DELIVERY,
  AUTH_PERMISSION_ACTION.UPDATE,
);

const deliveryUpdateStatus = createPermissionCode(
  AUTH_PERMISSION_RESOURCE.DELIVERY,
  AUTH_PERMISSION_ACTION.UPDATE_STATUS,
);

const settingsManage = createPermissionCode(
  AUTH_PERMISSION_RESOURCE.SETTINGS,
  AUTH_PERMISSION_ACTION.MANAGE,
);

export const DELIVERY_AGENT_MANAGEMENT_PERMISSION_GROUPS = {
  READ: [deliveryRead, settingsManage],
  STATUS: [deliveryUpdateStatus, settingsManage],
  VERIFICATION: [deliveryUpdate, settingsManage],
  AUDIT: [deliveryRead, settingsManage],
} as const;
