import { env } from '../../../config/env';
import { logger } from '../../../config/logger';
import type { OtpDeliveryChannel } from '../types/otp.types';
import { maskOtpTarget } from './otp.service';

export type SendOtpInput = {
  phone: string;
  otp: string;
  deliveryChannel: OtpDeliveryChannel;
  requestId?: string;
  traceId?: string;
};

export const sendOtp = async ({
  phone,
  otp,
  deliveryChannel,
  requestId,
  traceId,
}: SendOtpInput): Promise<void> => {
  if (env.APP_ENV === 'production') {
    throw new Error('Production OTP provider integration is not configured yet');
  }

  logger.info(
    {
      deliveryChannel,
      maskedTarget: maskOtpTarget(phone),
      otpMode: env.OTP_DEV_CODE ? 'configured_dev_code' : 'generated_dev_code',
      requestId,
      traceId,
    },
    'Development OTP dispatched',
  );
  void otp;
};
