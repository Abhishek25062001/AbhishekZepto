import type { RedisHealthStatus } from '../modules/system/types/system-response.types';

export const getRedisHealthStatus = (): RedisHealthStatus => {
  return {
    status: 'not_configured',
  };
};
