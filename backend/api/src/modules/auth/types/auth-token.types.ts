import type { AuthRole } from './auth-role.types';
import type { PermissionCode } from './auth-permission.types';

export type AuthTokenType = 'access' | 'refresh';

export type AuthTokenPayload = {
  userId: string;
  role: AuthRole;
  sessionId: string;
  tokenType: AuthTokenType;
  permissions?: PermissionCode[];
  vendorId?: string | null;
  storeId?: string | null;
  cityId?: string | null;
  iat?: number;
  exp?: number;
};

export type AuthTokenPair = {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
};
