import type { ExtendedError } from 'socket.io/dist/namespace';
import { AUTH_ACCOUNT_STATUS } from '../../auth/constants/auth-status.constants';
import { AUTH_ROLE } from '../../auth/constants/auth-role.constants';
import {
  findActiveSessionById,
  findActiveUserIdentityById,
  findRoleByCode,
} from '../../auth/repositories';
import { resolveEffectivePermissions } from '../../auth/services/permission.service';
import { resolveEffectiveAuthScope } from '../../auth/services/scope-access.service';
import { verifyAccessToken } from '../../auth/services/token.service';
import type { AuthRole } from '../../auth/types/auth-role.types';
import { SOCKET_ERROR_CODES } from '../constants/socket-error-codes.constant';
import { REALTIME_EVENTS } from '../constants/realtime-events.constant';
import {
  SOCKET_USER_ROLE,
  type AuthenticatedSocket,
  type SocketUserRole,
} from '../types/realtime.types';
import { mapSocketUserPayload } from '../utils/socket-user.mapper';

const resolveSocketRole = (role: AuthRole): SocketUserRole => {
  if (role === AUTH_ROLE.CUSTOMER) {
    return SOCKET_USER_ROLE.CUSTOMER;
  }

  if (role === AUTH_ROLE.DELIVERY_AGENT) {
    return SOCKET_USER_ROLE.DELIVERY_AGENT;
  }

  if (
    role === AUTH_ROLE.VENDOR_OWNER ||
    role === AUTH_ROLE.STORE_MANAGER ||
    role === AUTH_ROLE.STORE_STAFF
  ) {
    return SOCKET_USER_ROLE.VENDOR;
  }

  return SOCKET_USER_ROLE.ADMIN;
};

const getHandshakeToken = (socket: AuthenticatedSocket): string | null => {
  const authToken = socket.handshake.auth?.token;

  if (typeof authToken === 'string' && authToken.trim()) {
    return authToken.trim();
  }

  const authorizationHeader = socket.handshake.headers.authorization;
  const bearerPrefix = 'Bearer ';

  if (
    typeof authorizationHeader === 'string' &&
    authorizationHeader.startsWith(bearerPrefix)
  ) {
    return authorizationHeader.slice(bearerPrefix.length).trim();
  }

  return null;
};

const rejectSocket = (
  socket: AuthenticatedSocket,
  message: string,
  code: string,
  next: (error?: ExtendedError) => void,
): void => {
  socket.emit(REALTIME_EVENTS.CONNECTION_ERROR, {
    code,
    message,
  });
  const error = new Error(message) as ExtendedError & { data?: { code: string } };
  error.data = { code };
  next(error);
};

export const socketAuthMiddleware = async (
  socket: AuthenticatedSocket,
  next: (error?: ExtendedError) => void,
): Promise<void> => {
  const token = getHandshakeToken(socket);

  if (!token) {
    rejectSocket(socket, 'Authentication token is required', SOCKET_ERROR_CODES.AUTH_REQUIRED, next);
    return;
  }

  try {
    const tokenPayload = verifyAccessToken(token);
    const session = await findActiveSessionById(tokenPayload.sessionId);

    if (!session || session.userId.toString() !== tokenPayload.userId) {
      rejectSocket(socket, 'Session revoked', SOCKET_ERROR_CODES.INVALID_SOCKET_TOKEN, next);
      return;
    }

    if (session.expiresAt.getTime() <= Date.now()) {
      rejectSocket(socket, 'Session expired', SOCKET_ERROR_CODES.INVALID_SOCKET_TOKEN, next);
      return;
    }

    const user = await findActiveUserIdentityById(tokenPayload.userId);

    if (!user) {
      rejectSocket(socket, 'User not found', SOCKET_ERROR_CODES.INVALID_SOCKET_TOKEN, next);
      return;
    }

    if (user.accountStatus !== AUTH_ACCOUNT_STATUS.ACTIVE) {
      rejectSocket(socket, 'Account is not active', SOCKET_ERROR_CODES.SOCKET_FORBIDDEN, next);
      return;
    }

    const roleRecord = await findRoleByCode(user.role);
    const permissions = resolveEffectivePermissions({
      rolePermissions: roleRecord?.permissions ?? [],
      userPermissions: [...(tokenPayload.permissions ?? []), ...user.permissions],
    });
    const scope = resolveEffectiveAuthScope({
      identityScope: {
        vendorId: user.vendorId?.toString(),
        storeId: user.storeId?.toString(),
        cityId: user.cityId?.toString(),
      },
      tokenScope: {
        vendorId: tokenPayload.vendorId,
        storeId: tokenPayload.storeId,
        cityId: tokenPayload.cityId,
      },
    });

    const mappedSocketUser = mapSocketUserPayload({
      tokenPayload,
      user,
      session,
      permissions,
    });
    const socketUser = {
      ...mappedSocketUser,
      vendorId: scope.vendorId ?? null,
      storeId: scope.storeId ?? null,
      cityId: scope.cityId ?? null,
    };

    socket.data.userId = socketUser.userId;
    socket.data.role = socketUser.role;
    socket.data.permissions = socketUser.permissions;
    socket.data.sessionId = socketUser.sessionId;
    socket.data.vendorId = socketUser.vendorId;
    socket.data.storeId = socketUser.storeId;
    socket.data.cityId = socketUser.cityId;
    socket.data.user = {
      ...socketUser,
      socketRole: resolveSocketRole(user.role),
    };
    socket.data.meta = {
      socketId: socket.id,
      namespace: socket.nsp.name,
      connectedAt: new Date(),
      userAgent: socket.handshake.headers['user-agent'] ?? null,
      ipAddress: socket.handshake.address ?? null,
    };

    next();
  } catch {
    rejectSocket(socket, 'Invalid authentication token', SOCKET_ERROR_CODES.INVALID_SOCKET_TOKEN, next);
  }
};
