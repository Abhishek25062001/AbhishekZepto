import { AUTH_ROLE } from '../constants/auth-role.constants';
import { AUTH_TOKEN_TYPE } from '../constants/auth-token.constants';
import type { AuthRole } from '../types/auth-role.types';
import type { AuthTokenPayload } from '../types/auth-token.types';

export type GenerateTokenInput = {
  userId: string;
  role: AuthRole;
  sessionId: string;
  permissions: string[];
};

export const generateAccessToken = (_input: GenerateTokenInput): string => {
  void _input;

  return 'phase1-access-token-placeholder';
};

export const generateRefreshToken = (_input: GenerateTokenInput): string => {
  void _input;

  return 'phase1-refresh-token-placeholder';
};

export const verifyAccessToken = (_token: string): AuthTokenPayload => {
  void _token;

  return {
    userId: 'phase1-auth-user-placeholder',
    role: AUTH_ROLE.SUPER_ADMIN,
    sessionId: 'phase1-auth-session-placeholder',
    tokenType: AUTH_TOKEN_TYPE.ACCESS,
  };
};

export const verifyRefreshToken = (_token: string): AuthTokenPayload => {
  void _token;

  return {
    userId: 'phase1-auth-user-placeholder',
    role: AUTH_ROLE.SUPER_ADMIN,
    sessionId: 'phase1-auth-session-placeholder',
    tokenType: AUTH_TOKEN_TYPE.REFRESH,
  };
};

// Replace placeholder token logic with real JWT signing and verification in Phase 2.
