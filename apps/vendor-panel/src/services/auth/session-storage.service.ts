import type { AuthRole, AuthScope, PermissionCode } from '../../../../../packages/shared/api';
import {
  STORE_ID,
  VENDOR_ACCESS_TOKEN,
  VENDOR_CITY_ID,
  VENDOR_ID,
  VENDOR_PERMISSIONS,
  VENDOR_REFRESH_TOKEN,
  VENDOR_ROLE,
  VENDOR_SESSION_STORAGE_KEYS,
  VENDOR_USER_ID,
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

export type VendorSession = {
  accessToken: string;
  cityId?: AuthScope['cityId'];
  permissions: PermissionCode[];
  refreshToken: string;
  role: AuthRole | null;
  storeId: string;
  vendorId: string;
  vendorUserId: string;
};

export const hasVendorSessionScope = (
  session: Pick<VendorSession, 'vendorId' | 'storeId'> | null,
): boolean => {
  if (!session) {
    return false;
  }

  return session.vendorId.trim().length > 0 && session.storeId.trim().length > 0;
};

function getStorage() {
  if (typeof window === 'undefined') {
    return null;
  }

  return window.localStorage;
}

export function saveVendorSession(session: VendorSession) {
  const storage = getStorage();

  if (!storage) {
    return;
  }

  // Token values handled here must never be logged.
  storage.setItem(VENDOR_ACCESS_TOKEN, session.accessToken);
  storage.setItem(VENDOR_REFRESH_TOKEN, session.refreshToken);
  storage.setItem(VENDOR_USER_ID, session.vendorUserId);
  storage.setItem(VENDOR_ID, session.vendorId);
  storage.setItem(STORE_ID, session.storeId);
  storage.setItem(VENDOR_CITY_ID, session.cityId ?? '');
  storage.setItem(VENDOR_ROLE, session.role ?? '');
  storage.setItem(VENDOR_PERMISSIONS, JSON.stringify(session.permissions));
}

export function loadVendorSession(): VendorSession | null {
  const storage = getStorage();

  if (!storage) {
    return null;
  }

  const accessToken = storage.getItem(VENDOR_ACCESS_TOKEN);
  const refreshToken = storage.getItem(VENDOR_REFRESH_TOKEN);
  const vendorUserId = storage.getItem(VENDOR_USER_ID);
  const vendorId = storage.getItem(VENDOR_ID);
  const storeId = storage.getItem(STORE_ID);
  const cityId = storage.getItem(VENDOR_CITY_ID);
  const role = storage.getItem(VENDOR_ROLE);
  const permissions = storage.getItem(VENDOR_PERMISSIONS);

  if (!accessToken || !refreshToken || !vendorUserId || !vendorId || !storeId) {
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
    refreshToken,
    role: isAuthRole(role) ? role : null,
    storeId,
    vendorId,
    vendorUserId,
    cityId: cityId || null,
    permissions: parsedPermissions,
  };
}

export function clearVendorSession() {
  const storage = getStorage();

  if (!storage) {
    return;
  }

  VENDOR_SESSION_STORAGE_KEYS.forEach((key) => storage.removeItem(key));
}
