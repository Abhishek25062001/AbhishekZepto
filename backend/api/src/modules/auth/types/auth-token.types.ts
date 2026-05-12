import type { AuthRole } from './auth-role.types';

export type AuthTokenType = 'access' | 'refresh';

export type AuthTokenPayload = {
  userId: string;
  role: AuthRole;
  sessionId: string;
  tokenType: AuthTokenType;
  iat?: number;
  exp?: number;
};

export type AuthTokenPair = {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
};
