import { AUTH_ROLE } from '../../../modules/auth/constants/auth-role.constants';
import { AUTH_ACCOUNT_STATUS } from '../../../modules/auth/constants/auth-status.constants';
import { systemRoleSeedMatrix } from '../../../database/seeds/seed-roles';
import type { AuthRole } from '../../../modules/auth/types/auth-role.types';
import type { PermissionCode } from '../../../modules/auth/types/auth-permission.types';
import type { AuthUserContext } from '../../../modules/auth/types/auth-user-context.types';
import {
  ACCESS_CONTROL_ACCOUNT_STATUS_FIXTURES,
  ACCESS_CONTROL_SESSION_STATE_FIXTURES,
  ACCESS_CONTROL_TENANT_SCOPE_FIXTURES,
} from './access-control-fixtures.constants';

export type AccessControlTestUserFixture = {
  role: AuthRole;
  userId: string;
  sessionId: string;
  phone: string;
  permissions: PermissionCode[];
  accountStatus: (typeof AUTH_ACCOUNT_STATUS)[keyof typeof AUTH_ACCOUNT_STATUS];
  vendorId: string | null;
  storeId: string | null;
  cityId: string | null;
  isSessionRevoked: boolean;
};

const rolePermissions = (role: AuthRole): PermissionCode[] => {
  const roleSeed = systemRoleSeedMatrix.find((item) => item.code === role);

  if (!roleSeed) {
    return [];
  }

  return [...roleSeed.permissions];
};

const buildTestUser = ({
  role,
  userId,
  sessionId,
  phone,
  vendorId = null,
  storeId = null,
  cityId = null,
  isSessionRevoked = false,
}: {
  role: AuthRole;
  userId: string;
  sessionId: string;
  phone: string;
  vendorId?: string | null;
  storeId?: string | null;
  cityId?: string | null;
  isSessionRevoked?: boolean;
}): AccessControlTestUserFixture => ({
  role,
  userId,
  sessionId,
  phone,
  permissions: rolePermissions(role),
  accountStatus: ACCESS_CONTROL_ACCOUNT_STATUS_FIXTURES.ACTIVE,
  vendorId,
  storeId,
  cityId,
  isSessionRevoked,
});

export const ACCESS_CONTROL_TEST_USERS: Record<AuthRole, AccessControlTestUserFixture> = {
  [AUTH_ROLE.CUSTOMER]: buildTestUser({
    role: AUTH_ROLE.CUSTOMER,
    userId: '65f1b1000000000000000001',
    sessionId: ACCESS_CONTROL_SESSION_STATE_FIXTURES.ACTIVE_SESSION_ID,
    phone: '9999999999',
  }),
  [AUTH_ROLE.DELIVERY_AGENT]: buildTestUser({
    role: AUTH_ROLE.DELIVERY_AGENT,
    userId: '65f1b1000000000000000002',
    sessionId: ACCESS_CONTROL_SESSION_STATE_FIXTURES.OTHER_SESSION_ID,
    phone: '8888888888',
    cityId: ACCESS_CONTROL_TENANT_SCOPE_FIXTURES.CITY_ID,
  }),
  [AUTH_ROLE.VENDOR_OWNER]: buildTestUser({
    role: AUTH_ROLE.VENDOR_OWNER,
    userId: '65f1b1000000000000000003',
    sessionId: ACCESS_CONTROL_SESSION_STATE_FIXTURES.ACTIVE_SESSION_ID,
    phone: '7777777777',
    vendorId: ACCESS_CONTROL_TENANT_SCOPE_FIXTURES.VENDOR_ID,
    storeId: ACCESS_CONTROL_TENANT_SCOPE_FIXTURES.STORE_ID,
    cityId: ACCESS_CONTROL_TENANT_SCOPE_FIXTURES.CITY_ID,
  }),
  [AUTH_ROLE.STORE_MANAGER]: buildTestUser({
    role: AUTH_ROLE.STORE_MANAGER,
    userId: '65f1b1000000000000000004',
    sessionId: ACCESS_CONTROL_SESSION_STATE_FIXTURES.OTHER_SESSION_ID,
    phone: '7777777701',
    vendorId: ACCESS_CONTROL_TENANT_SCOPE_FIXTURES.VENDOR_ID,
    storeId: ACCESS_CONTROL_TENANT_SCOPE_FIXTURES.STORE_ID,
    cityId: ACCESS_CONTROL_TENANT_SCOPE_FIXTURES.CITY_ID,
  }),
  [AUTH_ROLE.STORE_STAFF]: buildTestUser({
    role: AUTH_ROLE.STORE_STAFF,
    userId: '65f1b1000000000000000005',
    sessionId: ACCESS_CONTROL_SESSION_STATE_FIXTURES.ACTIVE_SESSION_ID,
    phone: '7777777702',
    vendorId: ACCESS_CONTROL_TENANT_SCOPE_FIXTURES.VENDOR_ID,
    storeId: ACCESS_CONTROL_TENANT_SCOPE_FIXTURES.STORE_ID,
    cityId: ACCESS_CONTROL_TENANT_SCOPE_FIXTURES.CITY_ID,
  }),
  [AUTH_ROLE.SUPPORT_ADMIN]: buildTestUser({
    role: AUTH_ROLE.SUPPORT_ADMIN,
    userId: '65f1b1000000000000000006',
    sessionId: ACCESS_CONTROL_SESSION_STATE_FIXTURES.OTHER_SESSION_ID,
    phone: '6666666601',
  }),
  [AUTH_ROLE.OPERATIONS_ADMIN]: buildTestUser({
    role: AUTH_ROLE.OPERATIONS_ADMIN,
    userId: '65f1b1000000000000000007',
    sessionId: ACCESS_CONTROL_SESSION_STATE_FIXTURES.ACTIVE_SESSION_ID,
    phone: '6666666602',
  }),
  [AUTH_ROLE.SUPER_ADMIN]: buildTestUser({
    role: AUTH_ROLE.SUPER_ADMIN,
    userId: '65f1b1000000000000000008',
    sessionId: ACCESS_CONTROL_SESSION_STATE_FIXTURES.ACTIVE_SESSION_ID,
    phone: '6666666666',
  }),
};

export const ACCESS_CONTROL_TEST_USER_ROLES = Object.values(AUTH_ROLE);

export const getAccessControlTestUser = (role: AuthRole): AccessControlTestUserFixture =>
  ACCESS_CONTROL_TEST_USERS[role];

export const createAuthUserContextFromFixture = (
  fixture: AccessControlTestUserFixture,
  overrides: Partial<AuthUserContext> = {},
): AuthUserContext => ({
  userId: fixture.userId,
  role: fixture.role,
  permissions: fixture.permissions,
  sessionId: fixture.sessionId,
  vendorId: fixture.vendorId,
  storeId: fixture.storeId,
  cityId: fixture.cityId,
  ...overrides,
});
