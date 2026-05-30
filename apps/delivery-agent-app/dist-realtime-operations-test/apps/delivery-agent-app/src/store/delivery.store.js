"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useDeliveryStore = void 0;
const zustand_1 = require("zustand");
exports.useDeliveryStore = (0, zustand_1.create)((set) => ({
    availabilityStatus: 'offline',
    currentOrderId: null,
    currentAssignmentId: null,
    currentDeliveryStatus: null,
    setAvailabilityStatus: (availabilityStatus) => set({ availabilityStatus }),
    setCurrentDelivery: (currentDelivery) => set(currentDelivery),
    setCurrentDeliveryStatus: (status) => set({ currentDeliveryStatus: status }),
    clearCurrentDelivery: () => set({
        currentOrderId: null,
        currentAssignmentId: null,
        currentDeliveryStatus: null,
    }),
}));
