import crypto from 'node:crypto';
import { env } from '../../../config/env';

const OTP_LENGTH = 6;

export const generateOtp = (): string => {
  if (env.OTP_DEV_CODE) {
    return env.OTP_DEV_CODE;
  }

  return crypto.randomInt(0, 10 ** OTP_LENGTH).toString().padStart(OTP_LENGTH, '0');
};

export const hashOtp = (otp: string): string => {
  return crypto.createHash('sha256').update(otp).digest('hex');
};

export const verifyOtpHash = ({
  otp,
  otpHash,
}: {
  otp: string;
  otpHash: string;
}): boolean => {
  const incomingHash = hashOtp(otp);

  return crypto.timingSafeEqual(
    Buffer.from(incomingHash, 'utf8'),
    Buffer.from(otpHash, 'utf8'),
  );
};

export const maskOtpTarget = (value: string): string => {
  if (value.length <= 4) {
    return value;
  }

  const visibleSuffix = value.slice(-4);
  return `${'*'.repeat(Math.max(value.length - 4, 0))}${visibleSuffix}`;
};

export const getOtpExpiryDate = (): Date => {
  return new Date(Date.now() + env.OTP_EXPIRES_IN_SECONDS * 1000);
};

export const getOtpBlockUntilDate = (): Date => {
  return getOtpExpiryDate();
};

export const hasOtpExpired = (expiresAt: Date): boolean => {
  return expiresAt.getTime() <= Date.now();
};

export const isOtpBlocked = (blockedUntil: Date | null): boolean => {
  return Boolean(blockedUntil && blockedUntil.getTime() > Date.now());
};

export const hasExceededOtpAttempts = ({
  attemptCount,
  maxAttempts,
}: {
  attemptCount: number;
  maxAttempts: number;
}): boolean => {
  return attemptCount >= maxAttempts;
};

export const hasExceededOtpResends = ({
  resendCount,
  maxResends,
}: {
  resendCount: number;
  maxResends: number;
}): boolean => {
  return resendCount >= maxResends;
};

export const canResendOtpAt = (lastSentAt: Date): Date => {
  return new Date(lastSentAt.getTime() + env.OTP_RESEND_INTERVAL_SECONDS * 1000);
};

export const isOtpResendLocked = (lastSentAt: Date): boolean => {
  return canResendOtpAt(lastSentAt).getTime() > Date.now();
};
