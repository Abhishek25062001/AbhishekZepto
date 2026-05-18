import { create } from 'zustand';
import type { AuthRole, PermissionCode } from '../../../../packages/shared/api';

const adminAuthRoles = ['support_admin', 'operations_admin', 'super_admin'] as const;

export const isAdminAuthRole = (
  role: AuthRole | null,
): role is (typeof adminAuthRoles)[number] => {
  return role !== null && adminAuthRoles.includes(role as (typeof adminAuthRoles)[number]);
};

type AuthSessionInput = {
  accessToken: string;
  refreshToken: string;
  adminId: string;
  role?: AuthRole | null;
  permissions?: PermissionCode[];
};

type AuthStoreState = {
  accessToken: string | null;
  refreshToken: string | null;
  adminId: string | null;
  role: AuthRole | null;
  permissions: PermissionCode[];
  isAuthenticated: boolean;
  setAuthSession: (session: AuthSessionInput) => void;
  clearAuthSession: () => void;
};

export const useAuthStore = create<AuthStoreState>((set) => ({
  accessToken: null,
  refreshToken: null,
  adminId: null,
  role: null,
  permissions: [],
  isAuthenticated: false,
  setAuthSession: (session) =>
    set({
      accessToken: session.accessToken,
      refreshToken: session.refreshToken,
      adminId: session.adminId,
      role: session.role ?? null,
      permissions: session.permissions ?? [],
      isAuthenticated: true,
    }),
  clearAuthSession: () =>
    set({
      accessToken: null,
      refreshToken: null,
      adminId: null,
      role: null,
      permissions: [],
      isAuthenticated: false,
    }),
}));
