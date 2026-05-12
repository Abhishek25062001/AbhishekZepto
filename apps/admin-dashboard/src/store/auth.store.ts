import { create } from 'zustand';

type AuthSessionInput = {
  accessToken: string;
  refreshToken: string;
  adminId: string;
  role?: string | null;
  permissions?: string[];
};

type AuthStoreState = {
  accessToken: string | null;
  refreshToken: string | null;
  adminId: string | null;
  role: string | null;
  permissions: string[];
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
