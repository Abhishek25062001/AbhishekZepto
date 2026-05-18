import { AppError } from '../../../errors/AppError';
import { ERROR_CODES } from '../../../errors/error-codes';
import { HTTP_STATUS } from '../../../utils/http-status';
import { env } from '../../../config/env';
import { MEDIA_ERROR_CODES } from '../constants/media-error-codes.constant';
import { STORAGE_PROVIDER } from '../constants/storage-provider.constant';
import type { StorageAdapter, StorageUploadInput } from '../types/storage-adapter.types';

/**
 * Placeholder S3 adapter — production credentials and CDN rules finalized in a later phase.
 */
export const createS3StorageAdapter = (): StorageAdapter => ({
  provider: STORAGE_PROVIDER.S3,

  async uploadFile(input: StorageUploadInput): Promise<{ publicUrl: string }> {
    void input;
    if (!env.AWS_S3_BUCKET) {
      throw new AppError({
        message: 'S3 storage is not configured',
        statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR,
        errorCode: ERROR_CODES[MEDIA_ERROR_CODES.MEDIA_UPLOAD_FAILED],
      });
    }

    // TODO: Implement AWS SDK upload when production S3 is finalized.
    throw new AppError({
      message: 'S3 upload not implemented yet',
      statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR,
      errorCode: ERROR_CODES[MEDIA_ERROR_CODES.MEDIA_UPLOAD_FAILED],
    });
  },

  async deleteFile(storageKey: string): Promise<void> {
    void storageKey;
    throw new AppError({
      message: 'S3 delete not implemented yet',
      statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR,
      errorCode: ERROR_CODES[MEDIA_ERROR_CODES.MEDIA_DELETE_FAILED],
    });
  },

  getPublicUrl(storageKey: string): string {
    const base = env.AWS_S3_PUBLIC_BASE_URL?.replace(/\/$/, '') ?? '';
    return `${base}/${storageKey}`;
  },

  async getSignedUrl(storageKey: string): Promise<string> {
    return this.getPublicUrl(storageKey);
  },

  async fileExists(storageKey: string): Promise<boolean> {
    void storageKey;
    return false;
  },
});
