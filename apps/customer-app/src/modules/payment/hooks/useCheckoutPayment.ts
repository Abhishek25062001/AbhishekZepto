import { useCallback, useState } from 'react';

import { getActiveCheckoutSessionId } from '../../checkout/utils/checkout-session-storage.util';
import { openRazorpayCheckout } from '../services/razorpay-checkout.service';
import type { VerifyPaymentResponse } from '../types/payment.types';
import { getPaymentErrorMessage } from '../utils/customer-payment-error-message.util';
import { createPaymentIdempotencyKey } from '../utils/payment-idempotency.util';
import { useCreatePaymentOrder } from './useCreatePaymentOrder';
import { useVerifyPayment } from './useVerifyPayment';

export function useCheckoutPayment() {
  const createOrderMutation = useCreatePaymentOrder();
  const verifyMutation = useVerifyPayment();
  const [paymentResult, setPaymentResult] = useState<VerifyPaymentResponse | null>(null);
  const [error, setError] = useState<unknown>(null);

  const isProcessing = createOrderMutation.isPending || verifyMutation.isPending;

  const reset = useCallback(() => {
    setPaymentResult(null);
    setError(null);
    createOrderMutation.reset();
    verifyMutation.reset();
  }, [createOrderMutation, verifyMutation]);

  const pay = useCallback(async () => {
    const checkoutSessionId = getActiveCheckoutSessionId();

    if (!checkoutSessionId) {
      setError(new Error('No active checkout session'));
      return;
    }

    setError(null);
    setPaymentResult(null);

    const idempotencyKey = createPaymentIdempotencyKey();

    try {
      const order = await createOrderMutation.mutateAsync({
        checkoutSessionId,
        idempotencyKey,
      });

      const razorpaySuccess = await openRazorpayCheckout({
        keyId: order.keyId,
        razorpayOrderId: order.razorpayOrderId,
        amount: order.amount,
        currency: order.currency,
        description: 'Checkout payment',
      });

      const verified = await verifyMutation.mutateAsync({
        paymentId: order.paymentId,
        razorpayOrderId: razorpaySuccess.razorpay_order_id,
        razorpayPaymentId: razorpaySuccess.razorpay_payment_id,
        razorpaySignature: razorpaySuccess.razorpay_signature,
      });

      setPaymentResult(verified);
    } catch (payError: unknown) {
      setError(payError);
    }
  }, [createOrderMutation, verifyMutation]);

  const errorMessage = error
    ? getPaymentErrorMessage(error, 'Payment failed. Please try again.')
    : null;

  return {
    pay,
    reset,
    isProcessing,
    paymentResult,
    error,
    errorMessage,
    isSuccess: paymentResult?.status === 'paid',
  };
}
