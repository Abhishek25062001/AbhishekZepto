import { AUTH_ACCOUNT_STATUS } from '../constants/auth-status.constants';

export type AuthAccountStatus =
  (typeof AUTH_ACCOUNT_STATUS)[keyof typeof AUTH_ACCOUNT_STATUS];
