import Razorpay from 'razorpay';
import { getRazorpayKeyId, getRazorpayKeySecret } from '../../../config/env';
import { paymentGatewayError } from '../utils/payment-error.mapper';
import type {
  RazorpayCreateOrderInput,
  RazorpayCreateOrderResult,
} from '../types/razorpay-gateway.types';

const buildRazorpayClient = (): Razorpay =>
  new Razorpay({
    key_id: getRazorpayKeyId(),
    key_secret: getRazorpayKeySecret(),
  });

export const createRazorpayOrder = async (
  input: RazorpayCreateOrderInput,
): Promise<RazorpayCreateOrderResult> => {
  try {
    const client = buildRazorpayClient();
    const order = await client.orders.create({
      amount: input.amountPaise,
      currency: input.currency,
      receipt: input.receipt,
      notes: input.notes,
    });

    return {
      id: order.id,
      amount: Number(order.amount),
      currency: order.currency,
    };
  } catch (error) {
    throw paymentGatewayError({
      message: error instanceof Error ? error.message : 'Unknown Razorpay error',
    });
  }
};

export const getRazorpayPublicKeyId = (): string => getRazorpayKeyId();
