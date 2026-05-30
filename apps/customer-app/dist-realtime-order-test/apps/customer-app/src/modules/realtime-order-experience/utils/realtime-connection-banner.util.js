"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRealtimeConnectionBannerMessage = void 0;
const getRealtimeConnectionBannerMessage = ({ connectionError, connectionState, socketConnected, }) => {
    if (socketConnected || connectionState === 'idle' || connectionState === 'disconnected') {
        return null;
    }
    if (connectionState === 'connecting' || connectionState === 'reconnecting') {
        return 'Connecting...';
    }
    return connectionError ?? 'Realtime updates unavailable';
};
exports.getRealtimeConnectionBannerMessage = getRealtimeConnectionBannerMessage;
