import { env } from '../config/env';
import { logger } from '../config/logger';
import { expireDueCheckoutSessions } from '../modules/checkout/services/checkout-expiry.service';

let intervalHandle: NodeJS.Timeout | null = null;

export const startCheckoutSessionExpiryJob = (): void => {
  if (!env.CHECKOUT_RESERVATION_CRON_ENABLED) {
    return;
  }

  const intervalMs = env.INVENTORY_LOCK_EXPIRY_JOB_INTERVAL_SECONDS * 1000;

  const run = () => {
    void expireDueCheckoutSessions('system').catch((error) => {
      logger.warn(
        {
          error: error instanceof Error ? error.message : 'Unknown error',
        },
        'Checkout session expiry job failed',
      );
    });
  };

  run();
  intervalHandle = setInterval(run, intervalMs);
};

export const stopCheckoutSessionExpiryJob = (): void => {
  if (intervalHandle) {
    clearInterval(intervalHandle);
    intervalHandle = null;
  }
};
