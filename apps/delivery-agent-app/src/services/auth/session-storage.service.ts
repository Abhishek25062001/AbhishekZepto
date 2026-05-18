import {
  DELIVERY_ACCESS_TOKEN,
  DELIVERY_AGENT_ID,
  DELIVERY_AUTH_STORAGE_KEYS,
  DELIVERY_CITY_ID,
  DELIVERY_PERMISSIONS,
  DELIVERY_REFRESH_TOKEN,
  DELIVERY_ROLE,
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

export type DeliverySession = {
  accessToken: string;
  cityId?: AuthScope['cityId'];
  permissions: PermissionCode[];
  refreshToken: string;
  deliveryAgentId: string;
  role: AuthRole | null;
};

export const saveDeliverySession = async (
  session: DeliverySession,
): Promise<void> => {
  await Promise.all([
    setSecureItem(DELIVERY_ACCESS_TOKEN, session.accessToken),
    setSecureItem(DELIVERY_REFRESH_TOKEN, session.refreshToken),
    setSecureItem(DELIVERY_AGENT_ID, session.deliveryAgentId),
    setSecureItem(DELIVERY_CITY_ID, session.cityId ?? ''),
    setSecureItem(DELIVERY_ROLE, session.role ?? ''),
    setSecureItem(DELIVERY_PERMISSIONS, JSON.stringify(session.permissions)),
  ]);
};

export const loadDeliverySession =
  async (): Promise<DeliverySession | null> => {
    const [accessToken, refreshToken, deliveryAgentId, cityId, role, permissions] =
      await Promise.all([
      getSecureItem(DELIVERY_ACCESS_TOKEN),
      getSecureItem(DELIVERY_REFRESH_TOKEN),
      getSecureItem(DELIVERY_AGENT_ID),
      getSecureItem(DELIVERY_CITY_ID),
      getSecureItem(DELIVERY_ROLE),
      getSecureItem(DELIVERY_PERMISSIONS),
    ]);

    if (!accessToken || !refreshToken || !deliveryAgentId) {
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
      deliveryAgentId,
      cityId: cityId || null,
      role: isAuthRole(role) ? role : null,
      permissions: parsedPermissions,
    };
  };

export const clearDeliverySession = async (): Promise<void> => {
  await Promise.all(
    DELIVERY_AUTH_STORAGE_KEYS.map((key) => removeSecureItem(key)),
  );
};
