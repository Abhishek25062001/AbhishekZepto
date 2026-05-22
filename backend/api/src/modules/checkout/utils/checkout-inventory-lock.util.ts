import { INVENTORY_LOCK_TYPE } from '../../inventory/locks/constants/inventory-lock-type.constant';
import {
  createInventoryLock,
  releaseInventoryLock,
} from '../../inventory/locks/services/inventory-lock.service';
import { findInventoryStockByStoreProduct } from '../../inventory/repositories/inventory-stock.repository';
import type { CartRecord } from '../../cart/types/cart.types';
import { checkoutStockUnavailableError } from './checkout-error.mapper';

export const createCheckoutLocksForCart = async (input: {
  cart: CartRecord & { _id: { toString(): string } };
  customerId: string;
  storeId: string;
  reservationExpiresAt: Date;
  actorUserId: string;
}): Promise<string[]> => {
  const lockTokens: string[] = [];

  try {
    for (const item of input.cart.items) {
      const stock = await findInventoryStockByStoreProduct(
        input.storeId,
        item.storeProductId.toString(),
      );

      if (!stock) {
        throw checkoutStockUnavailableError({
          storeProductId: item.storeProductId.toString(),
        });
      }

      const lock = await createInventoryLock(
        {
          inventoryStockId: stock._id.toString(),
          storeProductId: item.storeProductId.toString(),
          quantity: item.quantity,
          lockType: INVENTORY_LOCK_TYPE.CHECKOUT,
          customerId: input.customerId,
          cartId: input.cart._id.toString(),
          expiresAt: input.reservationExpiresAt.toISOString(),
          metadata: { cartItemId: item._id?.toString() ?? null },
        },
        input.actorUserId,
      );

      lockTokens.push(lock.lockToken);
    }

    return lockTokens;
  } catch (error) {
    await releaseCheckoutLocks(lockTokens, 'checkout_initiate_rollback', input.actorUserId);
    throw error;
  }
};

export const releaseCheckoutLocks = async (
  lockTokens: string[],
  releaseReason: string,
  actorUserId: string,
): Promise<void> => {
  for (const lockToken of lockTokens) {
    try {
      await releaseInventoryLock(
        { lockToken, releaseReason },
        actorUserId,
        'backend',
      );
    } catch {
      // Best-effort release; expiry job may clean up remaining locks
    }
  }
};
