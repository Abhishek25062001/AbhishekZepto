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

export type RedisHealthStatus = Extract<
  HealthDependencyStatus,
  'connected' | 'disconnected' | 'not_configured'
>;

export type HealthStatusResponse = {
  database: {
    readyState: number;
    status: DatabaseHealthStatus;
  };
  redis: {
    status: RedisHealthStatus;
  };
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
