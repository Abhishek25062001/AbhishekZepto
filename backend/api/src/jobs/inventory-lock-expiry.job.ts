import { env } from '../config/env';
import { logger } from '../config/logger';
import { expireDueInventoryLocks } from '../modules/inventory/locks/services/inventory-lock.service';

let intervalHandle: NodeJS.Timeout | null = null;

export const startInventoryLockExpiryJob = (): void => {
  if (!env.INVENTORY_LOCK_EXPIRY_JOB_ENABLED) {
    return;
  }

  const intervalMs = env.INVENTORY_LOCK_EXPIRY_JOB_INTERVAL_SECONDS * 1000;

  const run = () => {
    void expireDueInventoryLocks('system', 'backend').catch((error) => {
      logger.warn(
        {
          error: error instanceof Error ? error.message : 'Unknown error',
        },
        'Inventory lock expiry job failed',
      );
    });
  };

  run();
  intervalHandle = setInterval(run, intervalMs);
};

export const stopInventoryLockExpiryJob = (): void => {
  if (intervalHandle) {
    clearInterval(intervalHandle);
    intervalHandle = null;
  }
};
