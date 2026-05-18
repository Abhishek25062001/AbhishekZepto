import { refreshToken } from '../api/auth.api';
import { VENDOR_ACCESS_TOKEN, VENDOR_REFRESH_TOKEN } from '../../constants/storage-keys';
import { useAuthStore } from '../../store/auth.store';

type RefreshVendorAccessTokenResult =
  | { success: true; accessToken: string }
  | { success: false };

export async function refreshVendorAccessToken(): Promise<RefreshVendorAccessTokenResult> {
  const storage = typeof window === 'undefined' ? null : window.localStorage;
  const storedRefreshToken =
    useAuthStore.getState().refreshToken ??
    storage?.getItem(VENDOR_REFRESH_TOKEN) ??
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

    storage?.setItem(VENDOR_ACCESS_TOKEN, response.data.accessToken);

    return {
      success: true,
      accessToken: response.data.accessToken,
    };
  } catch {
    return { success: false };
  }
}

// TODO: integrate this helper into the Axios 401 retry flow later.
