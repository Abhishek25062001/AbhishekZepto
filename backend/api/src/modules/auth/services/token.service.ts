import crypto from 'node:crypto';
import jwt, { TokenExpiredError, type SignOptions } from 'jsonwebtoken';
import { AppError } from '../../../errors/AppError';
import { ERROR_CODES } from '../../../errors/error-codes';
import { HTTP_STATUS } from '../../../utils/http-status';
import { env } from '../../../config/env';
import { AUTH_TOKEN_TYPE, TOKEN_ISSUER } from '../constants/auth-token.constants';
import type { AuthRole } from '../types/auth-role.types';
import type { PermissionCode } from '../types/auth-permission.types';
import type { AuthTokenPayload } from '../types/auth-token.types';

export type GenerateAccessTokenInput = {
  userId: string;
  role: AuthRole;
  sessionId: string;
  permissions: PermissionCode[];
  vendorId?: string | null;
  storeId?: string | null;
  cityId?: string | null;
};

export type GenerateRefreshTokenInput = Pick<
  GenerateAccessTokenInput,
  'userId' | 'role' | 'sessionId'
>;

const durationPattern = /^(\d+)([smhd])$/;

const parseDurationToMilliseconds = (value: string): number => {
  if (/^\d+$/.test(value)) {
    return Number(value) * 1000;
  }

  const match = value.match(durationPattern);

  if (!match) {
    throw new Error(`Unsupported token duration value: ${value}`);
  }

  const amount = Number(match[1]);
  const multiplierByUnit = {
    s: 1000,
    m: 60 * 1000,
    h: 60 * 60 * 1000,
    d: 24 * 60 * 60 * 1000,
  } as const;
  const unit = match[2] as keyof typeof multiplierByUnit;

  return amount * multiplierByUnit[unit];
};

const parseDurationToSeconds = (value: string): number => {
  return Math.floor(parseDurationToMilliseconds(value) / 1000);
};

const signToken = ({
  payload,
  secret,
  expiresIn,
}: {
  payload: AuthTokenPayload;
  secret: string;
  expiresIn: string;
}): string => {
  return jwt.sign(payload, secret, {
    expiresIn: expiresIn as SignOptions['expiresIn'],
    issuer: TOKEN_ISSUER,
  });
};

const verifySignedToken = ({
  token,
  secret,
  expectedTokenType,
  invalidErrorCode,
}: {
  token: string;
  secret: string;
  expectedTokenType: AuthTokenPayload['tokenType'];
  invalidErrorCode: typeof ERROR_CODES.INVALID_ACCESS_TOKEN | typeof ERROR_CODES.INVALID_REFRESH_TOKEN;
}): AuthTokenPayload => {
  try {
    const decodedToken = jwt.verify(token, secret, {
      issuer: TOKEN_ISSUER,
    });

    if (!decodedToken || typeof decodedToken !== 'object') {
      throw new AppError({
        message: 'Invalid authentication token',
        statusCode: HTTP_STATUS.UNAUTHORIZED,
        errorCode: invalidErrorCode,
      });
    }

    const payload = decodedToken as AuthTokenPayload;

    if (payload.tokenType !== expectedTokenType) {
      throw new AppError({
        message: 'Invalid authentication token',
        statusCode: HTTP_STATUS.UNAUTHORIZED,
        errorCode: invalidErrorCode,
      });
    }

    return payload;
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }

    if (error instanceof TokenExpiredError) {
      throw new AppError({
        message: 'Authentication token expired',
        statusCode: HTTP_STATUS.UNAUTHORIZED,
        errorCode: ERROR_CODES.TOKEN_EXPIRED,
      });
    }

    throw new AppError({
      message:
        invalidErrorCode === ERROR_CODES.INVALID_REFRESH_TOKEN
          ? 'Invalid refresh token'
          : 'Invalid access token',
      statusCode: HTTP_STATUS.UNAUTHORIZED,
      errorCode: invalidErrorCode,
    });
  }
};

export const ACCESS_TOKEN_EXPIRES_IN_SECONDS = parseDurationToSeconds(
  env.JWT_ACCESS_EXPIRES_IN,
);

export const generateAccessToken = (input: GenerateAccessTokenInput): string => {
  return signToken({
    payload: {
      userId: input.userId,
      role: input.role,
      sessionId: input.sessionId,
      permissions: input.permissions,
      vendorId: input.vendorId ?? null,
      storeId: input.storeId ?? null,
      cityId: input.cityId ?? null,
      tokenType: AUTH_TOKEN_TYPE.ACCESS,
    },
    secret: env.JWT_ACCESS_SECRET,
    expiresIn: env.JWT_ACCESS_EXPIRES_IN,
  });
};

export const generateRefreshToken = (input: GenerateRefreshTokenInput): string => {
  return signToken({
    payload: {
      userId: input.userId,
      role: input.role,
      sessionId: input.sessionId,
      tokenType: AUTH_TOKEN_TYPE.REFRESH,
    },
    secret: env.JWT_REFRESH_SECRET,
    expiresIn: env.JWT_REFRESH_EXPIRES_IN,
  });
};

export const verifyAccessToken = (token: string): AuthTokenPayload => {
  return verifySignedToken({
    token,
    secret: env.JWT_ACCESS_SECRET,
    expectedTokenType: AUTH_TOKEN_TYPE.ACCESS,
    invalidErrorCode: ERROR_CODES.INVALID_ACCESS_TOKEN,
  });
};

export const verifyRefreshToken = (token: string): AuthTokenPayload => {
  return verifySignedToken({
    token,
    secret: env.JWT_REFRESH_SECRET,
    expectedTokenType: AUTH_TOKEN_TYPE.REFRESH,
    invalidErrorCode: ERROR_CODES.INVALID_REFRESH_TOKEN,
  });
};

export const hashRefreshToken = (refreshToken: string): string => {
  return crypto.createHash('sha256').update(refreshToken).digest('hex');
};

export const getRefreshTokenExpiryDate = (): Date => {
  return new Date(Date.now() + parseDurationToMilliseconds(env.JWT_REFRESH_EXPIRES_IN));
};
