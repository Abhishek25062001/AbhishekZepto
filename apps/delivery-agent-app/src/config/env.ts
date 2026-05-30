type RuntimeEnv = {
  API_BASE_URL?: string;
  APP_ENV?: string;
  DELIVERY_SOCKET_BASE_URL?: string;
  DELIVERY_SOCKET_RECONNECT_ATTEMPTS?: string;
  DELIVERY_SOCKET_RECONNECT_DELAY_MS?: string;
};

const runtimeEnv =
  (globalThis as { process?: { env?: RuntimeEnv } }).process?.env ?? {};

export const APP_ENV = runtimeEnv.APP_ENV ?? 'development';

export const API_BASE_URL =
  runtimeEnv.API_BASE_URL ?? 'http://localhost:5000';

const parsePositiveIntegerEnv = (
  value: string | undefined,
  fallback: number,
): number => {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
};

export const DELIVERY_SOCKET_BASE_URL =
  runtimeEnv.DELIVERY_SOCKET_BASE_URL ?? 'http://localhost:5000/delivery';

export const DELIVERY_SOCKET_RECONNECT_ATTEMPTS = parsePositiveIntegerEnv(
  runtimeEnv.DELIVERY_SOCKET_RECONNECT_ATTEMPTS,
  5,
);

export const DELIVERY_SOCKET_RECONNECT_DELAY_MS = parsePositiveIntegerEnv(
  runtimeEnv.DELIVERY_SOCKET_RECONNECT_DELAY_MS,
  1000,
);

export const isDevelopment = APP_ENV === 'development';
