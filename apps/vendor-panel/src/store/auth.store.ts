import { create } from 'zustand';
import type { AuthRole, AuthScope, PermissionCode } from '../../../../packages/shared/api';

const vendorAuthRoles = ['vendor_owner', 'store_manager', 'store_staff'] as const;

export const isVendorAuthRole = (
  role: AuthRole | null,
): role is (typeof vendorAuthRoles)[number] => {
  return role !== null && vendorAuthRoles.includes(role as (typeof vendorAuthRoles)[number]);
};

type AuthSessionInput = {
  accessToken: string;
  cityId?: AuthScope['cityId'];
  refreshToken: string;
  vendorUserId: string;
  vendorId: string;
  storeId: string;
  role?: AuthRole | null;
  permissions?: PermissionCode[];
};

type AuthStoreState = {
  accessToken: string | null;
  refreshToken: string | null;
  vendorUserId: string | null;
  vendorId: string | null;
  storeId: string | null;
  cityId: string | null;
  role: AuthRole | null;
  permissions: PermissionCode[];
  isAuthenticated: boolean;
  setAuthSession: (session: AuthSessionInput) => void;
  clearAuthSession: () => void;
};

export const useAuthStore = create<AuthStoreState>((set) => ({
  accessToken: null,
  refreshToken: null,
  vendorUserId: null,
  vendorId: null,
  storeId: null,
  cityId: null,
  role: null,
  permissions: [],
  isAuthenticated: false,
  setAuthSession: (session) =>
    set({
      accessToken: session.accessToken,
      refreshToken: session.refreshToken,
      vendorUserId: session.vendorUserId,
      vendorId: session.vendorId,
      storeId: session.storeId,
      cityId: session.cityId ?? null,
      role: session.role ?? null,
      permissions: session.permissions ?? [],
      isAuthenticated: true,
    }),
  clearAuthSession: () =>
    set({
      accessToken: null,
      refreshToken: null,
      vendorUserId: null,
      vendorId: null,
      storeId: null,
      cityId: null,
      role: null,
      permissions: [],
      isAuthenticated: false,
    }),
}));
