import {
  AUTH_SCOPE_FIELD,
  AUTH_SCOPE_KIND,
} from '../constants/auth-scope.constants';
import type {
  AuthScopeContext,
  AuthScopeField,
  AuthScopeKind,
  AuthScopeRequirement,
} from '../types/auth-scope.types';

const hasScopeValue = (value?: string | null): value is string => {
  return typeof value === 'string' && value.trim().length > 0;
};

export const hasVendorScope = (scope: AuthScopeContext): boolean => {
  return hasScopeValue(scope.vendorId);
};

export const hasStoreScope = (scope: AuthScopeContext): boolean => {
  return hasScopeValue(scope.storeId);
};

export const hasCityScope = (scope: AuthScopeContext): boolean => {
  return hasScopeValue(scope.cityId);
};

export const hasRequiredScope = ({
  kind,
  scope,
}: {
  kind: AuthScopeKind;
  scope: AuthScopeContext;
}): boolean => {
  if (kind === AUTH_SCOPE_KIND.VENDOR) {
    return hasVendorScope(scope);
  }

  if (kind === AUTH_SCOPE_KIND.STORE) {
    return hasStoreScope(scope);
  }

  return hasCityScope(scope);
};

export const getScopeValue = ({
  field,
  scope,
}: {
  field: AuthScopeField;
  scope: AuthScopeContext;
}): string | null => {
  if (field === AUTH_SCOPE_FIELD.VENDOR_ID) {
    return scope.vendorId ?? null;
  }

  if (field === AUTH_SCOPE_FIELD.STORE_ID) {
    return scope.storeId ?? null;
  }

  return scope.cityId ?? null;
};

export const matchesScopeValue = ({
  actualValue,
  expectedValue,
}: {
  actualValue?: string | null;
  expectedValue?: string | null;
}): boolean => {
  if (!hasScopeValue(actualValue) || !hasScopeValue(expectedValue)) {
    return false;
  }

  return actualValue === expectedValue;
};

export const matchesRequiredScope = ({
  requirement,
  actualScope,
  expectedScope,
}: {
  requirement: AuthScopeRequirement;
  actualScope: AuthScopeContext;
  expectedScope: AuthScopeContext;
}): boolean => {
  return matchesScopeValue({
    actualValue: getScopeValue({
      field: requirement.field,
      scope: actualScope,
    }),
    expectedValue: getScopeValue({
      field: requirement.field,
      scope: expectedScope,
    }),
  });
};
