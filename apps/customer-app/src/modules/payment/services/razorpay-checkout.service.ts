import RazorpayCheckout from 'react-native-razorpay';

import { RAZORPAY_KEY_ID } from '../../../config/env';
import type { OpenRazorpayCheckoutInput, RazorpayCheckoutSuccess } from '../types/payment.types';
import { PaymentCancelledError } from '../utils/customer-payment-error-message.util';

const resolveKeyId = (keyId: string): string => keyId || RAZORPAY_KEY_ID;

export const openRazorpayCheckout = async (
  input: OpenRazorpayCheckoutInput,
): Promise<RazorpayCheckoutSuccess> => {
  const key = resolveKeyId(input.keyId);

  if (!key) {
    throw new Error('Razorpay key is not configured');
  }

  try {
    const data = await RazorpayCheckout.open({
      key,
      amount: input.amount,
      currency: input.currency,
      order_id: input.razorpayOrderId,
      name: input.name ?? 'Zepto-like',
      description: input.description ?? 'Order payment',
    });

    return {
      razorpay_payment_id: data.razorpay_payment_id,
      razorpay_order_id: data.razorpay_order_id,
      razorpay_signature: data.razorpay_signature,
    };
  } catch (error: unknown) {
    const razorpayError = error as { code?: number; description?: string };

    if (razorpayError.code === 0 || razorpayError.code === 2) {
      throw new PaymentCancelledError();
    }

    throw error;
  }
};
