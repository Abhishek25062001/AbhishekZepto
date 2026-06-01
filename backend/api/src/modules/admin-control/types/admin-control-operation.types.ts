import type { AuthRole } from '../../auth/types/auth-role.types';

export type AdminControlActor = {
  adminId: string;
  role: AuthRole | null;
  requestId: string | null;
  traceId: string | null;
  ipAddress: string | null;
  deviceInfo: string | null;
  cityId: string | null;
};

export type AdminControlOperationResponse = {
  entityType: string;
  entityId: string;
  actionType: string;
  status: string;
  reason: string;
  updatedAt: string;
};
