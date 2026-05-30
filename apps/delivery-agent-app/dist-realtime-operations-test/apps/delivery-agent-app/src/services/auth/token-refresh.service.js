"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshDeliveryAccessToken = refreshDeliveryAccessToken;
const auth_api_1 = require("../api/auth.api");
const storage_keys_1 = require("../../constants/storage-keys");
const auth_store_1 = require("../../store/auth.store");
const secure_storage_service_1 = require("../storage/secure-storage.service");
async function refreshDeliveryAccessToken() {
    const storedRefreshToken = auth_store_1.useAuthStore.getState().refreshToken ??
        (await (0, secure_storage_service_1.getSecureItem)(storage_keys_1.DELIVERY_REFRESH_TOKEN));
    if (!storedRefreshToken) {
        return { success: false };
    }
    try {
        const response = await (0, auth_api_1.refreshToken)({
            refreshToken: storedRefreshToken,
        });
        auth_store_1.useAuthStore.setState((state) => ({
            ...state,
            accessToken: response.data.accessToken,
            refreshToken: storedRefreshToken,
        }));
        await (0, secure_storage_service_1.setSecureItem)(storage_keys_1.DELIVERY_ACCESS_TOKEN, response.data.accessToken);
        return {
            success: true,
            accessToken: response.data.accessToken,
        };
    }
    catch {
        return { success: false };
    }
}
// TODO: integrate this helper into the Axios 401 retry flow later.
