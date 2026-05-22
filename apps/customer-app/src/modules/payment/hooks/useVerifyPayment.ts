import { useMutation } from '@tanstack/react-query';

import { verifyPayment } from '../api/customer-payment.api';
import type { VerifyPaymentInput } from '../types/payment.types';

export function useVerifyPayment() {
  return useMutation({
    mutationFn: (input: VerifyPaymentInput) => verifyPayment(input),
  });
}
