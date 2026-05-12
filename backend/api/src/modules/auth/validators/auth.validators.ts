import { z } from 'zod';

export const phoneValidator = z.string().min(10).max(15);

export const roleValidator = z.enum([
  'customer',
  'delivery_agent',
  'vendor_owner',
  'store_manager',
  'store_staff',
  'support_admin',
  'operations_admin',
  'super_admin',
]);

const otpValidator = z.string().min(4).max(8);

const refreshTokenBodyValidator = z.object({
  refreshToken: z.string().min(1),
});

export const requestOtpValidator = {
  body: z.object({
    phone: phoneValidator,
    role: roleValidator,
  }),
};

export const verifyOtpValidator = {
  body: z.object({
    phone: phoneValidator,
    role: roleValidator,
    otp: otpValidator,
  }),
};

export const refreshTokenValidator = {
  body: refreshTokenBodyValidator,
};

export const logoutValidator = {
  body: refreshTokenBodyValidator,
};
