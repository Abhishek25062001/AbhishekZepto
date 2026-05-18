import { z } from 'zod';

export const loginPhoneSchema = z.object({
  phone: z
    .string()
    .trim()
    .min(10, 'Phone number must be at least 10 digits.')
    .max(15, 'Phone number must be at most 15 digits.')
    .regex(/^\d+$/, 'Phone number must contain only digits.'),
});

export type LoginPhoneFormValues = z.infer<typeof loginPhoneSchema>;

export const otpSchema = z.object({
  otp: z
    .string()
    .trim()
    .min(4, 'OTP must be at least 4 digits.')
    .max(8, 'OTP must be at most 8 digits.'),
});

export type OtpFormValues = z.infer<typeof otpSchema>;
