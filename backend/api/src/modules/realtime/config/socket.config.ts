import { env } from '../../../config/env';

const wildcardOrigin = '*';

const parseCorsOrigins = (value: string): string[] => {
  return value
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);
};

const assertProductionCorsIsExplicit = (origins: string[]): void => {
  if (env.APP_ENV === 'production' && origins.includes(wildcardOrigin)) {
    throw new Error('SOCKET_CORS_ORIGIN must not include wildcard origin in production');
  }
};

export const getSocketConfig = () => {
  const corsOrigins = parseCorsOrigins(env.SOCKET_CORS_ORIGIN);
  assertProductionCorsIsExplicit(corsOrigins);

  return {
    corsOrigins,
    pingTimeout: env.SOCKET_PING_TIMEOUT,
    pingInterval: env.SOCKET_PING_INTERVAL,
    realtimeRedisEnabled: env.REALTIME_REDIS_ENABLED,
  };
};

export type SocketConfig = ReturnType<typeof getSocketConfig>;
