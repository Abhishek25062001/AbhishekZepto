import { AppError } from '../../../../errors/AppError';
import { ERROR_CODES, type ErrorCode } from '../../../../errors/error-codes';
import { HTTP_STATUS } from '../../../../utils/http-status';
import {
  CITY_ERROR_CODES,
  type CityErrorCode,
} from '../../cities/constants/city-error-codes.constant';
import { CITY_STATUS } from '../../cities/constants/city-status.constant';
import { findCityById } from '../../cities/repositories/city.repository';

const cityError = (code: CityErrorCode): ErrorCode => ERROR_CODES[code];

export const assertCityEligibleForServiceArea = async (cityId: string) => {
  const city = await findCityById(cityId);

  if (!city) {
    throw new AppError({
      message: 'City not found',
      statusCode: HTTP_STATUS.NOT_FOUND,
      errorCode: cityError(CITY_ERROR_CODES.CITY_NOT_FOUND),
    });
  }

  if (city.status !== CITY_STATUS.ACTIVE) {
    throw new AppError({
      message: 'City is not active',
      statusCode: HTTP_STATUS.BAD_REQUEST,
      errorCode: ERROR_CODES.INVALID_SERVICE_AREA_CITY,
    });
  }

  if (!city.isServiceable) {
    throw new AppError({
      message: 'City is not serviceable',
      statusCode: HTTP_STATUS.BAD_REQUEST,
      errorCode: cityError(CITY_ERROR_CODES.CITY_NOT_SERVICEABLE),
    });
  }

  return city;
};
