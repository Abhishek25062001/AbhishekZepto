import { CUSTOMER_PUSH_DEVICE_ID } from '../../../constants/storage-keys';
import { getSecureItem, setSecureItem } from '../../../services/storage/secure-storage.service';

const generateDeviceId = (): string =>
  `customer-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;

export const getOrCreateCustomerDeviceId = async (): Promise<string> => {
  const existingDeviceId = await getSecureItem(CUSTOMER_PUSH_DEVICE_ID);
  if (existingDeviceId) {
    return existingDeviceId;
  }

  const deviceId = generateDeviceId();
  await setSecureItem(CUSTOMER_PUSH_DEVICE_ID, deviceId);
  return deviceId;
};
