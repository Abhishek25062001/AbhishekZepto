import type { AuthRole } from './auth-role.types';

export type AuthUserContext = {
  userId: string;
  role: AuthRole;
  permissions: string[];
  sessionId: string;
  vendorId?: string;
  storeId?: string;
  cityId?: string;
};
