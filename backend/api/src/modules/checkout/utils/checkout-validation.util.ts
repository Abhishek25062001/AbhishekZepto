import type { CartRecord } from '../../cart/types/cart.types';
import { findInventoryStockByStoreProduct } from '../../inventory/repositories/inventory-stock.repository';
import { findStoreById } from '../../stores/repositories/store.repository';
import { isStoreServiceableForCoordinates } from '../../customer-addresses/services/store-serviceability.service';
import type { CustomerAddressRecord } from '../../customer-addresses/models/customer-address.model';
import {
  calculateCartPricing,
  detectCartPriceDriftForStore,
} from '../../pricing/services/cart-pricing.service';
import {
  checkoutAddressUnserviceableError,
  checkoutCartEmptyError,
  checkoutPriceChangedError,
  checkoutStockUnavailableError,
  checkoutStoreClosedError,
} from './checkout-error.mapper';

export const assertCartReadyForCheckout = (cart: CartRecord): void => {
  if (!cart.items.length) {
    throw checkoutCartEmptyError();
  }
};

export const assertStoreOpenForCheckout = async (storeId: string): Promise<void> => {
  const store = await findStoreById(storeId);

  if (
    !store ||
    store.status !== 'active' ||
    !store.isOpen ||
    !store.isAcceptingOrders ||
    store.isDeleted
  ) {
    throw checkoutStoreClosedError();
  }
};

export const assertAddressServiceableForStore = async (
  storeId: string,
  address: CustomerAddressRecord,
): Promise<void> => {
  const serviceable = await isStoreServiceableForCoordinates({
    storeId,
    latitude: address.latitude,
    longitude: address.longitude,
  });

  if (!serviceable) {
    throw checkoutAddressUnserviceableError();
  }
};

export const assertCartPricingCurrentForCheckout = async (
  cart: CartRecord,
  storeId: string,
): Promise<void> => {
  const drift = await detectCartPriceDriftForStore(cart, storeId);

  if (drift.hasDrift) {
    throw checkoutPriceChangedError(drift.changedItems);
  }

  calculateCartPricing(cart);
};

export const assertCartStockAvailableForCheckout = async (
  cart: CartRecord,
  storeId: string,
): Promise<void> => {
  for (const item of cart.items) {
    const stock = await findInventoryStockByStoreProduct(
      storeId,
      item.storeProductId.toString(),
    );

    const availableQuantity = stock?.availableQuantity ?? 0;

    if (availableQuantity < item.quantity) {
      throw checkoutStockUnavailableError({
        storeProductId: item.storeProductId.toString(),
        availableQuantity,
        requestedQuantity: item.quantity,
      });
    }
  }
};
