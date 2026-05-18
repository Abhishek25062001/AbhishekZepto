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
      | 'deviceId'
      | 'deviceName'
      | 'deviceType'
      | 'appVersion'
      | 'ipAddress'
      | 'userAgent'
      | 'refreshTokenRotatedAt'
    >
  > & {
    _id?: Types.ObjectId;
  };

export const createAuthSession = (input: CreateAuthSessionInput) => {
  return AuthSessionModel.create(input);
};

export const findSessionById = (sessionId: string) => {
  if (!Types.ObjectId.isValid(sessionId)) {
    return Promise.resolve(null);
  }

  return AuthSessionModel.findById(sessionId);
};

export const findActiveSessionById = (sessionId: string) => {
  if (!Types.ObjectId.isValid(sessionId)) {
    return Promise.resolve(null);
  }

  return AuthSessionModel.findOne({
    _id: new Types.ObjectId(sessionId),
    isRevoked: false,
    isDeleted: false,
  });
};

export const findSessionByRefreshTokenHash = (refreshTokenHash: string) => {
  return AuthSessionModel.findOne({
    refreshTokenHash,
    isDeleted: false,
  });
};

export const findSessionsForUser = (userId: string) => {
  return AuthSessionModel.find({
    userId: new Types.ObjectId(userId),
    isDeleted: false,
  }).sort({
    createdAt: -1,
  });
};

export const revokeSessionById = (sessionId: string, revokedReason: string) => {
  if (!Types.ObjectId.isValid(sessionId)) {
    return Promise.resolve(null);
  }

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

export const revokeUserSessionById = (
  userId: string,
  sessionId: string,
  revokedReason: string,
) => {
  if (!Types.ObjectId.isValid(sessionId) || !Types.ObjectId.isValid(userId)) {
    return Promise.resolve(null);
  }

  return AuthSessionModel.findOneAndUpdate(
    {
      _id: new Types.ObjectId(sessionId),
      userId: new Types.ObjectId(userId),
      isDeleted: false,
    },
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

export const revokeOwnedSessionById = (
  userId: string,
  sessionId: string,
  revokedReason: string,
) => {
  if (!Types.ObjectId.isValid(sessionId)) {
    return Promise.resolve(null);
  }

  return AuthSessionModel.findOneAndUpdate(
    {
      _id: new Types.ObjectId(sessionId),
      userId: new Types.ObjectId(userId),
      isDeleted: false,
      isRevoked: false,
    },
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

export const updateSessionLastUsedAt = (sessionId: string) => {
  if (!Types.ObjectId.isValid(sessionId)) {
    return Promise.resolve(null);
  }

  return AuthSessionModel.findByIdAndUpdate(
    new Types.ObjectId(sessionId),
    {
      lastUsedAt: new Date(),
    },
    {
      new: true,
    },
  );
};

export const rotateRefreshTokenForSession = ({
  sessionId,
  refreshTokenHash,
  expiresAt,
}: {
  sessionId: string;
  refreshTokenHash: string;
  expiresAt: Date;
}) => {
  if (!Types.ObjectId.isValid(sessionId)) {
    return Promise.resolve(null);
  }

  const now = new Date();

  return AuthSessionModel.findOneAndUpdate(
    {
      _id: new Types.ObjectId(sessionId),
      isRevoked: false,
      isDeleted: false,
    },
    {
      refreshTokenHash,
      refreshTokenRotatedAt: now,
      expiresAt,
      lastUsedAt: now,
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

export const revokeOtherSessionsForUser = (
  userId: string,
  currentSessionId: string,
  revokedReason: string,
) => {
  if (!Types.ObjectId.isValid(currentSessionId)) {
    return Promise.resolve({
      acknowledged: true,
      matchedCount: 0,
      modifiedCount: 0,
      upsertedCount: 0,
      upsertedId: null,
    });
  }

  return AuthSessionModel.updateMany(
    {
      userId: new Types.ObjectId(userId),
      _id: {
        $ne: new Types.ObjectId(currentSessionId),
      },
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
