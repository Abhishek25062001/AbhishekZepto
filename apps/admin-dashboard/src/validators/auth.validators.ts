import { z } from 'zod';

export const loginIdentifierSchema = z.object({
  identifier: z
    .string()
    .regex(/^\d{10,15}$/, 'Enter a valid phone number.'),
});

export type LoginIdentifierFormValues = z.infer<typeof loginIdentifierSchema>;

export const otpSchema = z.object({
  otp: z
    .string()
    .trim()
    .regex(/^\d{4,8}$/, 'Enter a valid OTP code.'),
});

export type OtpFormValues = z.infer<typeof otpSchema>;
