import type { AuthErrorCode } from './auth-api.types';

const defaultAuthErrorMessage =
  'We could not complete that request. Please try again.';

const authErrorMessages: Record<AuthErrorCode, string> = {
  USER_NOT_FOUND: 'We could not find an account for that phone number.',
  ACCOUNT_BLOCKED: 'This account is blocked. Please contact support.',
  ACCOUNT_INACTIVE: 'This account is inactive right now.',
  ACCOUNT_PENDING_APPROVAL: 'This account is waiting for approval.',
  RATE_LIMITED: 'Please wait a moment before trying again.',
  INVALID_OTP: 'That OTP code is not valid.',
  OTP_EXPIRED: 'That OTP code has expired. Please request a new one.',
  OTP_ATTEMPTS_EXCEEDED: 'You have reached the OTP attempt limit.',
  OTP_RESEND_LIMIT_EXCEEDED: 'You have reached the OTP resend limit.',
  INVALID_REFRESH_TOKEN: 'Your session could not be refreshed. Please log in again.',
  INVALID_ACCESS_TOKEN: 'Your session token is invalid. Please log in again.',
  TOKEN_EXPIRED: 'Your session has expired. Please log in again.',
  SESSION_REVOKED: 'Your session is no longer active. Please log in again.',
  SESSION_EXPIRED: 'Your session has expired. Please log in again.',
  SESSION_NOT_FOUND: 'That session could not be found.',
  SESSION_ACCESS_DENIED: 'That session action is not allowed.',
  ROLE_NOT_ALLOWED: 'This account cannot be used in this app.',
  VALIDATION_ERROR: 'Please check the details you entered and try again.',
};

export const getAuthErrorMessage = (
  errorCode?: string,
  fallbackMessage?: string,
): string => {
  if (!errorCode) {
    return fallbackMessage ?? defaultAuthErrorMessage;
  }

  return (
    authErrorMessages[errorCode as AuthErrorCode] ??
    fallbackMessage ??
    defaultAuthErrorMessage
  );
};
