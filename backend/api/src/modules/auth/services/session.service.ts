import { Types } from 'mongoose';
import { AppError } from '../../../errors/AppError';
import { ERROR_CODES } from '../../../errors/error-codes';
import { HTTP_STATUS } from '../../../utils/http-status';
import { AUDIT_EVENTS, writeAuditLog } from '../../audit';
import type { AuditActorSurface } from '../../audit';
import {
  createAuthSession,
  findSessionById,
  findSessionsForUser,
  findSessionByRefreshTokenHash,
  revokeOtherSessionsForUser,
  revokeOwnedSessionById,
  revokeAllSessionsForUser,
  revokeSessionById,
  revokeUserSessionById,
  rotateRefreshTokenForSession,
  updateSessionLastUsedAt,
} from '../repositories/auth-session.repository';
import { findActiveUserIdentityById } from '../repositories/user-identity.repository';
import type { AuthSessionRecord } from '../models/auth-session.model';
import type {
  AdminAuthSessionSummary,
  ListAdminUserSessionsResponse,
  ListMySessionsResponse,
  RevokeAdminUserSessionResponse,
  RevokeAllAdminUserSessionsResponse,
} from '../types/auth-api.types';
import type { AuthUserContext } from '../types/auth-user-context.types';
import type { AuthRole } from '../types/auth-role.types';
import type { AuthDeviceInput } from '../types/otp.types';
import { getRefreshTokenExpiryDate, hashRefreshToken } from './token.service';

const appSurfaceDisplayName: Record<AuthDeviceInput['appSurface'], string> = {
  customer_app: 'Customer App',
  delivery_agent_app: 'Delivery Agent App',
  vendor_panel: 'Vendor Panel',
  admin_dashboard: 'Admin Dashboard',
};

const deviceTypeDisplayName: Record<AuthDeviceInput['deviceType'], string> = {
  android: 'Android',
  ios: 'iOS',
  web: 'Web',
  unknown: 'Unknown Device',
};

const buildDeviceNameFromSessionShape = ({
  appSurface,
  deviceType,
  appVersion,
}: {
  appSurface: AuthDeviceInput['appSurface'];
  deviceType: AuthDeviceInput['deviceType'];
  appVersion?: string | null;
}) => {
  const baseName = `${appSurfaceDisplayName[appSurface]} ${deviceTypeDisplayName[deviceType]}`;

  if (!appVersion) {
    return baseName;
  }

  return `${baseName} v${appVersion}`;
};

const toObjectIdOrNull = (value?: string | null): Types.ObjectId | null => {
  if (!value || !Types.ObjectId.isValid(value)) {
    return null;
  }

  return new Types.ObjectId(value);
};

const ADMIN_SESSION_REVOKED_REASON = 'admin_revoked_session';
const ADMIN_ALL_SESSIONS_REVOKED_REASON = 'admin_revoked_all_sessions';

const roleSurfaceMap: Record<AuthRole, AuditActorSurface> = {
  customer: 'customer_app',
  delivery_agent: 'delivery_agent_app',
  vendor_owner: 'vendor_panel',
  store_manager: 'vendor_panel',
  store_staff: 'vendor_panel',
  support_admin: 'admin_dashboard',
  operations_admin: 'admin_dashboard',
  super_admin: 'admin_dashboard',
};

const mapSessionToAdminSummary = (
  session: AuthSessionRecord & { _id: { toString(): string } },
): AdminAuthSessionSummary => ({
  id: session._id.toString(),
  role: session.role,
  deviceId: session.deviceId ?? null,
  deviceName: resolveDeviceName(session),
  deviceType: session.deviceType,
  appSurface: session.appSurface,
  appVersion: session.appVersion ?? null,
  ipAddress: session.ipAddress ?? null,
  userAgent: session.userAgent ?? null,
  lastUsedAt: session.lastUsedAt?.toISOString() ?? null,
  expiresAt: session.expiresAt.toISOString(),
  isRevoked: session.isRevoked,
  revokedAt: session.revokedAt?.toISOString() ?? null,
  revokedReason: session.revokedReason ?? null,
  createdAt: session.createdAt.toISOString(),
});

