type RuntimeEnv = {
  VITE_API_BASE_URL?: string;
  VITE_APP_ENV?: string;
  VITE_VENDOR_SOCKET_BASE_URL?: string;
  VITE_VENDOR_SOCKET_RECONNECT_ATTEMPTS?: string;
  VITE_VENDOR_SOCKET_RECONNECT_DELAY_MS?: string;
};

const runtimeEnv = (import.meta as ImportMeta & { env?: RuntimeEnv }).env ?? {};

export const APP_ENV = runtimeEnv.VITE_APP_ENV ?? 'development';

export const API_BASE_URL =
  runtimeEnv.VITE_API_BASE_URL ?? 'http://localhost:5000';

export const isDevelopment = APP_ENV === 'development';

const parsePositiveInteger = (
  value: string | undefined,
  fallback: number,
): number => {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
};

export const VENDOR_SOCKET_BASE_URL =
  runtimeEnv.VITE_VENDOR_SOCKET_BASE_URL ?? 'http://localhost:5000/vendor';

export const VENDOR_SOCKET_RECONNECT_ATTEMPTS = parsePositiveInteger(
  runtimeEnv.VITE_VENDOR_SOCKET_RECONNECT_ATTEMPTS,
  5,
);

export const VENDOR_SOCKET_RECONNECT_DELAY_MS = parsePositiveInteger(
  runtimeEnv.VITE_VENDOR_SOCKET_RECONNECT_DELAY_MS,
  1000,
);
