import { useMutation } from '@tanstack/react-query';

import { createPaymentOrder } from '../api/customer-payment.api';
import type { CreatePaymentOrderInput } from '../types/payment.types';
import { createPaymentIdempotencyKey } from '../utils/payment-idempotency.util';

export function useCreatePaymentOrder() {
  return useMutation({
    mutationFn: (input: Omit<CreatePaymentOrderInput, 'idempotencyKey'> & { idempotencyKey?: string }) =>
      createPaymentOrder({
        checkoutSessionId: input.checkoutSessionId,
        idempotencyKey: input.idempotencyKey ?? createPaymentIdempotencyKey(),
      }),
  });
}