const assertActiveTargetUser = async (userId: string) => {
  const user = await findActiveUserIdentityById(userId);

  if (!user) {
    throw new AppError({
      message: 'User not found',
      statusCode: HTTP_STATUS.NOT_FOUND,
      errorCode: ERROR_CODES.NOT_FOUND,
    });
  }

  return user;
};

const writeAdminSessionAudit = async ({
  admin,
  targetUserId,
  sessionId,
  eventType,
  metadata,
}: {
  admin: AuthUserContext;
  targetUserId: string;
  sessionId?: string | null;
  eventType: (typeof AUDIT_EVENTS)[keyof typeof AUDIT_EVENTS];
  metadata?: Record<string, unknown>;
}) => {
  await writeAuditLog({
    eventType,
    actorId: toObjectIdOrNull(admin.userId),
    actorRole: admin.role,
    actorSurface: roleSurfaceMap[admin.role],
    entityType: 'auth_session',
    entityId: toObjectIdOrNull(sessionId),
    vendorId: toObjectIdOrNull(admin.vendorId),
    storeId: toObjectIdOrNull(admin.storeId),
    cityId: toObjectIdOrNull(admin.cityId),
    requestId: null,
    traceId: null,
    ipAddress: null,
    userAgent: null,
    metadata: {
      targetUserId,
      ...metadata,
    },
    status: 'success',
  });
};

const resolveDeviceName = (
  session:
    | Pick<AuthSessionRecord, 'deviceName' | 'appSurface' | 'deviceType' | 'appVersion'>
    | {
        deviceName?: string | null;
        appSurface: AuthDeviceInput['appSurface'];
        deviceType: AuthDeviceInput['deviceType'];
        appVersion?: string | null;
      },
) => {
  if (session.deviceName) {
    return session.deviceName;
  }

  return buildDeviceNameFromSessionShape({
    appSurface: session.appSurface,
    deviceType: session.deviceType,
    appVersion: session.appVersion ?? null,
  });
};

export const createSessionForUser = ({
  sessionId,
  userId,
  role,
  refreshToken,
  device,
  ipAddress,
  userAgent,
}: {
  sessionId: string;
  userId: string;
  role: AuthRole;
  refreshToken: string;
  device: AuthDeviceInput;
  ipAddress?: string | null;
  userAgent?: string | null;
}) => {
  return createAuthSession({
    _id: new Types.ObjectId(sessionId),
    userId: new Types.ObjectId(userId),
    role,
    refreshTokenHash: hashRefreshToken(refreshToken),
    deviceId: device.deviceId ?? null,
    deviceName: buildDeviceNameFromSessionShape({
      appSurface: device.appSurface,
      deviceType: device.deviceType,
      appVersion: device.appVersion ?? null,
    }),
    deviceType: device.deviceType,
    appSurface: device.appSurface,
    appVersion: device.appVersion ?? null,
    ipAddress: ipAddress ?? null,
    userAgent: userAgent ?? null,
    expiresAt: getRefreshTokenExpiryDate(),
  });
};

export const findSessionByRefreshToken = (refreshToken: string) => {
  return findSessionByRefreshTokenHash(hashRefreshToken(refreshToken));
};

export const markSessionUsed = (sessionId: string) => {
  return updateSessionLastUsedAt(sessionId);
};

export const rotateSessionRefreshToken = (sessionId: string, refreshToken: string) => {
  return rotateRefreshTokenForSession({
    sessionId,
    refreshTokenHash: hashRefreshToken(refreshToken),
    expiresAt: getRefreshTokenExpiryDate(),
  });
};

export const revokeSession = (sessionId: string, revokedReason: string) => {
  return revokeSessionById(sessionId, revokedReason);
};

export const revokeAllUserSessions = (userId: string, revokedReason: string) => {
  return revokeAllSessionsForUser(userId, revokedReason);
};

