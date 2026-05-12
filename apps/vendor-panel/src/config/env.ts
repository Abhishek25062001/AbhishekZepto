type RuntimeEnv = {
  VITE_API_BASE_URL?: string;
  VITE_APP_ENV?: string;
};

const runtimeEnv = (import.meta as ImportMeta & { env?: RuntimeEnv }).env ?? {};

export const APP_ENV = runtimeEnv.VITE_APP_ENV ?? 'development';

export const API_BASE_URL =
  runtimeEnv.VITE_API_BASE_URL ?? 'http://localhost:5000';

export const isDevelopment = APP_ENV === 'development';

