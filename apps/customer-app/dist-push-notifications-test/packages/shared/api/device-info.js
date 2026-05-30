"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatSessionTimestamp = exports.formatSessionDeviceLabel = exports.buildAuthDeviceInput = exports.resolveDeviceTypeFromPlatform = void 0;
const APP_SURFACE_LABELS = {
    customer_app: 'Customer App',
    delivery_agent_app: 'Delivery Agent App',
    vendor_panel: 'Vendor Panel',
    admin_dashboard: 'Admin Dashboard',
};
const DEVICE_TYPE_LABELS = {
    android: 'Android',
    ios: 'iOS',
    web: 'Web',
    unknown: 'Unknown Device',
};
const resolveDeviceTypeFromPlatform = (platform) => {
    if (platform === 'android' || platform === 'ios' || platform === 'web') {
        return platform;
    }
    return 'unknown';
};
exports.resolveDeviceTypeFromPlatform = resolveDeviceTypeFromPlatform;
const buildAuthDeviceInput = ({ appSurface, platform, appVersion, deviceId, }) => ({
    appSurface,
    deviceType: (0, exports.resolveDeviceTypeFromPlatform)(platform),
    appVersion,
    deviceId: deviceId ?? `${appSurface}-device`,
});
exports.buildAuthDeviceInput = buildAuthDeviceInput;
const formatSessionDeviceLabel = (session) => {
    if (session.deviceName) {
        return session.deviceName;
    }
    const baseLabel = `${APP_SURFACE_LABELS[session.appSurface]} ${DEVICE_TYPE_LABELS[session.deviceType]}`;
    if (!session.appVersion) {
        return baseLabel;
    }
    return `${baseLabel} v${session.appVersion}`;
};
exports.formatSessionDeviceLabel = formatSessionDeviceLabel;
const formatSessionTimestamp = (value) => {
    if (!value) {
        return 'Not available';
    }
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) {
        return 'Not available';
    }
    return parsed.toLocaleString();
};
exports.formatSessionTimestamp = formatSessionTimestamp;
