import { AppError } from '../../../errors/AppError';
import { ERROR_CODES } from '../../../errors/error-codes';
import { HTTP_STATUS } from '../../../utils/http-status';
import { env } from '../../../config/env';
import { MEDIA_ERROR_CODES } from '../constants/media-error-codes.constant';
import { STORAGE_PROVIDER } from '../constants/storage-provider.constant';
import type { StorageAdapter } from '../types/storage-adapter.types';
import { createLocalStorageAdapter } from './local-storage.adapter';
import { createS3StorageAdapter } from './s3-storage.adapter';

let cachedAdapter: StorageAdapter | null = null;

export const getStorageAdapter = (): StorageAdapter => {
  if (cachedAdapter) {
    return cachedAdapter;
  }

  switch (env.MEDIA_STORAGE_PROVIDER) {
    case STORAGE_PROVIDER.LOCAL:
      cachedAdapter = createLocalStorageAdapter();
      break;
    case STORAGE_PROVIDER.S3:
      cachedAdapter = createS3StorageAdapter();
      break;
    default:
      throw new AppError({
        message: 'Invalid media storage provider',
        statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR,
        errorCode: ERROR_CODES[MEDIA_ERROR_CODES.MEDIA_STORAGE_PROVIDER_INVALID],
      });
  }

  return cachedAdapter;
};

export const resetStorageAdapterForTests = (): void => {
  cachedAdapter = null;
};
