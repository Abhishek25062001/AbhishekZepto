import { create } from 'zustand';

import type { DeliveryPushPermissionStatus } from '../types/delivery-push.types';

type DeliveryPushStoreState = {
  deviceId: string | null;
  error: string | null;
  fcmToken: string | null;
  isRegistered: boolean;
  lastPushReceivedAt: string | null;
  permissionStatus: DeliveryPushPermissionStatus;
  clearPushState: () => void;
  setDeviceId: (deviceId: string | null) => void;
  setFcmToken: (fcmToken: string | null) => void;
  setPermissionStatus: (permissionStatus: DeliveryPushPermissionStatus) => void;
  setPushError: (error: string | null) => void;
  setPushReceivedAt: (receivedAt: string | null) => void;
  setRegistered: (isRegistered: boolean) => void;
};

export const useDeliveryPushStore = create<DeliveryPushStoreState>((set) => ({
  deviceId: null,
  error: null,
  fcmToken: null,
  isRegistered: false,
  lastPushReceivedAt: null,
  permissionStatus: 'unavailable',
  clearPushState: () =>
    set({
      deviceId: null,
      error: null,
      fcmToken: null,
      isRegistered: false,
      lastPushReceivedAt: null,
      permissionStatus: 'unavailable',
    }),
  setDeviceId: (deviceId) => set({ deviceId }),
  setFcmToken: (fcmToken) => set({ fcmToken }),
  setPermissionStatus: (permissionStatus) => set({ permissionStatus }),
  setPushError: (error) => set({ error }),
  setPushReceivedAt: (lastPushReceivedAt) => set({ lastPushReceivedAt }),
  setRegistered: (isRegistered) => set({ isRegistered }),
}));
