import { AppError } from '../../../errors/AppError';
import { ERROR_CODES, type ErrorCode } from '../../../errors/error-codes';
import { HTTP_STATUS } from '../../../utils/http-status';
import {
  CUSTOMER_ADDRESS_ERROR_CODES,
  type CustomerAddressErrorCode,
} from '../constants/customer-address-errors.constant';

const toErrorCode = (code: CustomerAddressErrorCode): ErrorCode => ERROR_CODES[code];

export const addressNotFoundError = (): AppError =>
  new AppError({
    message: 'Address not found',
    statusCode: HTTP_STATUS.NOT_FOUND,
    errorCode: toErrorCode(CUSTOMER_ADDRESS_ERROR_CODES.ADDRESS_NOT_FOUND),
  });

export const addressNotOwnedError = (): AppError =>
  new AppError({
    message: 'Address does not belong to this customer',
    statusCode: HTTP_STATUS.FORBIDDEN,
    errorCode: toErrorCode(CUSTOMER_ADDRESS_ERROR_CODES.ADDRESS_NOT_OWNED),
  });

export const serviceabilityUnavailableError = (): AppError =>
  new AppError({
    message: 'No store available for this location',
    statusCode: HTTP_STATUS.UNPROCESSABLE_ENTITY,
    errorCode: toErrorCode(CUSTOMER_ADDRESS_ERROR_CODES.SERVICEABILITY_AREA_UNAVAILABLE),
  });

export const storeNotFoundError = (): AppError =>
  new AppError({
    message: 'Store not found',
    statusCode: HTTP_STATUS.NOT_FOUND,
    errorCode: toErrorCode(CUSTOMER_ADDRESS_ERROR_CODES.STORE_NOT_FOUND),
  });

export const storeNotServiceableError = (): AppError =>
  new AppError({
    message: 'Store is not serviceable for this address',
    statusCode: HTTP_STATUS.UNPROCESSABLE_ENTITY,
    errorCode: toErrorCode(CUSTOMER_ADDRESS_ERROR_CODES.STORE_NOT_SERVICEABLE),
  });

export const locationInvalidError = (): AppError =>
  new AppError({
    message: 'Invalid location coordinates',
    statusCode: HTTP_STATUS.UNPROCESSABLE_ENTITY,
    errorCode: toErrorCode(CUSTOMER_ADDRESS_ERROR_CODES.LOCATION_INVALID),
  });
