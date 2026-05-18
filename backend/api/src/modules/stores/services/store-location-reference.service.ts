import { Types } from 'mongoose';
import { AppError } from '../../../errors/AppError';
import { ERROR_CODES, type ErrorCode } from '../../../errors/error-codes';
import { HTTP_STATUS } from '../../../utils/http-status';
import { CITY_STATUS } from '../../locations/cities/constants/city-status.constant';
import { findCityById } from '../../locations/cities/repositories/city.repository';
import { countActiveServiceAreasForCityAndIds } from '../../locations/service-areas/repositories/service-area.repository';
import {
  STORE_ERROR_CODES,
  type StoreErrorCode,
} from '../constants/store-error-codes.constant';

const storeError = (code: StoreErrorCode): ErrorCode => ERROR_CODES[code];

export const assertStoreCityAndServiceAreas = async (
  cityId: string,
  serviceAreaIds: string[],
) => {
  if (!Types.ObjectId.isValid(cityId)) {
    throw new AppError({
      message: 'Invalid city',
      statusCode: HTTP_STATUS.BAD_REQUEST,
      errorCode: storeError(STORE_ERROR_CODES.INVALID_STORE_CITY),
    });
  }

  const city = await findCityById(cityId);

  if (!city) {
    throw new AppError({
      message: 'City not found',
      statusCode: HTTP_STATUS.NOT_FOUND,
      errorCode: storeError(STORE_ERROR_CODES.INVALID_STORE_CITY),
    });
  }

  if (city.status !== CITY_STATUS.ACTIVE || !city.isServiceable) {
    throw new AppError({
      message: 'City is not eligible for stores',
      statusCode: HTTP_STATUS.BAD_REQUEST,
      errorCode: storeError(STORE_ERROR_CODES.INVALID_STORE_CITY),
    });
  }

  const uniqueIds = [...new Set(serviceAreaIds)];

  if (uniqueIds.length === 0) {
    return city;
  }

  for (const id of uniqueIds) {
    if (!Types.ObjectId.isValid(id)) {
      throw new AppError({
        message: 'Invalid service area',
        statusCode: HTTP_STATUS.BAD_REQUEST,
        errorCode: storeError(STORE_ERROR_CODES.INVALID_STORE_SERVICE_AREA),
      });
    }
  }

  const matchCount = await countActiveServiceAreasForCityAndIds(cityId, uniqueIds);

  if (matchCount !== uniqueIds.length) {
    throw new AppError({
      message: 'One or more service areas are invalid for this city',
      statusCode: HTTP_STATUS.BAD_REQUEST,
      errorCode: storeError(STORE_ERROR_CODES.INVALID_STORE_SERVICE_AREA),
    });
  }

  return city;
};
