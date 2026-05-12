export type HealthDependencyStatus =
  | 'connected'
  | 'disconnected'
  | 'connecting'
  | 'disconnecting'
  | 'not_configured';

export type DatabaseHealthStatus = Extract<
  HealthDependencyStatus,
  'connected' | 'disconnected' | 'connecting' | 'disconnecting'
>;

export type RedisHealthDependencyStatus = Extract<
  HealthDependencyStatus,
  'connected' | 'disconnected' | 'not_configured'
>;

export type DatabaseHealthResponse = {
  readyState: number;
  status: DatabaseHealthStatus;
};

export type RedisHealthStatus = {
  status: RedisHealthDependencyStatus;
};

export type HealthStatusResponse = {
  database: DatabaseHealthResponse;
  redis: RedisHealthStatus;
  service: 'backend-api';
  status: 'ok';
  timestamp: string;
  uptime: number;
};

export type VersionInfoResponse = {
  environment: string;
  version: string;
};

export type SystemInfoResponse = {
  environment: string;
  timestamp: string;
  uptime: number;
  version: string;
};
