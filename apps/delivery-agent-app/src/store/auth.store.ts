import { create } from 'zustand';
import type { AuthRole, AuthScope, PermissionCode } from '../../../../packages/shared/api';

export const isDeliveryAuthRole = (
  role: AuthRole | null,
): role is 'delivery_agent' => role === 'delivery_agent';

type AuthSessionInput = {
  accessToken: string;
  cityId?: AuthScope['cityId'];
  permissions?: PermissionCode[];
  refreshToken: string;
  deliveryAgentId: string;
  role?: AuthRole | null;
};

type AuthStoreState = {
  accessToken: string | null;
  refreshToken: string | null;
  deliveryAgentId: string | null;
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
  deliveryAgentId: null,
  cityId: null,
  role: null,
  permissions: [],
  isAuthenticated: false,
  setAuthSession: (session) =>
    set({
      accessToken: session.accessToken,
      refreshToken: session.refreshToken,
      deliveryAgentId: session.deliveryAgentId,
      cityId: session.cityId ?? null,
      role: session.role ?? null,
      permissions: session.permissions ?? [],
      isAuthenticated: true,
    }),
  clearAuthSession: () =>
    set({
      accessToken: null,
      refreshToken: null,
      deliveryAgentId: null,
      cityId: null,
      role: null,
      permissions: [],
      isAuthenticated: false,
    }),
}));
