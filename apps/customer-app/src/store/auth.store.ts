import { create } from 'zustand';

type AuthSessionInput = {
  accessToken: string;
  refreshToken: string;
  customerId: string;
};

type AuthStoreState = {
  accessToken: string | null;
  refreshToken: string | null;
  customerId: string | null;
  isAuthenticated: boolean;
  setAuthSession: (session: AuthSessionInput) => void;
  clearAuthSession: () => void;
};

export const useAuthStore = create<AuthStoreState>((set) => ({
  accessToken: null,
  refreshToken: null,
  customerId: null,
  isAuthenticated: false,
  setAuthSession: (session) =>
    set({
      accessToken: session.accessToken,
      refreshToken: session.refreshToken,
      customerId: session.customerId,
      isAuthenticated: true,
    }),
  clearAuthSession: () =>
    set({
      accessToken: null,
      refreshToken: null,
      customerId: null,
      isAuthenticated: false,
    }),
}));
