"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDeliveryRealtimeConnectionBannerMessage = void 0;
const getDeliveryRealtimeConnectionBannerMessage = (connectionState, connectionError) => {
    if (connectionState === 'connected' || connectionState === 'idle') {
        return null;
    }
    if (connectionState === 'failed') {
        return connectionError ?? 'Live updates unavailable';
    }
    return 'Reconnecting live updates...';
};
exports.getDeliveryRealtimeConnectionBannerMessage = getDeliveryRealtimeConnectionBannerMessage;
