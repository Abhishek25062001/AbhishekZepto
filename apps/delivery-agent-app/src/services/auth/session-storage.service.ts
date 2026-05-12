import {
  DELIVERY_ACCESS_TOKEN,
  DELIVERY_AGENT_ID,
  DELIVERY_REFRESH_TOKEN,
} from '../../constants/storage-keys';
import {
  getSecureItem,
  removeSecureItem,
  setSecureItem,
} from '../storage/secure-storage.service';

export type DeliverySession = {
  accessToken: string;
  refreshToken: string;
  deliveryAgentId: string;
};

export const saveDeliverySession = async (
  session: DeliverySession,
): Promise<void> => {
  await Promise.all([
    setSecureItem(DELIVERY_ACCESS_TOKEN, session.accessToken),
    setSecureItem(DELIVERY_REFRESH_TOKEN, session.refreshToken),
    setSecureItem(DELIVERY_AGENT_ID, session.deliveryAgentId),
  ]);
};

export const loadDeliverySession =
  async (): Promise<DeliverySession | null> => {
    const [accessToken, refreshToken, deliveryAgentId] = await Promise.all([
      getSecureItem(DELIVERY_ACCESS_TOKEN),
      getSecureItem(DELIVERY_REFRESH_TOKEN),
      getSecureItem(DELIVERY_AGENT_ID),
    ]);

    if (!accessToken || !refreshToken || !deliveryAgentId) {
      return null;
    }

    return {
      accessToken,
      refreshToken,
      deliveryAgentId,
    };
  };

export const clearDeliverySession = async (): Promise<void> => {
  await Promise.all([
    removeSecureItem(DELIVERY_ACCESS_TOKEN),
    removeSecureItem(DELIVERY_REFRESH_TOKEN),
    removeSecureItem(DELIVERY_AGENT_ID),
  ]);
};

