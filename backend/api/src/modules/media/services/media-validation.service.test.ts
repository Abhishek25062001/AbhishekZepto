import assert from 'node:assert/strict';
import { test } from 'node:test';
import { AppError } from '../../../errors/AppError';
import { ERROR_CODES } from '../../../errors/error-codes';
import { MEDIA_ERROR_CODES } from '../constants/media-error-codes.constant';
import type { UploadedFilePayload } from '../types/media-file.types';
import { validateUploadedFile } from './media-validation.service';

const buildFile = (overrides: Partial<UploadedFilePayload> = {}): UploadedFilePayload => ({
  originalname: 'photo.png',
  mimetype: 'image/png',
  size: 128,
  buffer: Buffer.from('png-bytes'),
  ...overrides,
});

test('validateUploadedFile accepts PNG uploads', () => {
  assert.doesNotThrow(() => validateUploadedFile(buildFile()));
});

test('validateUploadedFile rejects empty files', () => {
  assert.throws(
    () => validateUploadedFile(buildFile({ buffer: Buffer.alloc(0), size: 0 })),
    (error: unknown) =>
      error instanceof AppError &&
      error.errorCode === ERROR_CODES[MEDIA_ERROR_CODES.MEDIA_FILE_EMPTY],
  );
});

test('validateUploadedFile rejects blocked MIME types', () => {
  assert.throws(
    () => validateUploadedFile(buildFile({ mimetype: 'image/svg+xml' })),
    (error: unknown) =>
      error instanceof AppError &&
      error.errorCode === ERROR_CODES[MEDIA_ERROR_CODES.MEDIA_INVALID_MIME_TYPE],
  );
});
