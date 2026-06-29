import { env } from '../../config/env';

export const seedPaymentTestData = async (): Promise<void> => {
  if (env.APP_ENV === 'production') {
    return;
  }

  // Idempotent placeholder for local/dev payment test fixtures.
  // Orders and payments are created through checkout + payment flows in integration tests.
};