export const listUserSessions = async (
  userId: string,
  currentSessionId: string,
): Promise<ListMySessionsResponse> => {
  const sessions = await findSessionsForUser(userId);

  return {
    sessions: sessions.map((session) => ({
      id: session._id.toString(),
      role: session.role,
      deviceId: session.deviceId ?? null,
      deviceName: resolveDeviceName(session),
      deviceType: session.deviceType,
      appSurface: session.appSurface,
      appVersion: session.appVersion ?? null,
      ipAddress: session.ipAddress ?? null,
      userAgent: session.userAgent ?? null,
      lastUsedAt: session.lastUsedAt?.toISOString() ?? null,
      expiresAt: session.expiresAt.toISOString(),
      isCurrent: session._id.toString() === currentSessionId,
      isRevoked: session.isRevoked,
      revokedAt: session.revokedAt?.toISOString() ?? null,
      revokedReason: session.revokedReason ?? null,
      createdAt: session.createdAt.toISOString(),
    })),
  };
};

export const resolveSessionDeviceName = resolveDeviceName;

export const revokeOwnedSession = (
  userId: string,
  sessionId: string,
  revokedReason: string,
) => {
  return revokeOwnedSessionById(userId, sessionId, revokedReason);
};

export const revokeOtherUserSessions = (
  userId: string,
  currentSessionId: string,
  revokedReason: string,
) => {
  return revokeOtherSessionsForUser(userId, currentSessionId, revokedReason);
};

export const listAdminUserSessions = async (
  userId: string,
): Promise<ListAdminUserSessionsResponse> => {
  await assertActiveTargetUser(userId);
  const sessions = await findSessionsForUser(userId);

  return {
    userId,
    sessions: sessions.map((session) => mapSessionToAdminSummary(session)),
  };
};

export const revokeAdminUserSession = async ({
  admin,
  userId,
  sessionId,
}: {
  admin: AuthUserContext;
  userId: string;
  sessionId: string;
}): Promise<RevokeAdminUserSessionResponse> => {
  await assertActiveTargetUser(userId);

  const existingSession = await findSessionById(sessionId);

  if (
    !existingSession ||
    existingSession.isDeleted ||
    existingSession.userId.toString() !== userId
  ) {
    throw new AppError({
      message: 'Session not found',
      statusCode: HTTP_STATUS.NOT_FOUND,
      errorCode: ERROR_CODES.SESSION_NOT_FOUND,
    });
  }

  const alreadyRevoked = existingSession.isRevoked;
  const revokedSession = await revokeUserSessionById(
    userId,
    sessionId,
    ADMIN_SESSION_REVOKED_REASON,
  );

  if (!revokedSession) {
    throw new AppError({
      message: 'Session not found',
      statusCode: HTTP_STATUS.NOT_FOUND,
      errorCode: ERROR_CODES.SESSION_NOT_FOUND,
    });
  }

  await writeAdminSessionAudit({
    admin,
    targetUserId: userId,
    sessionId: revokedSession._id.toString(),
    eventType: AUDIT_EVENTS.AUTH_SESSION_REVOKED,
    metadata: {
      revokedSessionId: revokedSession._id.toString(),
      adminRevoked: true,
      alreadyRevoked,
    },
  });

  return {
    userId,
    sessionId: revokedSession._id.toString(),
    alreadyRevoked,
  };
};

export const revokeAllAdminUserSessions = async ({
  admin,
  userId,
}: {
  admin: AuthUserContext;
  userId: string;
}): Promise<RevokeAllAdminUserSessionsResponse> => {
  await assertActiveTargetUser(userId);

  const result = await revokeAllSessionsForUser(userId, ADMIN_ALL_SESSIONS_REVOKED_REASON);

  await writeAdminSessionAudit({
    admin,
    targetUserId: userId,
    sessionId: null,
    eventType: AUDIT_EVENTS.AUTH_OTHER_SESSIONS_REVOKED,
    metadata: {
      revokedCount: result.modifiedCount,
      adminRevokedAll: true,
    },
  });

  return {
    userId,
    revokedCount: result.modifiedCount,
  };
};
