import { DELIVERY_LAST_BACKGROUND_PUSH_PAYLOAD } from '../../../constants/storage-keys';
import { setSecureItem } from '../../../services/storage/secure-storage.service';
import { setBackgroundMessageHandler } from './delivery-fcm.service';

export const registerDeliveryBackgroundPushHandler = (): void => {
  setBackgroundMessageHandler(async (message) => {
    await setSecureItem(
      DELIVERY_LAST_BACKGROUND_PUSH_PAYLOAD,
      JSON.stringify(message.data ?? {}),
    );
  });
};
