import {
  AUTH_PERMISSION_ACTION,
  AUTH_PERMISSION_RESOURCE,
} from '../../auth/constants/auth-permission.constants';
import { createPermissionCode } from '../../auth/utils/permission-code.util';

const supportRead = createPermissionCode(
  AUTH_PERMISSION_RESOURCE.SUPPORT,
  AUTH_PERMISSION_ACTION.READ,
);

const supportCreate = createPermissionCode(
  AUTH_PERMISSION_RESOURCE.SUPPORT,
  AUTH_PERMISSION_ACTION.CREATE,
);

const supportUpdate = createPermissionCode(
  AUTH_PERMISSION_RESOURCE.SUPPORT,
  AUTH_PERMISSION_ACTION.UPDATE,
);

const supportAssign = createPermissionCode(
  AUTH_PERMISSION_RESOURCE.SUPPORT,
  AUTH_PERMISSION_ACTION.ASSIGN,
);

const settingsManage = createPermissionCode(
  AUTH_PERMISSION_RESOURCE.SETTINGS,
  AUTH_PERMISSION_ACTION.MANAGE,
);

export const SUPPORT_OPERATIONS_PERMISSION_GROUPS = {
  READ: [supportRead, settingsManage],
  CREATE: [supportCreate, settingsManage],
  UPDATE: [supportUpdate, settingsManage],
  ASSIGN: [supportAssign, settingsManage],
  AUDIT: [supportRead, settingsManage],
} as const;

export const SUPPORT_OPERATIONS_PERMISSION_CODES = {
  READ: supportRead,
  CREATE: supportCreate,
  UPDATE: supportUpdate,
  ASSIGN: supportAssign,
} as const;
