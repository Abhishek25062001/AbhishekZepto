import assert from 'node:assert/strict';
import { afterEach, test } from 'node:test';
import { Types } from 'mongoose';
import type { AuthSessionRecord } from '../models/auth-session.model';
import { AppError } from '../../../errors/AppError';
import { ERROR_CODES } from '../../../errors/error-codes';
import {
  createSessionForUser,
  listAdminUserSessions,
  listUserSessions,
  revokeAdminUserSession,
  revokeAllAdminUserSessions,
  rotateSessionRefreshToken,
} from './session.service';
import * as sessionRepositoryModule from '../repositories/auth-session.repository';
import * as userIdentityRepositoryModule from '../repositories/user-identity.repository';

type SessionRepositoryModule = {
  createAuthSession: (input: Record<string, unknown>) => Promise<unknown>;
  findSessionsForUser: (userId: string) => Promise<AuthSessionRecordWithId[]>;
  findSessionById: (sessionId: string) => Promise<AuthSessionRecordWithId | null>;
  revokeUserSessionById: (
    userId: string,
    sessionId: string,
    revokedReason: string,
  ) => Promise<AuthSessionRecordWithId | null>;
  revokeAllSessionsForUser: (
    userId: string,
    revokedReason: string,
  ) => Promise<{ modifiedCount: number }>;
  rotateRefreshTokenForSession: (input: {
    sessionId: string;
    refreshTokenHash: string;
    expiresAt: Date;
  }) => Promise<unknown>;
};

type UserIdentityRepositoryModule = {
  findActiveUserIdentityById: (userId: string) => Promise<{ _id: { toString(): string } } | null>;
};

type AuthSessionRecordWithId = AuthSessionRecord & {
  _id: Types.ObjectId;
};

const sessionRepository = sessionRepositoryModule as unknown as SessionRepositoryModule;
const userIdentityRepository =
  userIdentityRepositoryModule as unknown as UserIdentityRepositoryModule;

const originalSessionRepository: SessionRepositoryModule = {
  createAuthSession: sessionRepository.createAuthSession,
  findSessionsForUser: sessionRepository.findSessionsForUser,
  findSessionById: sessionRepository.findSessionById,
  revokeUserSessionById: sessionRepository.revokeUserSessionById,
  revokeAllSessionsForUser: sessionRepository.revokeAllSessionsForUser,
  rotateRefreshTokenForSession: sessionRepository.rotateRefreshTokenForSession,
};

const originalUserIdentityRepository = {
  findActiveUserIdentityById: userIdentityRepository.findActiveUserIdentityById,
};

const buildSessionRecord = (
  overrides: Partial<AuthSessionRecordWithId> = {},
): AuthSessionRecordWithId => ({
  _id: new Types.ObjectId('68295cf6d5cc8fddf6b8d2aa'),
  userId: new Types.ObjectId('68295cf6d5cc8fddf6b8d200'),
  role: 'support_admin',
  refreshTokenHash: 'stored-hash',
  refreshTokenRotatedAt: null,
  deviceId: 'device-1',
  deviceName: null,
  deviceType: 'web',
  appSurface: 'admin_dashboard',
  appVersion: '2.4.0',
  ipAddress: '127.0.0.1',
  userAgent: 'test-agent',
  expiresAt: new Date('2026-06-01T00:00:00.000Z'),
  revokedAt: null,
  revokedReason: null,
  lastUsedAt: new Date('2026-05-15T00:00:00.000Z'),
  isRevoked: false,
  status: 'active',
  isDeleted: false,
  deletedAt: null,
  createdAt: new Date('2026-05-01T00:00:00.000Z'),
  updatedAt: new Date('2026-05-01T00:00:00.000Z'),
  ...overrides,
});

afterEach(() => {
  sessionRepository.createAuthSession = originalSessionRepository.createAuthSession;
  sessionRepository.findSessionsForUser = originalSessionRepository.findSessionsForUser;
  sessionRepository.findSessionById = originalSessionRepository.findSessionById;
  sessionRepository.revokeUserSessionById = originalSessionRepository.revokeUserSessionById;
  sessionRepository.revokeAllSessionsForUser = originalSessionRepository.revokeAllSessionsForUser;
  sessionRepository.rotateRefreshTokenForSession =
    originalSessionRepository.rotateRefreshTokenForSession;
  userIdentityRepository.findActiveUserIdentityById =
    originalUserIdentityRepository.findActiveUserIdentityById;
});

test('createSessionForUser persists derived device metadata', async () => {
  const capturedInput: {
    value: null | {
      deviceName?: string | null;
      deviceId?: string | null;
      appSurface?: string;
      refreshTokenHash?: string;
    };
  } = {
    value: null,
  };

  sessionRepository.createAuthSession = async (input) => {
    capturedInput.value = input as typeof capturedInput.value;
    return input;
  };

  await createSessionForUser({
    sessionId: '68295cf6d5cc8fddf6b8d2ab',
    userId: '68295cf6d5cc8fddf6b8d200',
    role: 'support_admin',
    refreshToken: 'plain-refresh-token',
    device: {
      deviceId: 'device-1',
      deviceType: 'web',
      appSurface: 'admin_dashboard',
      appVersion: '2.4.0',
    },
    ipAddress: '127.0.0.1',
    userAgent: 'test-agent',
  });

  assert.ok(capturedInput.value);
  assert.equal(capturedInput.value.deviceName, 'Admin Dashboard Web v2.4.0');
  assert.equal(capturedInput.value.deviceId, 'device-1');
  assert.equal(capturedInput.value.appSurface, 'admin_dashboard');
  assert.notEqual(capturedInput.value.refreshTokenHash, 'plain-refresh-token');
});

