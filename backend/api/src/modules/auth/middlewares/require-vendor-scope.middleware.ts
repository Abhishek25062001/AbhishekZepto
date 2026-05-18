import type { Request } from 'express';
import { AUTH_SCOPE_FIELD, AUTH_SCOPE_KIND } from '../constants/auth-scope.constants';
import { createScopeGuard } from './scope-guards.middleware';

export const requireVendorScope = (
  expectedVendorId?: string | ((request: Request) => string | null | undefined),
) =>
  createScopeGuard({
    kind: AUTH_SCOPE_KIND.VENDOR,
    field: AUTH_SCOPE_FIELD.VENDOR_ID,
    resolveExpectedValue: expectedVendorId,
  });
