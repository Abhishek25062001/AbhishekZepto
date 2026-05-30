"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getVendorRealtimeConnectionBannerMessage = void 0;
const getVendorRealtimeConnectionBannerMessage = (connectionState, connectionError) => {
    if (connectionState === 'connected' || connectionState === 'idle') {
        return null;
    }
    if (connectionState === 'failed') {
        return connectionError ?? 'Live store updates unavailable';
    }
    return 'Reconnecting live store updates...';
};
exports.getVendorRealtimeConnectionBannerMessage = getVendorRealtimeConnectionBannerMessage;
