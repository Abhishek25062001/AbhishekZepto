import { Types } from 'mongoose';
import { AppError } from '../../../errors/AppError';
import { env } from '../../../config/env';
import { ERROR_CODES } from '../../../errors/error-codes';
import { HTTP_STATUS } from '../../../utils/http-status';
import { AUDIT_EVENTS, writeAuditLog } from '../../audit';
import type { AuditActorSurface } from '../../audit';
import { AUTH_ACCOUNT_STATUS } from '../constants/auth-status.constants';
import {
  blockOtpChallenge,
  createOtpChallenge,
  findLatestActiveOtpChallenge,
  findOtpChallengeById,
  incrementOtpAttemptCount,
  markOtpChallengeVerified,
  updateOtpChallengeAfterResend,
  updateLastLoginAt,
  findActiveUserIdentityById,
  findActiveUserIdentityByPhoneAndRole,
  findRoleByCode,
} from '../repositories';
import type {
  AuthUserContext,
  ListMySessionsResponse,
  LogoutBody,
  LogoutOtherSessionsBody,
  LogoutSessionBody,
  RefreshTokenBody,
  RequestOtpBody,
  RequestOtpResponse,
  RefreshTokenResponse,
  VerifyOtpBody,
  VerifyOtpResponse,
} from '../types';
import type { PermissionCode } from '../types/auth-permission.types';
import type { AuthRole } from '../types/auth-role.types';
import type { AuthAuditContext, AuthUserResponse, OptionalObjectId } from '../types/otp.types';
import {
  ACCESS_TOKEN_EXPIRES_IN_SECONDS,
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from './token.service';
import {
  canResendOtpAt,
  generateOtp,
  getOtpBlockUntilDate,
  getOtpExpiryDate,
  hasExceededOtpAttempts,
  hasExceededOtpResends,
  hasOtpExpired,
  isOtpBlocked,
  isOtpResendLocked,
  maskOtpTarget,
  hashOtp,
  verifyOtpHash,
} from './otp.service';
import { sendOtp } from './otp-provider.service';
import {
  createSessionForUser,
  findSessionByRefreshToken,
  listUserSessions,
  revokeAllUserSessions,
  revokeOtherUserSessions,
  revokeOwnedSession,
  revokeSession,
  rotateSessionRefreshToken,
} from './session.service';
import { resolveEffectivePermissions } from './permission.service';
import { normalizeAuthScope } from './scope-access.service';

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

const toObjectIdOrNull = (value: OptionalObjectId | string): Types.ObjectId | null => {
  if (!value) {
    return null;
  }

  if (value instanceof Types.ObjectId) {
    return value;
  }

  if (!Types.ObjectId.isValid(value)) {
    return null;
  }

  return new Types.ObjectId(value);
};

const toNullableString = (value: OptionalObjectId): string | null => {
  return value ? value.toString() : null;
};

const assertUserCanLogin = (accountStatus: string): void => {
  if (accountStatus === AUTH_ACCOUNT_STATUS.BLOCKED) {
    throw new AppError({
      message: 'Account is blocked',
      statusCode: HTTP_STATUS.FORBIDDEN,
      errorCode: ERROR_CODES.ACCOUNT_BLOCKED,
    });
  }

  if (accountStatus === AUTH_ACCOUNT_STATUS.INACTIVE) {
    throw new AppError({
      message: 'Account is inactive',
      statusCode: HTTP_STATUS.FORBIDDEN,
      errorCode: ERROR_CODES.ACCOUNT_INACTIVE,
    });
  }

  if (accountStatus === AUTH_ACCOUNT_STATUS.PENDING_APPROVAL) {
    throw new AppError({
      message: 'Account approval is pending',
      statusCode: HTTP_STATUS.FORBIDDEN,
      errorCode: ERROR_CODES.ACCOUNT_PENDING_APPROVAL,
    });
  }
};

const assertRoleAllowedForSurface = ({
  role,
  appSurface,
}: VerifyOtpBody['device'] & { role: AuthRole }): void => {
  const isCustomerSurface = appSurface === 'customer_app' && role === 'customer';
  const isDeliverySurface =
    appSurface === 'delivery_agent_app' && role === 'delivery_agent';
  const isVendorSurface =
    appSurface === 'vendor_panel' &&
    ['vendor_owner', 'store_manager', 'store_staff'].includes(role);
  const isAdminSurface =
    appSurface === 'admin_dashboard' &&
    ['support_admin', 'operations_admin', 'super_admin'].includes(role);

  if (!(isCustomerSurface || isDeliverySurface || isVendorSurface || isAdminSurface)) {
    throw new AppError({
      message: 'Role is not allowed for this app surface',
      statusCode: HTTP_STATUS.FORBIDDEN,
      errorCode: ERROR_CODES.ROLE_NOT_ALLOWED,
    });
  }
};

const resolveUserPermissions = async ({
  role,
  explicitPermissions,
}: {
  role: AuthRole;
  explicitPermissions: string[];
}): Promise<PermissionCode[]> => {
  const roleRecord = await findRoleByCode(role);
  return resolveEffectivePermissions({
    rolePermissions: roleRecord?.permissions ?? [],
    userPermissions: explicitPermissions,
  });
};

const buildAuthUserResponse = async (user: {
  _id: Types.ObjectId;
  role: AuthRole;
  permissions: string[];
  vendorId: Types.ObjectId | null;
  storeId: Types.ObjectId | null;
  cityId: Types.ObjectId | null;
}): Promise<AuthUserResponse> => {
  const permissions = await resolveUserPermissions({
    role: user.role,
    explicitPermissions: user.permissions,
  });
  const scope = normalizeAuthScope({
    vendorId: toNullableString(user.vendorId),
    storeId: toNullableString(user.storeId),
    cityId: toNullableString(user.cityId),
  });

  return {
    userId: user._id.toString(),
    role: user.role,
    permissions,
    ...scope,
  };
};

const writeFailedLoginAudit = async ({
  role,
  metadata,
  requestId,
  traceId,
  ipAddress,
  userAgent,
}: {
  role: AuthRole;
  metadata: Record<string, unknown>;
} & AuthAuditContext) => {
  await writeAuditLog({
    eventType: AUDIT_EVENTS.AUTH_LOGIN_FAILED,
    actorId: null,
    actorRole: role,
    actorSurface: roleSurfaceMap[role],
    entityType: null,
    entityId: null,
    vendorId: null,
    storeId: null,
    cityId: null,
    requestId: requestId ?? null,
    traceId: traceId ?? null,
    ipAddress: ipAddress ?? null,
    userAgent: userAgent ?? null,
    metadata,
    status: 'failed',
  });
};

export const requestOtp = async (
  input: RequestOtpBody,
  context: AuthAuditContext,
): Promise<RequestOtpResponse> => {
  const purpose = input.purpose ?? 'login';
  const deliveryChannel = input.deliveryChannel ?? 'sms';
  const user = await findActiveUserIdentityByPhoneAndRole(input.phone, input.role);

  if (!user) {
    throw new AppError({
      message: 'User not found',
      statusCode: HTTP_STATUS.NOT_FOUND,
      errorCode: ERROR_CODES.USER_NOT_FOUND,
    });
  }

  assertUserCanLogin(user.accountStatus);

  const latestChallenge = await findLatestActiveOtpChallenge({
    phone: input.phone,
    role: input.role,
    purpose,
  });

  const otp = generateOtp();
  const expiresAt = getOtpExpiryDate();
  const now = new Date();
  let challenge;

  if (latestChallenge) {
    if (isOtpResendLocked(latestChallenge.lastSentAt)) {
      throw new AppError({
        message: 'OTP resend is not available yet',
        statusCode: HTTP_STATUS.TOO_MANY_REQUESTS,
        errorCode: ERROR_CODES.RATE_LIMITED,
        details: {
          canResendAfter: Math.max(
            Math.ceil(
              (canResendOtpAt(latestChallenge.lastSentAt).getTime() - Date.now()) / 1000,
            ),
            0,
          ),
        },
      });
    }

    if (
      hasExceededOtpResends({
        resendCount: latestChallenge.resendCount,
        maxResends: latestChallenge.maxResends,
      })
    ) {
      throw new AppError({
        message: 'Maximum OTP resend limit reached',
        statusCode: HTTP_STATUS.TOO_MANY_REQUESTS,
        errorCode: ERROR_CODES.OTP_RESEND_LIMIT_EXCEEDED,
      });
    }

    challenge = await updateOtpChallengeAfterResend({
      challengeId: latestChallenge._id.toString(),
      otpHash: hashOtp(otp),
      expiresAt,
      lastSentAt: now,
    });
  } else {
    challenge = await createOtpChallenge({
      phone: input.phone,
      role: input.role,
      otpHash: hashOtp(otp),
      purpose,
      deliveryChannel,
      deliveryTarget: input.phone,
      expiresAt,
      attemptCount: 0,
      maxAttempts: env.OTP_MAX_ATTEMPTS,
      resendCount: 0,
      maxResends: env.OTP_MAX_RESENDS,
      lastSentAt: now,
      ipAddress: context.ipAddress ?? null,
      userAgent: context.userAgent ?? null,
      requestId: context.requestId ?? null,
      traceId: context.traceId ?? null,
    });
  }

  if (!challenge) {
    throw new AppError({
      message: 'Unable to create OTP challenge',
      statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR,
      errorCode: ERROR_CODES.INTERNAL_SERVER_ERROR,
    });
  }

  await sendOtp({
    phone: input.phone,
    otp,
    deliveryChannel,
    requestId: context.requestId,
    traceId: context.traceId,
  });

  await writeAuditLog({
    eventType: AUDIT_EVENTS.AUTH_OTP_REQUESTED,
    actorId: toObjectIdOrNull(user._id),
    actorRole: user.role,
    actorSurface: roleSurfaceMap[user.role],
    entityType: 'otp_challenge',
    entityId: toObjectIdOrNull(challenge._id),
    vendorId: toObjectIdOrNull(user.vendorId),
    storeId: toObjectIdOrNull(user.storeId),
    cityId: toObjectIdOrNull(user.cityId),
    requestId: context.requestId ?? null,
    traceId: context.traceId ?? null,
    ipAddress: context.ipAddress ?? null,
    userAgent: context.userAgent ?? null,
    metadata: {
      deliveryChannel,
      maskedTarget: maskOtpTarget(input.phone),
      purpose,
    },
    status: 'success',
  });

  return {
    challengeId: challenge._id.toString(),
    expiresIn: Math.max(Math.floor((expiresAt.getTime() - Date.now()) / 1000), 0),
    canResendAfter: Math.max(
      Math.ceil((canResendOtpAt(challenge.lastSentAt).getTime() - Date.now()) / 1000),
      0,
    ),
    deliveryChannel,
    maskedTarget: maskOtpTarget(input.phone),
  };
};

export const verifyOtp = async (
  input: VerifyOtpBody,
  context: AuthAuditContext,
): Promise<VerifyOtpResponse> => {
  assertRoleAllowedForSurface({
    role: input.role,
    ...input.device,
  });

  const challenge = await findOtpChallengeById(input.challengeId);

  if (!challenge || challenge.phone !== input.phone || challenge.role !== input.role) {
    await writeFailedLoginAudit({
      role: input.role,
      requestId: context.requestId,
      traceId: context.traceId,
      ipAddress: context.ipAddress,
      userAgent: context.userAgent,
      metadata: {
        reason: ERROR_CODES.OTP_CHALLENGE_NOT_FOUND,
      },
    });

    throw new AppError({
      message: 'OTP challenge not found',
      statusCode: HTTP_STATUS.NOT_FOUND,
      errorCode: ERROR_CODES.OTP_CHALLENGE_NOT_FOUND,
    });
  }

  if (challenge.verifiedAt) {
    throw new AppError({
      message: 'OTP expired',
      statusCode: HTTP_STATUS.BAD_REQUEST,
      errorCode: ERROR_CODES.OTP_EXPIRED,
    });
  }

  if (hasOtpExpired(challenge.expiresAt)) {
    throw new AppError({
      message: 'OTP expired',
      statusCode: HTTP_STATUS.BAD_REQUEST,
      errorCode: ERROR_CODES.OTP_EXPIRED,
    });
  }

  if (
    isOtpBlocked(challenge.blockedUntil) ||
    hasExceededOtpAttempts({
      attemptCount: challenge.attemptCount,
      maxAttempts: challenge.maxAttempts,
    })
  ) {
    throw new AppError({
      message: 'Maximum OTP attempts reached',
      statusCode: HTTP_STATUS.TOO_MANY_REQUESTS,
      errorCode: ERROR_CODES.OTP_ATTEMPTS_EXCEEDED,
    });
  }

  if (
    !verifyOtpHash({
      otp: input.otp,
      otpHash: challenge.otpHash,
    })
  ) {
    const updatedChallenge = await incrementOtpAttemptCount(challenge._id.toString());
    const currentChallenge = updatedChallenge ?? challenge;
    const attemptCount = currentChallenge.attemptCount;

    if (
      hasExceededOtpAttempts({
        attemptCount,
        maxAttempts: currentChallenge.maxAttempts,
      })
    ) {
      await blockOtpChallenge(currentChallenge._id.toString(), getOtpBlockUntilDate());
      await writeFailedLoginAudit({
        role: input.role,
        requestId: context.requestId,
        traceId: context.traceId,
        ipAddress: context.ipAddress,
        userAgent: context.userAgent,
        metadata: {
          reason: ERROR_CODES.OTP_ATTEMPTS_EXCEEDED,
        },
      });

      throw new AppError({
        message: 'Maximum OTP attempts reached',
        statusCode: HTTP_STATUS.TOO_MANY_REQUESTS,
        errorCode: ERROR_CODES.OTP_ATTEMPTS_EXCEEDED,
      });
    }

    await writeFailedLoginAudit({
      role: input.role,
      requestId: context.requestId,
      traceId: context.traceId,
      ipAddress: context.ipAddress,
      userAgent: context.userAgent,
      metadata: {
        attemptsRemaining: Math.max(currentChallenge.maxAttempts - attemptCount, 0),
        reason: ERROR_CODES.INVALID_OTP,
      },
    });

    throw new AppError({
      message: 'Invalid OTP',
      statusCode: HTTP_STATUS.BAD_REQUEST,
      errorCode: ERROR_CODES.INVALID_OTP,
      details: {
        attemptsRemaining: Math.max(currentChallenge.maxAttempts - attemptCount, 0),
      },
    });
  }

  const user = await findActiveUserIdentityByPhoneAndRole(input.phone, input.role);

  if (!user) {
    throw new AppError({
      message: 'User not found',
      statusCode: HTTP_STATUS.NOT_FOUND,
      errorCode: ERROR_CODES.USER_NOT_FOUND,
    });
  }

  assertUserCanLogin(user.accountStatus);

  await markOtpChallengeVerified(challenge._id.toString());

  const resolvedUser = await buildAuthUserResponse(user);
  const sessionId = new Types.ObjectId().toString();
  const refreshToken = generateRefreshToken({
    userId: resolvedUser.userId,
    role: resolvedUser.role,
    sessionId,
  });
  const accessToken = generateAccessToken({
    userId: resolvedUser.userId,
    role: resolvedUser.role,
    sessionId,
    permissions: resolvedUser.permissions,
    vendorId: resolvedUser.vendorId,
    storeId: resolvedUser.storeId,
    cityId: resolvedUser.cityId,
  });

  await createSessionForUser({
    sessionId,
    userId: resolvedUser.userId,
    role: resolvedUser.role,
    refreshToken,
    device: input.device,
    ipAddress: context.ipAddress ?? null,
    userAgent: context.userAgent ?? null,
  });

  await updateLastLoginAt(resolvedUser.userId);

  await writeAuditLog({
    eventType: AUDIT_EVENTS.AUTH_LOGIN_SUCCESS,
    actorId: toObjectIdOrNull(user._id),
    actorRole: user.role,
    actorSurface: roleSurfaceMap[user.role],
    entityType: 'auth_session',
    entityId: toObjectIdOrNull(sessionId),
    vendorId: toObjectIdOrNull(user.vendorId),
    storeId: toObjectIdOrNull(user.storeId),
    cityId: toObjectIdOrNull(user.cityId),
    requestId: context.requestId ?? null,
    traceId: context.traceId ?? null,
    ipAddress: context.ipAddress ?? null,
    userAgent: context.userAgent ?? null,
    metadata: {
      appSurface: input.device.appSurface,
      deviceType: input.device.deviceType,
    },
    status: 'success',
  });

  return {
    accessToken,
    refreshToken,
    expiresIn: ACCESS_TOKEN_EXPIRES_IN_SECONDS,
    user: resolvedUser,
  };
};

export const refreshAccessToken = async (
  input: RefreshTokenBody,
  context: AuthAuditContext,
): Promise<RefreshTokenResponse> => {
  const tokenPayload = verifyRefreshToken(input.refreshToken);
  const session = await findSessionByRefreshToken(input.refreshToken);

  if (!session || session._id.toString() !== tokenPayload.sessionId) {
    throw new AppError({
      message: 'Invalid refresh token',
      statusCode: HTTP_STATUS.UNAUTHORIZED,
      errorCode: ERROR_CODES.INVALID_REFRESH_TOKEN,
    });
  }

  if (session.isRevoked) {
    throw new AppError({
      message: 'Session revoked',
      statusCode: HTTP_STATUS.UNAUTHORIZED,
      errorCode: ERROR_CODES.SESSION_REVOKED,
    });
  }

  if (session.expiresAt.getTime() <= Date.now()) {
    throw new AppError({
      message: 'Session expired',
      statusCode: HTTP_STATUS.UNAUTHORIZED,
      errorCode: ERROR_CODES.SESSION_EXPIRED,
    });
  }

  const user = await findActiveUserIdentityById(tokenPayload.userId);

  if (!user) {
    throw new AppError({
      message: 'User not found',
      statusCode: HTTP_STATUS.NOT_FOUND,
      errorCode: ERROR_CODES.USER_NOT_FOUND,
    });
  }

  assertUserCanLogin(user.accountStatus);

  const resolvedUser = await buildAuthUserResponse(user);
  const rotatedRefreshToken = generateRefreshToken({
    userId: resolvedUser.userId,
    role: resolvedUser.role,
    sessionId: session._id.toString(),
  });
  const accessToken = generateAccessToken({
    userId: resolvedUser.userId,
    role: resolvedUser.role,
    sessionId: session._id.toString(),
    permissions: resolvedUser.permissions,
    vendorId: resolvedUser.vendorId,
    storeId: resolvedUser.storeId,
    cityId: resolvedUser.cityId,
  });

  await rotateSessionRefreshToken(session._id.toString(), rotatedRefreshToken);

  await writeAuditLog({
    eventType: AUDIT_EVENTS.AUTH_REFRESH_TOKEN_SUCCESS,
    actorId: toObjectIdOrNull(user._id),
    actorRole: user.role,
    actorSurface: roleSurfaceMap[user.role],
    entityType: 'auth_session',
    entityId: toObjectIdOrNull(session._id),
    vendorId: toObjectIdOrNull(user.vendorId),
    storeId: toObjectIdOrNull(user.storeId),
    cityId: toObjectIdOrNull(user.cityId),
    requestId: context.requestId ?? null,
    traceId: context.traceId ?? null,
    ipAddress: context.ipAddress ?? null,
    userAgent: context.userAgent ?? null,
    metadata: {
      refreshTokenRotated: true,
    },
    status: 'success',
  });

  return {
    accessToken,
    refreshToken: rotatedRefreshToken,
    expiresIn: ACCESS_TOKEN_EXPIRES_IN_SECONDS,
  };
};

export const logout = async (
  input: LogoutBody,
  context: AuthAuditContext,
): Promise<Record<string, never>> => {
  const tokenPayload = verifyRefreshToken(input.refreshToken);
  const session = await findSessionByRefreshToken(input.refreshToken);

  if (!session) {
    return {};
  }

  if (input.logoutAllDevices) {
    await revokeAllUserSessions(tokenPayload.userId, 'user_logout_all_devices');
  } else {
    await revokeSession(session._id.toString(), 'user_logout');
  }

  const user = await findActiveUserIdentityById(tokenPayload.userId);

  await writeAuditLog({
    eventType: AUDIT_EVENTS.AUTH_LOGOUT,
    actorId: toObjectIdOrNull(tokenPayload.userId),
    actorRole: tokenPayload.role,
    actorSurface: roleSurfaceMap[tokenPayload.role],
    entityType: 'auth_session',
    entityId: toObjectIdOrNull(session._id),
    vendorId: toObjectIdOrNull(user?.vendorId),
    storeId: toObjectIdOrNull(user?.storeId),
    cityId: toObjectIdOrNull(user?.cityId),
    requestId: context.requestId ?? null,
    traceId: context.traceId ?? null,
    ipAddress: context.ipAddress ?? null,
    userAgent: context.userAgent ?? null,
    metadata: {
      logoutAllDevices: Boolean(input.logoutAllDevices),
    },
    status: 'success',
  });

  return {};
};

export const listMySessions = async (
  user: AuthUserContext,
): Promise<ListMySessionsResponse> => {
  return listUserSessions(user.userId, user.sessionId);
};

export const logoutOwnedSession = async (
  user: AuthUserContext,
  input: LogoutSessionBody,
): Promise<Record<string, never>> => {
  if (input.sessionId === user.sessionId) {
    throw new AppError({
      message: 'Use standard logout for the current session',
      statusCode: HTTP_STATUS.BAD_REQUEST,
      errorCode: ERROR_CODES.SESSION_ACCESS_DENIED,
    });
  }

  const revokedSession = await revokeOwnedSession(
    user.userId,
    input.sessionId,
    'user_logout_selected_session',
  );

  if (!revokedSession) {
    throw new AppError({
      message: 'Session not found',
      statusCode: HTTP_STATUS.NOT_FOUND,
      errorCode: ERROR_CODES.SESSION_NOT_FOUND,
    });
  }

  await writeAuditLog({
    eventType: AUDIT_EVENTS.AUTH_SESSION_REVOKED,
    actorId: toObjectIdOrNull(user.userId),
    actorRole: user.role,
    actorSurface: roleSurfaceMap[user.role],
    entityType: 'auth_session',
    entityId: toObjectIdOrNull(revokedSession._id),
    vendorId: toObjectIdOrNull(user.vendorId),
    storeId: toObjectIdOrNull(user.storeId),
    cityId: toObjectIdOrNull(user.cityId),
    requestId: null,
    traceId: null,
    ipAddress: null,
    userAgent: null,
    metadata: {
      revokedSessionId: revokedSession._id.toString(),
    },
    status: 'success',
  });

  return {};
};

export const logoutOtherSessions = async (
  user: AuthUserContext,
  _input?: LogoutOtherSessionsBody,
): Promise<Record<string, never>> => {
  void _input;

  await revokeOtherUserSessions(
    user.userId,
    user.sessionId,
    'user_logout_other_sessions',
  );

  await writeAuditLog({
    eventType: AUDIT_EVENTS.AUTH_OTHER_SESSIONS_REVOKED,
    actorId: toObjectIdOrNull(user.userId),
    actorRole: user.role,
    actorSurface: roleSurfaceMap[user.role],
    entityType: 'auth_session',
    entityId: toObjectIdOrNull(user.sessionId),
    vendorId: toObjectIdOrNull(user.vendorId),
    storeId: toObjectIdOrNull(user.storeId),
    cityId: toObjectIdOrNull(user.cityId),
    requestId: null,
    traceId: null,
    ipAddress: null,
    userAgent: null,
    metadata: {
      preservedSessionId: user.sessionId,
    },
    status: 'success',
  });

  return {};
};
