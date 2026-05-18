import { refreshToken } from '../api/auth.api';
import { ADMIN_ACCESS_TOKEN, ADMIN_REFRESH_TOKEN } from '../../constants/storage-keys';
import { useAuthStore } from '../../store/auth.store';

type RefreshAdminAccessTokenResult =
  | { success: true; accessToken: string }
  | { success: false };

export async function refreshAdminAccessToken(): Promise<RefreshAdminAccessTokenResult> {
  const storage = typeof window === 'undefined' ? null : window.localStorage;
  const storedRefreshToken =
    useAuthStore.getState().refreshToken ??
    storage?.getItem(ADMIN_REFRESH_TOKEN) ??
    null;

  if (!storedRefreshToken) {
    return { success: false };
  }

  try {
    const response = await refreshToken({
      refreshToken: storedRefreshToken,
    });

    useAuthStore.setState((state) => ({
      ...state,
      accessToken: response.data.accessToken,
      refreshToken: storedRefreshToken,
    }));

    storage?.setItem(ADMIN_ACCESS_TOKEN, response.data.accessToken);

    return {
      success: true,
      accessToken: response.data.accessToken,
    };
  } catch {
    return { success: false };
  }
}

// TODO: integrate this helper into the Axios 401 retry flow later.
