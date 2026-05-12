import * as Keychain from 'react-native-keychain';

import { DELIVERY_AUTH_STORAGE_KEYS } from '../../constants/storage-keys';

const deliveryServiceName = (key: string) => `zepto_delivery_${key}`;

export const setSecureItem = async (
  key: string,
  value: string,
): Promise<void> => {
  // Token values handled here must never be logged.
  await Keychain.setGenericPassword(key, value, {
    service: deliveryServiceName(key),
  });
};

export const getSecureItem = async (key: string): Promise<string | null> => {
  const credentials = await Keychain.getGenericPassword({
    service: deliveryServiceName(key),
  });

  if (!credentials) {
    return null;
  }

  return credentials.password;
};

export const removeSecureItem = async (key: string): Promise<void> => {
  await Keychain.resetGenericPassword({
    service: deliveryServiceName(key),
  });
};

export const clearAuthStorage = async (): Promise<void> => {
  await Promise.all(
    DELIVERY_AUTH_STORAGE_KEYS.map((key) => removeSecureItem(key)),
  );
};
