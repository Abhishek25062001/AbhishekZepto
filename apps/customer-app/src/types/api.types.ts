export type ApiPaginationMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
};

export type ApiSuccessResponse<T> = {
  success: true;
  message: string;
  data: T;
  meta: {
    pagination?: ApiPaginationMeta;
    [key: string]: unknown;
  };
};

export type ApiErrorResponse = {
  success: false;
  message: string;
  error: {
    code: string;
    details: Record<string, unknown>;
  };
  meta: Record<string, unknown>;
};

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

export type BackendHealthData = {
  status: 'ok';
  service: string;
  database: {
    status: DatabaseHealthStatus;
    readyState: number;
  };
  redis: {
    status: RedisHealthStatus;
  };
  timestamp: string;
  uptime: number;
};

export type BackendVersionData = {
  version: string;
  environment: string;
};

export type BackendSystemInfoData = {
  environment: string;
  uptime: number;
  timestamp: string;
  version: string;
};
