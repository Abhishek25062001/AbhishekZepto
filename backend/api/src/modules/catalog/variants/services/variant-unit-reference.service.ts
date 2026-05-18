import { AppError } from '../../../../errors/AppError';
import { ERROR_CODES, type ErrorCode } from '../../../../errors/error-codes';
import { HTTP_STATUS } from '../../../../utils/http-status';
import { findProductUnitByCode } from '../../units/repositories/product-unit.repository';
import {
  VARIANT_ERROR_CODES,
  type VariantErrorCode,
} from '../constants/variant-error-codes.constant';

const variantError = (code: VariantErrorCode): ErrorCode => ERROR_CODES[code];

export const assertVariantUnitIsValid = async (unit: string) => {
  const normalizedUnit = unit.trim().toLowerCase();
  const productUnit = await findProductUnitByCode(normalizedUnit);

  if (!productUnit || productUnit.status !== 'active' || productUnit.isDeleted) {
    throw new AppError({
      message: 'Invalid product unit',
      statusCode: HTTP_STATUS.UNPROCESSABLE_ENTITY,
      errorCode: variantError(VARIANT_ERROR_CODES.INVALID_VARIANT_UNIT),
    });
  }

  return productUnit;
};
