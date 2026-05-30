"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOrCreateCustomerDeviceId = void 0;
const storage_keys_1 = require("../../../constants/storage-keys");
const secure_storage_service_1 = require("../../../services/storage/secure-storage.service");
const generateDeviceId = () => `customer-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
const getOrCreateCustomerDeviceId = async () => {
    const existingDeviceId = await (0, secure_storage_service_1.getSecureItem)(storage_keys_1.CUSTOMER_PUSH_DEVICE_ID);
    if (existingDeviceId) {
        return existingDeviceId;
    }
    const deviceId = generateDeviceId();
    await (0, secure_storage_service_1.setSecureItem)(storage_keys_1.CUSTOMER_PUSH_DEVICE_ID, deviceId);
    return deviceId;
};
exports.getOrCreateCustomerDeviceId = getOrCreateCustomerDeviceId;
