const MAX_IDEMPOTENCY_KEY_LENGTH = 128;

export const createPaymentIdempotencyKey = (): string => {
  const cryptoApi = globalThis.crypto;

  if (cryptoApi && typeof cryptoApi.randomUUID === 'function') {
    return cryptoApi.randomUUID();
  }

  return `pay_${Date.now()}_${Math.random().toString(36).slice(2, 12)}`;
};

export const isValidPaymentIdempotencyKey = (key: string): boolean =>
  key.length > 0 && key.length <= MAX_IDEMPOTENCY_KEY_LENGTH;
