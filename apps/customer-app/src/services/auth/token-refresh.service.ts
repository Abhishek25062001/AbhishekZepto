import { refreshToken } from '../api/auth.api';
import {
  CUSTOMER_ACCESS_TOKEN,
  CUSTOMER_REFRESH_TOKEN,
} from '../../constants/storage-keys';
import { useAuthStore } from '../../store/auth.store';
import {
  getSecureItem,
  setSecureItem,
} from '../storage/secure-storage.service';

type RefreshCustomerAccessTokenResult =
  | { success: true; accessToken: string }
  | { success: false };

export async function refreshCustomerAccessToken(): Promise<RefreshCustomerAccessTokenResult> {
  const storedRefreshToken =
    useAuthStore.getState().refreshToken ??
    (await getSecureItem(CUSTOMER_REFRESH_TOKEN));

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

    await setSecureItem(CUSTOMER_ACCESS_TOKEN, response.data.accessToken);

    return {
      success: true,
      accessToken: response.data.accessToken,
    };
  } catch {
    return { success: false };
  }
}

// TODO: integrate this helper into the Axios 401 retry flow later.
