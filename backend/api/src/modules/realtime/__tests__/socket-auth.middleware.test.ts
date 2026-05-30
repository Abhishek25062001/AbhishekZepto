import assert from 'node:assert/strict';
import { test } from 'node:test';
import { Types } from 'mongoose';
import { AUTH_ACCOUNT_STATUS } from '../../auth/constants/auth-status.constants';
import { generateAccessToken } from '../../auth/services/token.service';
import * as authSessionRepository from '../../auth/repositories/auth-session.repository';
import * as roleRepository from '../../auth/repositories/role.repository';
import * as userIdentityRepository from '../../auth/repositories/user-identity.repository';
import { SOCKET_ERROR_CODES } from '../constants/socket-error-codes.constant';
import { socketAuthMiddleware } from '../middlewares/socket-auth.middleware';
import type { AuthenticatedSocket } from '../types/realtime.types';

type MutableAuthSessionRepository = {
  findActiveSessionById: typeof authSessionRepository.findActiveSessionById;
};
type MutableUserIdentityRepository = {
  findActiveUserIdentityById: typeof userIdentityRepository.findActiveUserIdentityById;
};
type MutableRoleRepository = {
  findRoleByCode: typeof roleRepository.findRoleByCode;
};

const mutableAuthSessionRepository = authSessionRepository as unknown as MutableAuthSessionRepository;
const mutableUserIdentityRepository = userIdentityRepository as unknown as MutableUserIdentityRepository;
const mutableRoleRepository = roleRepository as unknown as MutableRoleRepository;
const originalFindSession = mutableAuthSessionRepository.findActiveSessionById;
const originalFindUser = mutableUserIdentityRepository.findActiveUserIdentityById;
const originalFindRole = mutableRoleRepository.findRoleByCode;

const buildSocket = (token?: string): AuthenticatedSocket => {
  return {
    id: 'socket-1',
    nsp: { name: '/customer' },
    data: {},
    emit: () => true,
    handshake: {
      address: '127.0.0.1',
      auth: token ? { token } : {},
      headers: {
        'user-agent': 'node-test',
      },
    },
  } as unknown as AuthenticatedSocket;
};

test.afterEach(() => {
  mutableAuthSessionRepository.findActiveSessionById = originalFindSession;
  mutableUserIdentityRepository.findActiveUserIdentityById = originalFindUser;
  mutableRoleRepository.findRoleByCode = originalFindRole;
});

test('socketAuthMiddleware attaches authenticated user payload for a valid JWT', async () => {
  const userId = new Types.ObjectId();
  const sessionId = new Types.ObjectId();
  const token = generateAccessToken({
    userId: userId.toString(),
    role: 'customer',
    sessionId: sessionId.toString(),
    permissions: [],
  });
  const socket = buildSocket(token);

  mutableAuthSessionRepository.findActiveSessionById = async () =>
    ({
      _id: sessionId,
      userId,
      expiresAt: new Date(Date.now() + 60_000),
    }) as never;
  mutableUserIdentityRepository.findActiveUserIdentityById = async () =>
    ({
      _id: userId,
      role: 'customer',
      accountStatus: AUTH_ACCOUNT_STATUS.ACTIVE,
      permissions: ['orders:read'],
      vendorId: null,
      storeId: null,
      cityId: null,
    }) as never;
  mutableRoleRepository.findRoleByCode = (async () => null) as never;

  let nextError: Error | undefined;
  await socketAuthMiddleware(socket, (error) => {
    nextError = error;
  });

  assert.equal(nextError, undefined);
  assert.equal(socket.data.userId, userId.toString());
  assert.equal(socket.data.role, 'customer');
  assert.equal(socket.data.sessionId, sessionId.toString());
  assert.equal(socket.data.user?.userId, userId.toString());
  assert.equal(socket.data.user?.socketRole, 'customer');
  assert.deepEqual(socket.data.user?.permissions, ['orders:read']);
});

test('socketAuthMiddleware rejects sockets without a token', async () => {
  const socket = buildSocket();
  let nextError: Error | undefined;

  await socketAuthMiddleware(socket, (error) => {
    nextError = error;
  });

  assert.ok(nextError);
  assert.match(nextError.message, /Authentication token is required/);
  assert.deepEqual((nextError as Error & { data?: unknown }).data, {
    code: SOCKET_ERROR_CODES.AUTH_REQUIRED,
  });
});
