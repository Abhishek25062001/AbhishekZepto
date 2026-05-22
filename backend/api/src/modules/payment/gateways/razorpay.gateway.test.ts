import assert from 'node:assert/strict';
import { test } from 'node:test';
import { AppError } from '../../../errors/AppError';
import { ERROR_CODES } from '../../../errors/error-codes';
import * as envModule from '../../../config/env';
import * as gatewayModule from './razorpay.gateway';

const envConfig = envModule as unknown as {
  getRazorpayKeyId: typeof envModule.getRazorpayKeyId;
  getRazorpayKeySecret: typeof envModule.getRazorpayKeySecret;
};

const gateway = gatewayModule as unknown as {
  createRazorpayOrder: typeof gatewayModule.createRazorpayOrder;
};

test('createRazorpayOrder maps gateway failures to PAYMENT_GATEWAY_ERROR', async () => {
  const originalKeyId = envConfig.getRazorpayKeyId;
  const originalKeySecret = envConfig.getRazorpayKeySecret;

  envConfig.getRazorpayKeyId = () => 'rzp_test_invalid';
  envConfig.getRazorpayKeySecret = () => 'invalid_secret';

  try {
    await assert.rejects(
      () =>
        gateway.createRazorpayOrder({
          amountPaise: 10000,
          currency: 'INR',
          receipt: 'receipt_1',
        }),
      (error: unknown) => {
        assert.ok(error instanceof AppError);
        assert.equal(error.errorCode, ERROR_CODES.PAYMENT_GATEWAY_ERROR);
        return true;
      },
    );
  } finally {
    envConfig.getRazorpayKeyId = originalKeyId;
    envConfig.getRazorpayKeySecret = originalKeySecret;
  }
});
