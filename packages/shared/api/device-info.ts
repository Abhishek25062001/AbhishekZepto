import type {
  AppSurface,
  AuthDeviceInput,
  AuthDeviceType,
  AuthSessionSummary,
} from './auth-api.types';

export type DeviceInfoPlatform = 'android' | 'ios' | 'web' | 'unknown';

const APP_SURFACE_LABELS: Record<AppSurface, string> = {
  customer_app: 'Customer App',
  delivery_agent_app: 'Delivery Agent App',
  vendor_panel: 'Vendor Panel',
  admin_dashboard: 'Admin Dashboard',
};

const DEVICE_TYPE_LABELS: Record<AuthDeviceType, string> = {
  android: 'Android',
  ios: 'iOS',
  web: 'Web',
  unknown: 'Unknown Device',
};

export const resolveDeviceTypeFromPlatform = (
  platform: DeviceInfoPlatform,
): AuthDeviceType => {
  if (platform === 'android' || platform === 'ios' || platform === 'web') {
    return platform;
  }

  return 'unknown';
};

export const buildAuthDeviceInput = ({
  appSurface,
  platform,
  appVersion,
  deviceId,
}: {
  appSurface: AppSurface;
  platform: DeviceInfoPlatform;
  appVersion?: string;
  deviceId?: string;
}): AuthDeviceInput => ({
  appSurface,
  deviceType: resolveDeviceTypeFromPlatform(platform),
  appVersion,
  deviceId: deviceId ?? `${appSurface}-device`,
});

export const formatSessionDeviceLabel = (
  session: Pick<
    AuthSessionSummary,
    'deviceName' | 'deviceType' | 'appSurface' | 'appVersion'
  >,
): string => {
  if (session.deviceName) {
    return session.deviceName;
  }

  const baseLabel = `${APP_SURFACE_LABELS[session.appSurface]} ${DEVICE_TYPE_LABELS[session.deviceType]}`;

  if (!session.appVersion) {
    return baseLabel;
  }

  return `${baseLabel} v${session.appVersion}`;
};

export const formatSessionTimestamp = (value: string | null): string => {
  if (!value) {
    return 'Not available';
  }

  const parsed = new Date(value);

  if (Number.isNaN(parsed.getTime())) {
    return 'Not available';
  }

  return parsed.toLocaleString();
};
