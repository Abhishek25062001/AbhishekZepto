export const checkoutQueryKeys = {
  summary: (checkoutSessionId?: string) =>
    ['customer-checkout', 'summary', checkoutSessionId ?? 'active'] as const,
};
