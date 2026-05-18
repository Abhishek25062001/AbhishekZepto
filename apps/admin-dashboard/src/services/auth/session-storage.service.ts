import type { AuthRole, PermissionCode } from '../../../../../packages/shared/api';
import {
  ADMIN_ACCESS_TOKEN,
  ADMIN_ID,
  ADMIN_PERMISSIONS,
  ADMIN_REFRESH_TOKEN,
  ADMIN_ROLE,
  ADMIN_SESSION_STORAGE_KEYS,
} from '../../constants/storage-keys';

const authRoles: readonly AuthRole[] = [
  'customer',
  'delivery_agent',
  'vendor_owner',
  'store_manager',
  'store_staff',
  'support_admin',
  'operations_admin',
  'super_admin',
];

const isAuthRole = (value: string | null): value is AuthRole => {
  return value !== null && authRoles.includes(value as AuthRole);
};

export type AdminSession = {
  accessToken: string;
  adminId: string;
  permissions: PermissionCode[];
  refreshToken: string;
  role: AuthRole | null;
};

function getStorage() {
  if (typeof window === 'undefined') {
    return null;
  }

  return window.localStorage;
}

export function saveAdminSession(session: AdminSession) {
  const storage = getStorage();

  if (!storage) {
    return;
  }

  // Token values handled here must never be logged.
  storage.setItem(ADMIN_ACCESS_TOKEN, session.accessToken);
  storage.setItem(ADMIN_REFRESH_TOKEN, session.refreshToken);
  storage.setItem(ADMIN_ID, session.adminId);
  storage.setItem(ADMIN_ROLE, session.role ?? '');
  storage.setItem(ADMIN_PERMISSIONS, JSON.stringify(session.permissions));
}

export function loadAdminSession(): AdminSession | null {
  const storage = getStorage();

  if (!storage) {
    return null;
  }

  const accessToken = storage.getItem(ADMIN_ACCESS_TOKEN);
  const refreshToken = storage.getItem(ADMIN_REFRESH_TOKEN);
  const adminId = storage.getItem(ADMIN_ID);
  const role = storage.getItem(ADMIN_ROLE);
  const permissions = storage.getItem(ADMIN_PERMISSIONS);

  if (!accessToken || !refreshToken || !adminId) {
    return null;
  }

  let parsedPermissions: PermissionCode[] = [];

  if (permissions) {
    try {
      parsedPermissions = JSON.parse(permissions) as PermissionCode[];
    } catch {
      parsedPermissions = [];
    }
  }

  return {
    accessToken,
    adminId,
    permissions: parsedPermissions,
    refreshToken,
    role: isAuthRole(role) ? role : null,
  };
}

export function clearAdminSession() {
  const storage = getStorage();

  if (!storage) {
    return;
  }

  ADMIN_SESSION_STORAGE_KEYS.forEach((key) => storage.removeItem(key));
}
