"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useDeliveryPushStore = void 0;
const zustand_1 = require("zustand");
exports.useDeliveryPushStore = (0, zustand_1.create)((set) => ({
    deviceId: null,
    error: null,
    fcmToken: null,
    isRegistered: false,
    lastPushReceivedAt: null,
    permissionStatus: 'unavailable',
    clearPushState: () => set({
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
