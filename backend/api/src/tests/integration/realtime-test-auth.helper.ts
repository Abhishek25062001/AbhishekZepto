import { Types } from 'mongoose';
import { AUTH_ACCOUNT_STATUS } from '../../modules/auth/constants/auth-status.constants';
import { generateAccessToken } from '../../modules/auth/services/token.service';
import * as authSessionRepository from '../../modules/auth/repositories/auth-session.repository';
import * as roleRepository from '../../modules/auth/repositories/role.repository';
import * as userIdentityRepository from '../../modules/auth/repositories/user-identity.repository';
import type { AuthRole } from '../../modules/auth/types/auth-role.types';

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

export const createRealtimeTestToken = ({
  role,
  storeId,
  cityId,
}: {
  role: AuthRole;
  storeId?: string | null;
  cityId?: string | null;
}) => {
  const userId = new Types.ObjectId();
  const sessionId = new Types.ObjectId();
  const token = generateAccessToken({
    userId: userId.toString(),
    role,
    sessionId: sessionId.toString(),
    permissions: [],
    storeId: storeId ?? null,
    cityId: cityId ?? null,
  });

  mutableAuthSessionRepository.findActiveSessionById = async () =>
    ({
      _id: sessionId,
      userId,
      expiresAt: new Date(Date.now() + 60_000),
    }) as never;
  mutableUserIdentityRepository.findActiveUserIdentityById = async () =>
    ({
      _id: userId,
      role,
      accountStatus: AUTH_ACCOUNT_STATUS.ACTIVE,
      permissions: [],
      vendorId: null,
      storeId: storeId ? new Types.ObjectId(storeId) : null,
      cityId: cityId ? new Types.ObjectId(cityId) : null,
    }) as never;
  mutableRoleRepository.findRoleByCode = (async () => null) as never;

  return {
    token,
    userId: userId.toString(),
    sessionId: sessionId.toString(),
  };
};
