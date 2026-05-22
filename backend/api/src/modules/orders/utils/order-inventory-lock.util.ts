import { confirmInventoryLock } from '../../inventory/locks/services/inventory-lock.service';

export const confirmCheckoutLocksForOrder = async (input: {
  lockTokens: string[];
  orderId: string;
  actorUserId: string;
}): Promise<void> => {
  for (const lockToken of input.lockTokens) {
    await confirmInventoryLock(
      {
        lockToken,
        confirmationReason: 'order_placed',
        orderId: input.orderId,
      },
      input.actorUserId,
      'backend',
    );
  }
};
