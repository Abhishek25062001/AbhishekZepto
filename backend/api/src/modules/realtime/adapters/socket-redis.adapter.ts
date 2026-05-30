import type { Server } from 'socket.io';
import { env } from '../../../config/env';

export const configureSocketRedisAdapter = (io: Server): void => {
  void io;

  if (!env.REALTIME_REDIS_ENABLED) {
    return;
  }

  if (env.APP_ENV === 'production' && !env.REDIS_URL) {
    throw new Error('REDIS_URL is required when REALTIME_REDIS_ENABLED=true in production');
  }

  // Multi-instance Socket.IO scaling is intentionally deferred for this module.
  console.warn('REALTIME_REDIS_ENABLED is true, but Socket.IO Redis adapter bootstrap is deferred');
};
