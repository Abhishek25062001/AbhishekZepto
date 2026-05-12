import * as Keychain from 'react-native-keychain';

import { CUSTOMER_AUTH_STORAGE_KEYS } from '../../constants/storage-keys';

const customerServiceName = (key: string) => `zepto_customer_${key}`;

export const setSecureItem = async (
  key: string,
  value: string,
): Promise<void> => {
  // Token values handled here must never be logged.
  await Keychain.setGenericPassword(key, value, {
    service: customerServiceName(key),
  });
};

export const getSecureItem = async (key: string): Promise<string | null> => {
  const credentials = await Keychain.getGenericPassword({
    service: customerServiceName(key),
  });

  if (!credentials) {
    return null;
  }

  return credentials.password;
};

export const removeSecureItem = async (key: string): Promise<void> => {
  await Keychain.resetGenericPassword({
    service: customerServiceName(key),
  });
};

export const clearAuthStorage = async (): Promise<void> => {
  await Promise.all(
    CUSTOMER_AUTH_STORAGE_KEYS.map((key) => removeSecureItem(key)),
  );
};
