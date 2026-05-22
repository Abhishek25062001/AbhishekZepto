type RuntimeEnv = {
  API_BASE_URL?: string;
  APP_ENV?: string;
  RAZORPAY_KEY_ID?: string;
};

const runtimeEnv =
  (globalThis as { process?: { env?: RuntimeEnv } }).process?.env ?? {};

export const APP_ENV = runtimeEnv.APP_ENV ?? 'development';

export const API_BASE_URL =
  runtimeEnv.API_BASE_URL ?? 'http://localhost:5000';

export const isDevelopment = APP_ENV === 'development';

export const RAZORPAY_KEY_ID = runtimeEnv.RAZORPAY_KEY_ID ?? '';

