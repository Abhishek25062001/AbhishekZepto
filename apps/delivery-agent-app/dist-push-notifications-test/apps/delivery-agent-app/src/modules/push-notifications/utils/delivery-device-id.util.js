"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOrCreateDeliveryDeviceId = void 0;
const storage_keys_1 = require("../../../constants/storage-keys");
const secure_storage_service_1 = require("../../../services/storage/secure-storage.service");
const generateDeviceId = () => `delivery-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
const getOrCreateDeliveryDeviceId = async () => {
    const existingDeviceId = await (0, secure_storage_service_1.getSecureItem)(storage_keys_1.DELIVERY_PUSH_DEVICE_ID);
    if (existingDeviceId) {
        return existingDeviceId;
    }
    const deviceId = generateDeviceId();
    await (0, secure_storage_service_1.setSecureItem)(storage_keys_1.DELIVERY_PUSH_DEVICE_ID, deviceId);
    return deviceId;
};
exports.getOrCreateDeliveryDeviceId = getOrCreateDeliveryDeviceId;
