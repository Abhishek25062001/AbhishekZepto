import type { Server } from 'socket.io';
import { configureSocketRedisAdapter } from './socket-redis.adapter';

export const configureRedisRealtimeAdapter = (io: Server): void => {
  configureSocketRedisAdapter(io);
};
