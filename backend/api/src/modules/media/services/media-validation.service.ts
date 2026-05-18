import { AppError } from '../../../errors/AppError';
import { ERROR_CODES, type ErrorCode } from '../../../errors/error-codes';
import { HTTP_STATUS } from '../../../utils/http-status';
import { env } from '../../../config/env';
import {
  ALLOWED_DOCUMENT_MIME_TYPES,
  ALLOWED_IMAGE_MIME_TYPES,
  BLOCKED_MIME_TYPES,
} from '../constants/allowed-mime-types.constant';
import { MEDIA_ERROR_CODES } from '../constants/media-error-codes.constant';
import { detectFileCategory } from '../utils/media-category.util';
import { extractExtension } from '../utils/media-file-name.util';
import { getMaxSizeForMimeType } from '../middlewares/upload.middleware';
import type { UploadedFilePayload } from '../types/media-file.types';

const mediaError = (code: keyof typeof MEDIA_ERROR_CODES): ErrorCode =>
  ERROR_CODES[MEDIA_ERROR_CODES[code]];

const parseAllowedMimeList = (value: string): string[] =>
  value.split(',').map((item) => item.trim().toLowerCase()).filter(Boolean);

const allowedImageMimes = new Set([
  ...ALLOWED_IMAGE_MIME_TYPES,
  ...parseAllowedMimeList(env.MEDIA_ALLOWED_IMAGE_MIME_TYPES),
]);

const allowedDocumentMimes = new Set([
  ...ALLOWED_DOCUMENT_MIME_TYPES,
  ...parseAllowedMimeList(env.MEDIA_ALLOWED_DOCUMENT_MIME_TYPES),
]);

const extensionForMime: Record<string, string[]> = {
  'image/jpeg': ['jpg', 'jpeg'],
  'image/jpg': ['jpg', 'jpeg'],
  'image/png': ['png'],
  'image/webp': ['webp'],
  'application/pdf': ['pdf'],
};

export const validateUploadedFile = (file: UploadedFilePayload) => {
  if (!file.buffer || file.size <= 0) {
    throw new AppError({
      message: 'Uploaded file is empty',
      statusCode: HTTP_STATUS.BAD_REQUEST,
      errorCode: mediaError('MEDIA_FILE_EMPTY'),
    });
  }

  const mimeType = file.mimetype.toLowerCase();

  if (BLOCKED_MIME_TYPES.includes(mimeType as (typeof BLOCKED_MIME_TYPES)[number])) {
    throw new AppError({
      message: 'MIME type is not allowed',
      statusCode: HTTP_STATUS.BAD_REQUEST,
      errorCode: mediaError('MEDIA_INVALID_MIME_TYPE'),
    });
  }

  const category = detectFileCategory(mimeType);
  const allowed =
    category === 'image'
      ? allowedImageMimes.has(mimeType)
      : category === 'document'
        ? allowedDocumentMimes.has(mimeType)
        : mimeType.startsWith('video/') || mimeType.startsWith('audio/');

  if (!allowed) {
    throw new AppError({
      message: 'MIME type is not allowed',
      statusCode: HTTP_STATUS.BAD_REQUEST,
      errorCode: mediaError('MEDIA_INVALID_MIME_TYPE'),
    });
  }

  const extension = extractExtension(file.originalname);
  const validExtensions = extensionForMime[mimeType];
  if (validExtensions && extension && !validExtensions.includes(extension)) {
    throw new AppError({
      message: 'File extension does not match MIME type',
      statusCode: HTTP_STATUS.BAD_REQUEST,
      errorCode: mediaError('MEDIA_INVALID_EXTENSION'),
    });
  }

  const maxSize = getMaxSizeForMimeType(mimeType);
  if (file.size > maxSize) {
    throw new AppError({
      message: 'File exceeds maximum allowed size',
      statusCode: 413,
      errorCode: mediaError('MEDIA_FILE_TOO_LARGE'),
    });
  }
};
