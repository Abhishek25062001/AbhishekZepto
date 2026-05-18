import { AppError } from '../../../errors/AppError';
import { ERROR_CODES } from '../../../errors/error-codes';
import { HTTP_STATUS } from '../../../utils/http-status';
import { STORE_PRODUCT_DISCOUNT_TYPE } from '../constants/store-product-discount-type.constant';
import { STORE_PRODUCT_ERROR_CODES } from '../constants/store-product-error-codes.constant';
import type { StoreProductDiscountType } from '../constants/store-product-discount-type.constant';

export const calculateFinalPrice = (
  mrp: number,
  sellingPrice: number,
  discountType: StoreProductDiscountType,
  discountValue: number,
): number => {
  if (sellingPrice > mrp) {
    throw new AppError({
      message: 'Selling price cannot exceed MRP',
      statusCode: HTTP_STATUS.UNPROCESSABLE_ENTITY,
      errorCode: ERROR_CODES[STORE_PRODUCT_ERROR_CODES.STORE_PRODUCT_PRICE_INVALID],
    });
  }

  if (
    discountType === STORE_PRODUCT_DISCOUNT_TYPE.PERCENTAGE &&
    discountValue > 100
  ) {
    throw new AppError({
      message: 'Percentage discount cannot exceed 100',
      statusCode: HTTP_STATUS.UNPROCESSABLE_ENTITY,
      errorCode: ERROR_CODES[STORE_PRODUCT_ERROR_CODES.STORE_PRODUCT_PRICE_INVALID],
    });
  }

  let finalPrice = sellingPrice;

  if (discountType === STORE_PRODUCT_DISCOUNT_TYPE.FLAT) {
    finalPrice = sellingPrice - discountValue;
  } else if (discountType === STORE_PRODUCT_DISCOUNT_TYPE.PERCENTAGE) {
    finalPrice = sellingPrice * (1 - discountValue / 100);
  }

  if (finalPrice < 0 || finalPrice > mrp) {
    throw new AppError({
      message: 'Final price must be between 0 and MRP',
      statusCode: HTTP_STATUS.UNPROCESSABLE_ENTITY,
      errorCode: ERROR_CODES[STORE_PRODUCT_ERROR_CODES.STORE_PRODUCT_FINAL_PRICE_INVALID],
    });
  }

  return Math.round(finalPrice * 100) / 100;
};
