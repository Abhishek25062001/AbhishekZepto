import type { NextFunction, Request, Response } from 'express';
import { getRazorpayWebhookSecret } from '../../../config/env';
import { AppError } from '../../../errors/AppError';
import { ERROR_CODES } from '../../../errors/error-codes';
import { HTTP_STATUS } from '../../../utils/http-status';
import { verifyRazorpayWebhookSignature } from '../utils/razorpay-signature.util';

export type RequestWithRawBody = Request & { rawBody?: Buffer };

export const razorpayWebhookSignatureMiddleware = (
  req: RequestWithRawBody,
  res: Response,
  next: NextFunction,
): void => {
  const signature = req.header('x-razorpay-signature');

  if (!signature || !req.rawBody) {
    next(
      new AppError({
        message: 'Invalid webhook signature',
        statusCode: HTTP_STATUS.UNAUTHORIZED,
        errorCode: ERROR_CODES.UNAUTHORIZED,
      }),
    );
    return;
  }

  const isValid = verifyRazorpayWebhookSignature({
    rawBody: req.rawBody,
    signature,
    webhookSecret: getRazorpayWebhookSecret(),
  });

  if (!isValid) {
    next(
      new AppError({
        message: 'Invalid webhook signature',
        statusCode: HTTP_STATUS.UNAUTHORIZED,
        errorCode: ERROR_CODES.UNAUTHORIZED,
      }),
    );
    return;
  }

  next();
};
