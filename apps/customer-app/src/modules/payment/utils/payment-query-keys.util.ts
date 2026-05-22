export const paymentQueryKeys = {
  all: ['customer-payment'] as const,
  createOrder: (checkoutSessionId?: string) =>
    [...paymentQueryKeys.all, 'create-order', checkoutSessionId] as const,
};
