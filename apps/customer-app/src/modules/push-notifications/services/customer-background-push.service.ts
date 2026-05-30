import { CUSTOMER_LAST_BACKGROUND_PUSH_PAYLOAD } from '../../../constants/storage-keys';
import { setSecureItem } from '../../../services/storage/secure-storage.service';
import { setBackgroundMessageHandler } from './customer-fcm.service';

export const registerCustomerBackgroundPushHandler = (): void => {
  setBackgroundMessageHandler(async (message) => {
    await setSecureItem(
      CUSTOMER_LAST_BACKGROUND_PUSH_PAYLOAD,
      JSON.stringify(message.data ?? {}),
    );
  });
};
