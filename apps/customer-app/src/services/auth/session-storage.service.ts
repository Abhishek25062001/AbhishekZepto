import {
  CUSTOMER_ACCESS_TOKEN,
  CUSTOMER_ID,
  CUSTOMER_REFRESH_TOKEN,
} from '../../constants/storage-keys';
import {
  getSecureItem,
  removeSecureItem,
  setSecureItem,
} from '../storage/secure-storage.service';

export type CustomerSession = {
  accessToken: string;
  refreshToken: string;
  customerId: string;
};

export const saveCustomerSession = async (
  session: CustomerSession,
): Promise<void> => {
  await Promise.all([
    setSecureItem(CUSTOMER_ACCESS_TOKEN, session.accessToken),
    setSecureItem(CUSTOMER_REFRESH_TOKEN, session.refreshToken),
    setSecureItem(CUSTOMER_ID, session.customerId),
  ]);
};

export const loadCustomerSession =
  async (): Promise<CustomerSession | null> => {
    const [accessToken, refreshToken, customerId] = await Promise.all([
      getSecureItem(CUSTOMER_ACCESS_TOKEN),
      getSecureItem(CUSTOMER_REFRESH_TOKEN),
      getSecureItem(CUSTOMER_ID),
    ]);

    if (!accessToken || !refreshToken || !customerId) {
      return null;
    }

    return {
      accessToken,
      refreshToken,
      customerId,
    };
  };

export const clearCustomerSession = async (): Promise<void> => {
  await Promise.all([
    removeSecureItem(CUSTOMER_ACCESS_TOKEN),
    removeSecureItem(CUSTOMER_REFRESH_TOKEN),
    removeSecureItem(CUSTOMER_ID),
  ]);
};

