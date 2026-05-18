import {
  AUTH_SCOPE_FIELD,
  AUTH_SCOPE_KIND,
} from '../constants/auth-scope.constants';

export type AuthScopeKind =
  (typeof AUTH_SCOPE_KIND)[keyof typeof AUTH_SCOPE_KIND];

export type AuthScopeField =
  (typeof AUTH_SCOPE_FIELD)[keyof typeof AUTH_SCOPE_FIELD];

export type AuthScopeContext = {
  vendorId?: string | null;
  storeId?: string | null;
  cityId?: string | null;
};

export type ResolvedAuthScope = {
  vendorId: string | null;
  storeId: string | null;
  cityId: string | null;
};

export type ScopedAuthUserContext = ResolvedAuthScope;

export type AuthScopeRequirement = {
  kind: AuthScopeKind;
  field: AuthScopeField;
};
