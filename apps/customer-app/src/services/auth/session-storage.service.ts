import {
  CUSTOMER_ACCESS_TOKEN,
  CUSTOMER_CITY_ID,
  CUSTOMER_ID,
  CUSTOMER_PERMISSIONS,
  CUSTOMER_REFRESH_TOKEN,
  CUSTOMER_ROLE,
  CUSTOMER_AUTH_STORAGE_KEYS,
} from '../../constants/storage-keys';
import type { AuthRole, AuthScope, PermissionCode } from '../../../../../packages/shared/api';
import {
  getSecureItem,
  removeSecureItem,
  setSecureItem,
} from '../storage/secure-storage.service';

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

export type CustomerSession = {
  accessToken: string;
  cityId?: AuthScope['cityId'];
  permissions: PermissionCode[];
  refreshToken: string;
  customerId: string;
  role: AuthRole | null;
};

export const saveCustomerSession = async (
  session: CustomerSession,
): Promise<void> => {
  await Promise.all([
    setSecureItem(CUSTOMER_ACCESS_TOKEN, session.accessToken),
    setSecureItem(CUSTOMER_REFRESH_TOKEN, session.refreshToken),
    setSecureItem(CUSTOMER_ID, session.customerId),
    setSecureItem(CUSTOMER_CITY_ID, session.cityId ?? ''),
    setSecureItem(CUSTOMER_ROLE, session.role ?? ''),
    setSecureItem(CUSTOMER_PERMISSIONS, JSON.stringify(session.permissions)),
  ]);
};

export const loadCustomerSession =
  async (): Promise<CustomerSession | null> => {
    const [accessToken, refreshToken, customerId, cityId, role, permissions] = await Promise.all([
      getSecureItem(CUSTOMER_ACCESS_TOKEN),
      getSecureItem(CUSTOMER_REFRESH_TOKEN),
      getSecureItem(CUSTOMER_ID),
      getSecureItem(CUSTOMER_CITY_ID),
      getSecureItem(CUSTOMER_ROLE),
      getSecureItem(CUSTOMER_PERMISSIONS),
    ]);

    if (!accessToken || !refreshToken || !customerId) {
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
      customerId,
      cityId: cityId || null,
      role: isAuthRole(role) ? role : null,
      permissions: parsedPermissions,
    };
  };

export const clearCustomerSession = async (): Promise<void> => {
  await Promise.all(CUSTOMER_AUTH_STORAGE_KEYS.map((key) => removeSecureItem(key)));
};
