import { AppError } from '../../../errors/AppError';
import { ERROR_CODES } from '../../../errors/error-codes';
import { HTTP_STATUS } from '../../../utils/http-status';
import {
  ADMIN_CONTROL_SESSION_TIMEOUT_MS,
} from '../constants/admin-control-session.constants';
import {
  createAdminControlSessionRecord,
  endAdminControlSessionRecord,
  endExpiredAdminControlSessions,
  findActiveAdminControlSessions,
  findAdminControlSessionById,
  updateAdminControlSessionHeartbeat,
} from '../repositories/admin-control-session.repository';
import type {
  AdminControlSessionRecord,
  AdminControlSessionResponse,
  CreateAdminControlSessionInput,
} from '../types/admin-control-session.types';

type SessionWithId = AdminControlSessionRecord & { _id: { toString: () => string } };

const toSessionResponse = (record: SessionWithId): AdminControlSessionResponse => ({
  sessionId: record._id.toString(),
  adminId: record.adminId.toString(),
  sessionType: record.sessionType,
  cityScope: record.cityScope.map((cityId) => cityId.toString()),
  startedAt: record.startedAt.toISOString(),
  endedAt: record.endedAt?.toISOString() ?? null,
  activeModules: record.activeModules,
  lastHeartbeatAt: record.lastHeartbeatAt.toISOString(),
});

const getExpiryThreshold = (now: Date): Date =>
  new Date(now.getTime() - ADMIN_CONTROL_SESSION_TIMEOUT_MS);

const assertActiveSession = (session: SessionWithId, now: Date): void => {
  if (session.endedAt) {
    throw new AppError({
      message: 'Admin control session has already ended',
      statusCode: HTTP_STATUS.CONFLICT,
      errorCode: ERROR_CODES.SESSION_EXPIRED,
    });
  }

  if (session.lastHeartbeatAt < getExpiryThreshold(now)) {
    throw new AppError({
      message: 'Admin control session has expired',
      statusCode: HTTP_STATUS.CONFLICT,
      errorCode: ERROR_CODES.SESSION_EXPIRED,
    });
  }
};

export const startAdminControlSession = async (
  input: CreateAdminControlSessionInput,
): Promise<AdminControlSessionResponse> => {
  const record = await createAdminControlSessionRecord(input);

  return toSessionResponse(record);
};

export const endAdminControlSession = async (
  sessionId: string,
): Promise<AdminControlSessionResponse> => {
  const now = new Date();
  const record = await endAdminControlSessionRecord(sessionId, now);
  if (!record) {
    throw new AppError({
      message: 'Admin control session not found',
      statusCode: HTTP_STATUS.NOT_FOUND,
      errorCode: ERROR_CODES.SESSION_NOT_FOUND,
    });
  }

  return toSessionResponse(record);
};

export const heartbeatAdminControlSession = async (
  sessionId: string,
): Promise<AdminControlSessionResponse> => {
  const now = new Date();
  const existing = await findAdminControlSessionById(sessionId);
  if (!existing) {
    throw new AppError({
      message: 'Admin control session not found',
      statusCode: HTTP_STATUS.NOT_FOUND,
      errorCode: ERROR_CODES.SESSION_NOT_FOUND,
    });
  }

  assertActiveSession(existing, now);

  const record = await updateAdminControlSessionHeartbeat(sessionId, now);
  if (!record) {
    throw new AppError({
      message: 'Admin control session not found',
      statusCode: HTTP_STATUS.NOT_FOUND,
      errorCode: ERROR_CODES.SESSION_NOT_FOUND,
    });
  }

  return toSessionResponse(record);
};

export const listActiveAdminControlSessions = async (): Promise<AdminControlSessionResponse[]> => {
  const now = new Date();
  await endExpiredAdminControlSessions(getExpiryThreshold(now), now);
  const records = await findActiveAdminControlSessions(getExpiryThreshold(now));

  return records.map((record) => toSessionResponse(record));
};
