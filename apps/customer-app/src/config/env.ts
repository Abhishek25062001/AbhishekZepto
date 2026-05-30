type RuntimeEnv = {
  API_BASE_URL?: string;
  APP_ENV?: string;
  CUSTOMER_SOCKET_BASE_URL?: string;
  CUSTOMER_SOCKET_RECONNECT_ATTEMPTS?: string;
  CUSTOMER_SOCKET_RECONNECT_DELAY_MS?: string;
  RAZORPAY_KEY_ID?: string;
};

const runtimeEnv =
  (globalThis as { process?: { env?: RuntimeEnv } }).process?.env ?? {};

export const APP_ENV = runtimeEnv.APP_ENV ?? 'development';

export const API_BASE_URL =
  runtimeEnv.API_BASE_URL ?? 'http://localhost:5000';

export const CUSTOMER_SOCKET_BASE_URL =
  runtimeEnv.CUSTOMER_SOCKET_BASE_URL ?? `${API_BASE_URL}/customer`;

const toPositiveInteger = (
  value: string | undefined,
  fallback: number,
): number => {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
};

export const CUSTOMER_SOCKET_RECONNECT_ATTEMPTS = toPositiveInteger(
  runtimeEnv.CUSTOMER_SOCKET_RECONNECT_ATTEMPTS,
  5,
);

export const CUSTOMER_SOCKET_RECONNECT_DELAY_MS = toPositiveInteger(
  runtimeEnv.CUSTOMER_SOCKET_RECONNECT_DELAY_MS,
  1000,
);

export const isDevelopment = APP_ENV === 'development';

export const RAZORPAY_KEY_ID = runtimeEnv.RAZORPAY_KEY_ID ?? '';
