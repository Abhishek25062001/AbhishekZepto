import { create } from 'zustand';

import type { CustomerPushPermissionStatus } from '../types/customer-push.types';

type CustomerPushStoreState = {
  deviceId: string | null;
  error: string | null;
  fcmToken: string | null;
  isRegistered: boolean;
  lastPushReceivedAt: string | null;
  permissionStatus: CustomerPushPermissionStatus;
  clearPushState: () => void;
  setDeviceId: (deviceId: string | null) => void;
  setFcmToken: (fcmToken: string | null) => void;
  setPermissionStatus: (permissionStatus: CustomerPushPermissionStatus) => void;
  setPushError: (error: string | null) => void;
  setPushReceivedAt: (receivedAt: string | null) => void;
  setRegistered: (isRegistered: boolean) => void;
};

export const useCustomerPushStore = create<CustomerPushStoreState>((set) => ({
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
