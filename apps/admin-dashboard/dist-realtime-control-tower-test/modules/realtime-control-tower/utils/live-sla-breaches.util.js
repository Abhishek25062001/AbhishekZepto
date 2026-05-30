"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.applyAdminRealtimeSlaEventToList = void 0;
const applyAdminRealtimeSlaEventToList = (breaches, event) => {
    if (!event) {
        return breaches;
    }
    const withoutExistingBreach = breaches.filter((breach) => breach.breachId !== event.breachId);
    return [event, ...withoutExistingBreach];
};
exports.applyAdminRealtimeSlaEventToList = applyAdminRealtimeSlaEventToList;
