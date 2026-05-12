import mongoose from 'mongoose';

import { env } from '../../../config/env';
import { getRedisHealthStatus } from '../../../config/redis';
import { getSafeDebugInfo } from '../../../utils/safe-debug-info';
import type {
  DatabaseHealthStatus,
  HealthStatusResponse,
  SystemInfoResponse,
  VersionInfoResponse,
} from '../types/system-response.types';

const databaseReadyStateMap: Record<number, DatabaseHealthStatus> = {
  0: 'disconnected',
  1: 'connected',
  2: 'connecting',
  3: 'disconnecting',
};

export const getDatabaseHealth = () => {
  const readyState = mongoose.connection.readyState;

  return {
    status: databaseReadyStateMap[readyState] || 'disconnected',
    readyState,
  };
};

export const getHealthStatus = (): HealthStatusResponse => {
  return {
    status: 'ok',
    service: 'backend-api',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    database: getDatabaseHealth(),
    redis: getRedisHealthStatus(),
  };
};

export const getVersionInfo = (): VersionInfoResponse => {
  return {
    version: env.APP_VERSION,
    environment: env.APP_ENV,
  };
};

export const getSystemInfo = (): SystemInfoResponse => {
  const { environment, uptime, timestamp, version } = getSafeDebugInfo();

  return {
    environment,
    uptime,
    timestamp,
    version,
  };
};
