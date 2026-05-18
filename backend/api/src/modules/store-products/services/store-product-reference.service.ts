import { Types } from 'mongoose';
import { AppError } from '../../../errors/AppError';
import { ERROR_CODES, type ErrorCode } from '../../../errors/error-codes';
import { HTTP_STATUS } from '../../../utils/http-status';
import { PRODUCT_APPROVAL_STATUS } from '../../catalog/products/constants/product-approval-status.constant';
import { findProductById } from '../../catalog/products/repositories/product.repository';
import { findProductVariantByProductAndId } from '../../catalog/variants/repositories/product-variant.repository';
import { STORE_STATUS } from '../../stores/constants/store-status.constant';
import { findStoreById } from '../../stores/repositories/store.repository';
import {
  STORE_PRODUCT_ERROR_CODES,
  type StoreProductErrorCode,
} from '../constants/store-product-error-codes.constant';

const storeProductError = (code: StoreProductErrorCode): ErrorCode => ERROR_CODES[code];

export type StoreProductReferenceContext = {
  store: NonNullable<Awaited<ReturnType<typeof findStoreById>>>;
  product: NonNullable<Awaited<ReturnType<typeof findProductById>>>;
  variant: NonNullable<Awaited<ReturnType<typeof findProductVariantByProductAndId>>>;
  denormalized: {
    vendorId: Types.ObjectId;
    cityId: Types.ObjectId;
    categoryId: Types.ObjectId;
    brandId: Types.ObjectId | null;
    sku: string;
    taxCategoryId: Types.ObjectId | null;
  };
};

export const assertStoreProductReferences = async (
  storeId: string,
  productId: string,
  variantId: string,
): Promise<StoreProductReferenceContext> => {
  const store = await findStoreById(storeId);

  if (!store) {
    throw new AppError({
      message: 'Store not found or inactive',
      statusCode: HTTP_STATUS.BAD_REQUEST,
      errorCode: storeProductError(STORE_PRODUCT_ERROR_CODES.INVALID_STORE_PRODUCT_STORE),
    });
  }

  if (store.status !== STORE_STATUS.ACTIVE) {
    throw new AppError({
      message: 'Store is not active',
      statusCode: HTTP_STATUS.BAD_REQUEST,
      errorCode: storeProductError(STORE_PRODUCT_ERROR_CODES.INVALID_STORE_PRODUCT_STORE),
    });
  }

  const product = await findProductById(productId);

  if (!product) {
    throw new AppError({
      message: 'Product not found',
      statusCode: HTTP_STATUS.BAD_REQUEST,
      errorCode: storeProductError(STORE_PRODUCT_ERROR_CODES.INVALID_STORE_PRODUCT_PRODUCT),
    });
  }

  if (product.approvalStatus !== PRODUCT_APPROVAL_STATUS.APPROVED) {
    throw new AppError({
      message: 'Product is not approved',
      statusCode: HTTP_STATUS.BAD_REQUEST,
      errorCode: storeProductError(STORE_PRODUCT_ERROR_CODES.INVALID_STORE_PRODUCT_PRODUCT),
    });
  }

  if (!product.isVisible || product.status !== 'active') {
    throw new AppError({
      message: 'Product is not visible or active',
      statusCode: HTTP_STATUS.BAD_REQUEST,
      errorCode: storeProductError(STORE_PRODUCT_ERROR_CODES.INVALID_STORE_PRODUCT_PRODUCT),
    });
  }

  const variant = await findProductVariantByProductAndId(productId, variantId);

  if (!variant) {
    throw new AppError({
      message: 'Variant not found for product',
      statusCode: HTTP_STATUS.BAD_REQUEST,
      errorCode: storeProductError(STORE_PRODUCT_ERROR_CODES.STORE_PRODUCT_VARIANT_MISMATCH),
    });
  }

  if (!variant.isVisible || variant.status !== 'active') {
    throw new AppError({
      message: 'Variant is not visible or active',
      statusCode: HTTP_STATUS.BAD_REQUEST,
      errorCode: storeProductError(STORE_PRODUCT_ERROR_CODES.INVALID_STORE_PRODUCT_VARIANT),
    });
  }

  return {
    store,
    product,
    variant,
    denormalized: {
      vendorId: store.vendorId,
      cityId: store.cityId,
      categoryId: product.categoryId,
      brandId: product.brandId,
      sku: variant.sku,
      taxCategoryId: product.taxCategoryId,
    },
  };
};