test('listUserSessions returns enriched device and revoke metadata', async () => {
  sessionRepository.findSessionsForUser = async () => [
    buildSessionRecord({
      deviceName: null,
      revokedAt: new Date('2026-05-18T00:00:00.000Z'),
      revokedReason: 'user_logout_selected_session',
      isRevoked: true,
    }),
  ];

  const result = await listUserSessions(
    '68295cf6d5cc8fddf6b8d200',
    '68295cf6d5cc8fddf6b8d2ab',
  );

  assert.equal(result.sessions[0]?.deviceName, 'Admin Dashboard Web v2.4.0');
  assert.equal(result.sessions[0]?.revokedReason, 'user_logout_selected_session');
  assert.equal(result.sessions[0]?.revokedAt, '2026-05-18T00:00:00.000Z');
  assert.equal(result.sessions[0]?.isRevoked, true);
});

test('rotateSessionRefreshToken stores a rotated hash and expiry update', async () => {
  let capturedHash = '';
  let capturedExpiresAt: unknown = null;

  sessionRepository.rotateRefreshTokenForSession = async (input) => {
    capturedHash = input.refreshTokenHash;
    capturedExpiresAt = input.expiresAt;
    return input;
  };

  await rotateSessionRefreshToken(
    '68295cf6d5cc8fddf6b8d2ab',
    'rotated-refresh-token',
  );

  assert.notEqual(capturedHash, 'rotated-refresh-token');
  assert.ok(capturedExpiresAt instanceof Date);
});

test('listAdminUserSessions omits refreshTokenHash and isCurrent', async () => {
  userIdentityRepository.findActiveUserIdentityById = async () => ({
    _id: { toString: () => '68295cf6d5cc8fddf6b8d200' },
  });
  sessionRepository.findSessionsForUser = async () => [buildSessionRecord()];

  const result = await listAdminUserSessions('68295cf6d5cc8fddf6b8d200');

  assert.equal(result.userId, '68295cf6d5cc8fddf6b8d200');
  assert.equal(result.sessions.length, 1);
  assert.equal('refreshTokenHash' in (result.sessions[0] as object), false);
  assert.equal('isCurrent' in (result.sessions[0] as object), false);
});

test('revokeAdminUserSession is idempotent for already revoked sessions', async () => {
  userIdentityRepository.findActiveUserIdentityById = async () => ({
    _id: { toString: () => '68295cf6d5cc8fddf6b8d200' },
  });
  sessionRepository.findSessionById = async () =>
    buildSessionRecord({
      isRevoked: true,
      revokedReason: 'user_logout_selected_session',
    });
  sessionRepository.revokeUserSessionById = async () =>
    buildSessionRecord({
      isRevoked: true,
      revokedReason: 'admin_revoked_session',
    });

  const result = await revokeAdminUserSession({
    admin: {
      userId: '68295cf6d5cc8fddf6b8d201',
      role: 'operations_admin',
      permissions: ['auth:manage'],
      sessionId: '68295cf6d5cc8fddf6b8d2ab',
      vendorId: null,
      storeId: null,
      cityId: null,
    },
    userId: '68295cf6d5cc8fddf6b8d200',
    sessionId: '68295cf6d5cc8fddf6b8d2aa',
  });

  assert.equal(result.alreadyRevoked, true);
});

test('revokeAdminUserSession rejects unknown sessions', async () => {
  userIdentityRepository.findActiveUserIdentityById = async () => ({
    _id: { toString: () => '68295cf6d5cc8fddf6b8d200' },
  });
  sessionRepository.findSessionById = async () => null;

  await assert.rejects(
    () =>
      revokeAdminUserSession({
        admin: {
          userId: '68295cf6d5cc8fddf6b8d201',
          role: 'operations_admin',
          permissions: ['auth:manage'],
          sessionId: '68295cf6d5cc8fddf6b8d2ab',
          vendorId: null,
          storeId: null,
          cityId: null,
        },
        userId: '68295cf6d5cc8fddf6b8d200',
        sessionId: '68295cf6d5cc8fddf6b8d2aa',
      }),
    (error: unknown) =>
      error instanceof AppError && error.errorCode === ERROR_CODES.SESSION_NOT_FOUND,
  );
});

test('revokeAllAdminUserSessions returns modified count', async () => {
  userIdentityRepository.findActiveUserIdentityById = async () => ({
    _id: { toString: () => '68295cf6d5cc8fddf6b8d200' },
  });
  sessionRepository.revokeAllSessionsForUser = async () => ({
    modifiedCount: 3,
  });

  const result = await revokeAllAdminUserSessions({
    admin: {
      userId: '68295cf6d5cc8fddf6b8d201',
      role: 'operations_admin',
      permissions: ['auth:manage'],
      sessionId: '68295cf6d5cc8fddf6b8d2ab',
      vendorId: null,
      storeId: null,
      cityId: null,
    },
    userId: '68295cf6d5cc8fddf6b8d200',
  });

  assert.equal(result.revokedCount, 3);
});
