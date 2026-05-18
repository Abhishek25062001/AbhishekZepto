import { z } from 'zod';
import {
  AUTH_APP_SURFACE,
  AUTH_DEVICE_TYPE,
  OTP_DELIVERY_CHANNEL,
  OTP_PURPOSE,
} from '../constants/auth-otp.constants';

export const phoneValidator = z.string().regex(/^\d{10,15}$/);

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
const challengeIdValidator = z.string().regex(/^[a-fA-F0-9]{24}$/);
const sessionIdValidator = z.string().regex(/^[a-fA-F0-9]{24}$/);

const refreshTokenBodyValidator = z.object({
  refreshToken: z.string().min(1),
});

const deviceValidator = z.object({
  deviceId: z.string().min(1).optional(),
  deviceType: z.enum([
    AUTH_DEVICE_TYPE.ANDROID,
    AUTH_DEVICE_TYPE.IOS,
    AUTH_DEVICE_TYPE.WEB,
    AUTH_DEVICE_TYPE.UNKNOWN,
  ]),
  appSurface: z.enum([
    AUTH_APP_SURFACE.CUSTOMER_APP,
    AUTH_APP_SURFACE.DELIVERY_AGENT_APP,
    AUTH_APP_SURFACE.VENDOR_PANEL,
    AUTH_APP_SURFACE.ADMIN_DASHBOARD,
  ]),
  appVersion: z.string().min(1).optional(),
});

export const requestOtpValidator = {
  body: z.object({
    phone: phoneValidator,
    role: roleValidator,
    purpose: z
      .enum([OTP_PURPOSE.LOGIN, OTP_PURPOSE.SIGNUP, OTP_PURPOSE.REAUTH])
      .default(OTP_PURPOSE.LOGIN)
      .optional(),
    deliveryChannel: z
      .enum([
        OTP_DELIVERY_CHANNEL.SMS,
        OTP_DELIVERY_CHANNEL.WHATSAPP,
        OTP_DELIVERY_CHANNEL.EMAIL,
      ])
      .default(OTP_DELIVERY_CHANNEL.SMS)
      .optional(),
  }),
};

export const verifyOtpValidator = {
  body: z.object({
    phone: phoneValidator,
    role: roleValidator,
    otp: otpValidator,
    challengeId: challengeIdValidator,
    device: deviceValidator,
  }),
};

export const refreshTokenValidator = {
  body: refreshTokenBodyValidator,
};

export const logoutValidator = {
  body: refreshTokenBodyValidator.extend({
    logoutAllDevices: z.boolean().optional(),
  }),
};

export const logoutSessionValidator = {
  body: z.object({
    sessionId: sessionIdValidator,
  }),
};

export const logoutOtherSessionsValidator = {
  body: z
    .object({
      currentSessionId: sessionIdValidator.optional(),
    })
    .optional()
    .default({}),
};
