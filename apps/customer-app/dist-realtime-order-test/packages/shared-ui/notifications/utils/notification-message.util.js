"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.truncateNotificationMessage = void 0;
const truncateNotificationMessage = (message, maxLength = 96) => {
    const normalizedMessage = message.trim();
    if (normalizedMessage.length <= maxLength) {
        return normalizedMessage;
    }
    return `${normalizedMessage.slice(0, Math.max(0, maxLength - 3)).trimEnd()}...`;
};
exports.truncateNotificationMessage = truncateNotificationMessage;
