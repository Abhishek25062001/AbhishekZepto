export const PROFILE_ERROR_CODES = {
  PROFILE_VALIDATION_FAILED: 'PROFILE_VALIDATION_FAILED',
} as const;

export type ProfileErrorCode =
  (typeof PROFILE_ERROR_CODES)[keyof typeof PROFILE_ERROR_CODES];
