import type { PermissionCode } from '../../../modules/auth/types/auth-permission.types';
import type { AuthRole } from '../../../modules/auth/types/auth-role.types';
import type { AuthUserContext } from '../../../modules/auth/types/auth-user-context.types';
import {
  createAuthUserContextFromFixture,
  getAccessControlTestUser,
  type AccessControlTestUserFixture,
} from '../fixtures/access-control-test-users.fixture';

export type AccessControlMockRequest = {
  body?: Record<string, unknown>;
  params?: Record<string, string>;
  query?: Record<string, string>;
  headers?: Record<string, string>;
  requestId?: string;
  traceId?: string;
  ip?: string;
  user?: AuthUserContext;
  header?: (name: string) => string | undefined;
  get?: (header: string) => string | undefined;
};

export const createMockAuthContext = ({
  role,
  permissions,
  userId,
  sessionId,
  vendorId = null,
  storeId = null,
  cityId = null,
}: {
  role: AuthRole;
  permissions: PermissionCode[];
  userId?: string;
  sessionId?: string;
  vendorId?: string | null;
  storeId?: string | null;
  cityId?: string | null;
}): AuthUserContext => {
  const fixture = getAccessControlTestUser(role);

  return createAuthUserContextFromFixture(fixture, {
    userId: userId ?? fixture.userId,
    sessionId: sessionId ?? fixture.sessionId,
    permissions,
    vendorId,
    storeId,
    cityId,
  });
};

export const createMockAuthenticatedRequest = (
  fixture: AccessControlTestUserFixture,
  overrides: Partial<AccessControlMockRequest> = {},
): AccessControlMockRequest => ({
  requestId: 'access-control-test-request',
  traceId: 'access-control-test-trace',
  headers: {
    authorization: `Bearer access-control-test-token-${fixture.role}`,
  },
  user: createAuthUserContextFromFixture(fixture),
  ...overrides,
});

export const createBearerAuthorizationHeader = (accessToken: string) => ({
  Authorization: `Bearer ${accessToken}`,
});
