import { env } from '../config/env';

export type SafeDebugInfo = {
  environment: string;
  version: string;
  uptime: number;
  timestamp: string;
  nodeVersion: string;
};

export const getSafeDebugInfo = (): SafeDebugInfo => ({
  environment: env.APP_ENV,
  version: env.APP_VERSION,
  uptime: process.uptime(),
  timestamp: new Date().toISOString(),
  nodeVersion: process.version,
});
