export const OTP_PURPOSE = {
  LOGIN: 'login',
  SIGNUP: 'signup',
  REAUTH: 'reauth',
} as const;

export const OTP_PURPOSES = Object.values(OTP_PURPOSE);

export const OTP_DELIVERY_CHANNEL = {
  SMS: 'sms',
  WHATSAPP: 'whatsapp',
  EMAIL: 'email',
} as const;

export const OTP_DELIVERY_CHANNELS = Object.values(OTP_DELIVERY_CHANNEL);

export const AUTH_DEVICE_TYPE = {
  ANDROID: 'android',
  IOS: 'ios',
  WEB: 'web',
  UNKNOWN: 'unknown',
} as const;

export const AUTH_DEVICE_TYPES = Object.values(AUTH_DEVICE_TYPE);

export const AUTH_APP_SURFACE = {
  CUSTOMER_APP: 'customer_app',
  DELIVERY_AGENT_APP: 'delivery_agent_app',
  VENDOR_PANEL: 'vendor_panel',
  ADMIN_DASHBOARD: 'admin_dashboard',
} as const;

export const AUTH_APP_SURFACES = Object.values(AUTH_APP_SURFACE);
