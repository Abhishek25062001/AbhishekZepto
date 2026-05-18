import { refreshToken } from '../api/auth.api';
import {
  DELIVERY_ACCESS_TOKEN,
  DELIVERY_REFRESH_TOKEN,
} from '../../constants/storage-keys';
import { useAuthStore } from '../../store/auth.store';
import {
  getSecureItem,
  setSecureItem,
} from '../storage/secure-storage.service';

type RefreshDeliveryAccessTokenResult =
  | { success: true; accessToken: string }
  | { success: false };

export async function refreshDeliveryAccessToken(): Promise<RefreshDeliveryAccessTokenResult> {
  const storedRefreshToken =
    useAuthStore.getState().refreshToken ??
    (await getSecureItem(DELIVERY_REFRESH_TOKEN));

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

    await setSecureItem(DELIVERY_ACCESS_TOKEN, response.data.accessToken);

    return {
      success: true,
      accessToken: response.data.accessToken,
    };
  } catch {
    return { success: false };
  }
}

// TODO: integrate this helper into the Axios 401 retry flow later.
