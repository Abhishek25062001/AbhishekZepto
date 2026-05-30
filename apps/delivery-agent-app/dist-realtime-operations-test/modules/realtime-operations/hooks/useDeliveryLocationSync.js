"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useDeliveryLocationSync = void 0;
const delivery_realtime_store_1 = require("../store/delivery-realtime.store");
const useDeliveryLocationSync = () => {
    const socketConnected = (0, delivery_realtime_store_1.useDeliveryRealtimeStore)((state) => state.socketConnected);
    const lastLocationAckAt = (0, delivery_realtime_store_1.useDeliveryRealtimeStore)((state) => state.lastLocationAckAt);
    const locationSyncPaused = (0, delivery_realtime_store_1.useDeliveryRealtimeStore)((state) => state.locationSyncPaused);
    const locationSyncError = (0, delivery_realtime_store_1.useDeliveryRealtimeStore)((state) => state.locationSyncError);
    return {
        lastLocationAckAt,
        locationSyncError,
        locationSyncPaused,
        restLocationSyncEnabled: !locationSyncPaused || !socketConnected,
    };
};
exports.useDeliveryLocationSync = useDeliveryLocationSync;
