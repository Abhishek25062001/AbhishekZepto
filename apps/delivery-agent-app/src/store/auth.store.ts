import { create } from 'zustand';

type AuthSessionInput = {
  accessToken: string;
  refreshToken: string;
  deliveryAgentId: string;
};

type AuthStoreState = {
  accessToken: string | null;
  refreshToken: string | null;
  deliveryAgentId: string | null;
  isAuthenticated: boolean;
  setAuthSession: (session: AuthSessionInput) => void;
  clearAuthSession: () => void;
};

export const useAuthStore = create<AuthStoreState>((set) => ({
  accessToken: null,
  refreshToken: null,
  deliveryAgentId: null,
  isAuthenticated: false,
  setAuthSession: (session) =>
    set({
      accessToken: session.accessToken,
      refreshToken: session.refreshToken,
      deliveryAgentId: session.deliveryAgentId,
      isAuthenticated: true,
    }),
  clearAuthSession: () =>
    set({
      accessToken: null,
      refreshToken: null,
      deliveryAgentId: null,
      isAuthenticated: false,
    }),
}));
