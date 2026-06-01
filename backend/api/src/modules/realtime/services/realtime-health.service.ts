import { env } from '../../../config/env';
import { getSocketServer } from './socket-server.service';

let lastEmitAt: string | null = null;
let failedEmitCount = 0;

export const recordEmitSuccess = (): void => {
  lastEmitAt = new Date().toISOString();
};

export const recordEmitFailure = (): void => {
  failedEmitCount += 1;
};

export const getRealtimeHealth = (): {
  isSocketServerRunning: boolean;
  connectedSocketsCount: number;
  namespaceCounts: Record<string, number>;
  redisAdapterEnabled: boolean;
  lastEmitAt: string | null;
  failedEmitCount: number;
} => {
  let isSocketServerRunning = false;
  let connectedSocketsCount = 0;
  const namespaceCounts: Record<string, number> = {
    '/': 0,
    '/customer': 0,
    '/delivery': 0,
    '/vendor': 0,
    '/admin': 0,
  };

  try {
    const io = getSocketServer();
    isSocketServerRunning = true;

    for (const nsp of Object.keys(namespaceCounts)) {
      const count = io.of(nsp).sockets.size ?? 0;
      namespaceCounts[nsp] = count;
      connectedSocketsCount += count;
    }
  } catch (error) {
    void error;
    isSocketServerRunning = false;
  }

  return {
    isSocketServerRunning,
    connectedSocketsCount,
    namespaceCounts,
    redisAdapterEnabled: env.REALTIME_REDIS_ENABLED ?? false,
    lastEmitAt,
    failedEmitCount,
  };
};
