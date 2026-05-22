import type { Types } from 'mongoose';
import { findProductById } from '../../catalog/products/repositories/product.repository';
import { findInventoryStockByStoreProduct } from '../../inventory/repositories/inventory-stock.repository';
import { findStoreProductByStoreAndVariant } from '../../store-products/repositories/store-product.repository';
import { STORE_PRODUCT_STATUS } from '../../store-products/constants/store-product-status.constant';
import type { StoreProductRecord } from '../../store-products/models/store-product.model';
import {
  cartInsufficientStockError,
  cartProductUnavailableError,
} from './cart-error.mapper';

export type CartProductResolution = {
  storeProduct: StoreProductRecord & { _id: Types.ObjectId };
  productName: string;
  availableQuantity: number;
};

const isStoreProductAvailable = (
  storeProduct: StoreProductRecord & { _id: Types.ObjectId },
): boolean =>
  storeProduct.status === STORE_PRODUCT_STATUS.ACTIVE &&
  storeProduct.isAvailable &&
  storeProduct.isVisible &&
  !storeProduct.isDeleted;

export const resolveStoreProductForCart = async (
  storeId: string,
  variantId: string,
): Promise<CartProductResolution> => {
  const storeProduct = await findStoreProductByStoreAndVariant(storeId, variantId);

  if (!storeProduct || !isStoreProductAvailable(storeProduct)) {
    throw cartProductUnavailableError();
  }

  const product = await findProductById(storeProduct.productId.toString());

  if (!product || product.isDeleted || !product.isVisible || product.approvalStatus !== 'approved') {
    throw cartProductUnavailableError();
  }

  const stock = await findInventoryStockByStoreProduct(
    storeId,
    storeProduct._id.toString(),
  );

  const availableQuantity = stock?.availableQuantity ?? 0;

  return {
    storeProduct,
    productName: product.name,
    availableQuantity,
  };
};

export const assertStockAvailable = (availableQuantity: number, quantity: number): void => {
  if (availableQuantity < quantity) {
    throw cartInsufficientStockError({ availableQuantity, requestedQuantity: quantity });
  }
};
