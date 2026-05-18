import type { Request } from 'express';
import { AUTH_SCOPE_FIELD, AUTH_SCOPE_KIND } from '../constants/auth-scope.constants';
import { createScopeGuard } from './scope-guards.middleware';

export const requireStoreScope = (
  expectedStoreId?: string | ((request: Request) => string | null | undefined),
) =>
  createScopeGuard({
    kind: AUTH_SCOPE_KIND.STORE,
    field: AUTH_SCOPE_FIELD.STORE_ID,
    resolveExpectedValue: expectedStoreId,
  });
