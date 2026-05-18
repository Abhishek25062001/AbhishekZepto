import { AppError } from '../../../../errors/AppError';
import { ERROR_CODES, type ErrorCode } from '../../../../errors/error-codes';
import { HTTP_STATUS } from '../../../../utils/http-status';
import {
  PRODUCT_ERROR_CODES,
  type ProductErrorCode,
} from '../../products/constants/product-error-codes.constant';
import { findProductById } from '../../products/repositories/product.repository';

const productError = (code: ProductErrorCode): ErrorCode => ERROR_CODES[code];

export const assertProductExistsForVariant = async (productId: string) => {
  const product = await findProductById(productId);

  if (!product) {
    throw new AppError({
      message: 'Product not found',
      statusCode: HTTP_STATUS.NOT_FOUND,
      errorCode: productError(PRODUCT_ERROR_CODES.PRODUCT_NOT_FOUND),
    });
  }

  return product;
};
