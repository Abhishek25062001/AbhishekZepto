import { isDevelopment } from '../config/env';

type AdminAuthEventName =
  | 'request_otp_success'
  | 'request_otp_failure'
  | 'verify_otp_success'
  | 'verify_otp_failure'
  | 'session_restore_success'
  | 'session_restore_failure'
  | 'logout_success'
  | 'logout_failure';

type AuthEventMetadata = Record<string, string | number | boolean | null | undefined>;

const forbiddenMetadataKeys = new Set([
  'otp',
  'accessToken',
  'refreshToken',
  'authorization',
]);

export function logAdminAuthEvent(
  eventName: AdminAuthEventName,
  metadata: AuthEventMetadata = {},
) {
  if (!isDevelopment) {
    return;
  }

  const safeMetadata = Object.fromEntries(
    Object.entries(metadata).filter(([key]) => !forbiddenMetadataKeys.has(key)),
  );

  console.debug('Admin auth event', {
    eventName,
    metadata: safeMetadata,
  });
}
