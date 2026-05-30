"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.applyAdminRealtimeDeliveryEventToLocations = void 0;
const applyAdminRealtimeDeliveryEventToLocations = (deliveries, event) => {
    if (!event?.delivery) {
        return deliveries;
    }
    const withoutExistingDelivery = deliveries.filter((delivery) => delivery.deliveryId !== event.delivery?.deliveryId);
    return [event.delivery, ...withoutExistingDelivery];
};
exports.applyAdminRealtimeDeliveryEventToLocations = applyAdminRealtimeDeliveryEventToLocations;
