import { Types } from 'mongoose';
import {
  AuthSessionModel,
  type AuthSessionRecord,
} from '../models/auth-session.model';

export type CreateAuthSessionInput = Pick<
  AuthSessionRecord,
  'userId' | 'role' | 'refreshTokenHash' | 'appSurface' | 'expiresAt'
> &
  Partial<
    Pick<
      AuthSessionRecord,
      'deviceId' | 'deviceType' | 'appVersion' | 'ipAddress' | 'userAgent'
    >
  >;

export const createAuthSession = (input: CreateAuthSessionInput) => {
  return AuthSessionModel.create(input);
};

export const findSessionById = (sessionId: string) => {
  return AuthSessionModel.findById(sessionId);
};

export const findSessionByRefreshTokenHash = (refreshTokenHash: string) => {
  return AuthSessionModel.findOne({
    refreshTokenHash,
    isDeleted: false,
  });
};

export const revokeSessionById = (sessionId: string, revokedReason: string) => {
  return AuthSessionModel.findByIdAndUpdate(
    new Types.ObjectId(sessionId),
    {
      isRevoked: true,
      revokedAt: new Date(),
      revokedReason,
    },
    {
      new: true,
    },
  );
};

export const revokeAllSessionsForUser = (userId: string, revokedReason: string) => {
  return AuthSessionModel.updateMany(
    {
      userId: new Types.ObjectId(userId),
      isRevoked: false,
      isDeleted: false,
    },
    {
      isRevoked: true,
      revokedAt: new Date(),
      revokedReason,
    },
  );
};
