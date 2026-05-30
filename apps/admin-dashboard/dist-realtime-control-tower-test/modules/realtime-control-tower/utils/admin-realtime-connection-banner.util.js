"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAdminRealtimeConnectionBannerMessage = void 0;
const getAdminRealtimeConnectionBannerMessage = (connectionState, connectionError) => {
    if (connectionState === 'connected' || connectionState === 'idle') {
        return null;
    }
    if (connectionState === 'failed') {
        return connectionError ?? 'Live control tower updates unavailable';
    }
    return 'Reconnecting live control tower...';
};
exports.getAdminRealtimeConnectionBannerMessage = getAdminRealtimeConnectionBannerMessage;
