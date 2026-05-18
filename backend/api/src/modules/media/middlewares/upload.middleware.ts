import multer from 'multer';
import { AppError } from '../../../errors/AppError';
import { ERROR_CODES } from '../../../errors/error-codes';
import { HTTP_STATUS } from '../../../utils/http-status';
import { env } from '../../../config/env';
import { BLOCKED_MIME_TYPES } from '../constants/allowed-mime-types.constant';
import { MEDIA_ERROR_CODES } from '../constants/media-error-codes.constant';
import { detectFileCategory } from '../utils/media-category.util';

const mediaError = (code: keyof typeof MEDIA_ERROR_CODES) => ERROR_CODES[MEDIA_ERROR_CODES[code]];

const maxFileSize = Math.max(
  env.MEDIA_MAX_IMAGE_SIZE_BYTES,
  env.MEDIA_MAX_DOCUMENT_SIZE_BYTES,
  env.MEDIA_MAX_VIDEO_SIZE_BYTES,
);

const storage = multer.memoryStorage();

const fileFilter: multer.Options['fileFilter'] = (_req, file, callback) => {
  if (BLOCKED_MIME_TYPES.includes(file.mimetype as (typeof BLOCKED_MIME_TYPES)[number])) {
    callback(
      new AppError({
        message: 'Blocked MIME type',
        statusCode: HTTP_STATUS.BAD_REQUEST,
        errorCode: mediaError('MEDIA_INVALID_MIME_TYPE'),
      }),
    );
    return;
  }

  callback(null, true);
};

const upload = multer({
  storage,
  limits: {
    fileSize: maxFileSize,
    files: env.MEDIA_MAX_FILES_PER_REQUEST,
  },
  fileFilter,
});

export const singleMediaUploadMiddleware = upload.single('file');

export const bulkMediaUploadMiddleware = upload.array(
  'files',
  env.MEDIA_MAX_FILES_PER_REQUEST,
);

export const getMaxSizeForMimeType = (mimeType: string): number => {
  const category = detectFileCategory(mimeType);

  switch (category) {
    case 'image':
      return env.MEDIA_MAX_IMAGE_SIZE_BYTES;
    case 'document':
      return env.MEDIA_MAX_DOCUMENT_SIZE_BYTES;
    case 'video':
      return env.MEDIA_MAX_VIDEO_SIZE_BYTES;
    default:
      return env.MEDIA_MAX_DOCUMENT_SIZE_BYTES;
  }
};
