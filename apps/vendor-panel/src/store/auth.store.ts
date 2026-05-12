import { create } from 'zustand';

type AuthSessionInput = {
  accessToken: string;
  refreshToken: string;
  vendorUserId: string;
  vendorId: string;
  storeId: string;
  role?: string | null;
  permissions?: string[];
};

type AuthStoreState = {
  accessToken: string | null;
  refreshToken: string | null;
  vendorUserId: string | null;
  vendorId: string | null;
  storeId: string | null;
  role: string | null;
  permissions: string[];
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
      role: null,
      permissions: [],
      isAuthenticated: false,
    }),
}));
