import assert from 'node:assert/strict';
import { Types } from 'mongoose';
import { afterEach, test } from 'node:test';
import { AppError } from '../../../errors/AppError';
import { ERROR_CODES } from '../../../errors/error-codes';
import * as auditLogServiceModule from '../../audit/services/audit-log.service';
import { MEDIA_ERROR_CODES } from '../constants/media-error-codes.constant';
import { MEDIA_FILE_PURPOSE } from '../constants/media-file-purpose.constant';
import type { MediaFileRecord } from '../models/media-file.model';
import * as mediaRepositoryModule from '../repositories/media-file.repository';
import {
  assertVendorMediaAccess,
  attachMediaOwner,
  getMediaFileById,
} from './media-file.service';

const mediaRepository = mediaRepositoryModule as unknown as {
  findMediaFileById: (id: string) => Promise<(MediaFileRecord & { _id: Types.ObjectId }) | null>;
  updateMediaFileById: (
    id: string,
    payload: Partial<MediaFileRecord>,
  ) => Promise<(MediaFileRecord & { _id: Types.ObjectId }) | null>;
};

const auditLogService = auditLogServiceModule as unknown as {
  writeAuditLog: typeof auditLogServiceModule.writeAuditLog;
};

const mediaId = new Types.ObjectId();

const buildRecord = (
  overrides: Partial<MediaFileRecord> = {},
): MediaFileRecord & { _id: Types.ObjectId } => ({
  _id: mediaId,
  ownerType: 'product',
  ownerId: new Types.ObjectId(),
  uploadedBy: new Types.ObjectId(),
  uploadedByRole: 'operations_admin',
  uploadedFromSurface: 'admin_dashboard',
  fileCategory: 'image',
  filePurpose: MEDIA_FILE_PURPOSE.PRODUCT_MAIN_IMAGE,
  originalFileName: 'photo.png',
  storedFileName: '1700000000_abcd.png',
  storageKey: 'catalog/products/photo.png',
  publicUrl: 'http://localhost/uploads/photo.png',
  signedUrl: null,
  mimeType: 'image/png',
  extension: 'png',
  sizeBytes: 128,
  width: null,
  height: null,
  checksum: 'abc',
  storageProvider: 'local',
  bucketName: null,
  folderPath: null,
  status: 'active',
  isPublic: true,
  isDeleted: false,
  deletedAt: null,
  deletedBy: null,
  metadata: null,
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides,
});

afterEach(() => {
  auditLogService.writeAuditLog = async () => undefined;
});

test('getMediaFileById returns mapped response', async () => {
  mediaRepository.findMediaFileById = async () => buildRecord();

  const response = await getMediaFileById(mediaId.toString());

  assert.equal(response.id, mediaId.toString());
  assert.equal(response.mimeType, 'image/png');
});

test('getMediaFileById throws when record missing', async () => {
  mediaRepository.findMediaFileById = async () => null;

  await assert.rejects(
    () => getMediaFileById(mediaId.toString()),
    (error: unknown) =>
      error instanceof AppError &&
      error.errorCode === ERROR_CODES[MEDIA_ERROR_CODES.MEDIA_FILE_NOT_FOUND],
  );
});

test('attachMediaOwner updates owner fields', async () => {
  const ownerId = new Types.ObjectId().toString();
  mediaRepository.updateMediaFileById = async () =>
    buildRecord({ ownerType: 'product', ownerId: new Types.ObjectId(ownerId) });

  const response = await attachMediaOwner(
    {
      mediaFileId: mediaId.toString(),
      ownerType: 'product',
      ownerId,
      filePurpose: MEDIA_FILE_PURPOSE.PRODUCT_MAIN_IMAGE,
    },
    { userId: '507f1f77bcf86cd799439010', surface: 'admin_dashboard' },
  );

  assert.equal(response.ownerId, ownerId);
});

test('assertVendorMediaAccess allows uploader access', () => {
  const userId = '507f1f77bcf86cd799439010';
  const record = buildRecord({ uploadedBy: new Types.ObjectId(userId) });

  assert.doesNotThrow(() =>
    assertVendorMediaAccess(record, {
      userId,
      vendorId: '507f1f77bcf86cd799439099',
      surface: 'vendor_panel',
    }),
  );
});

test('assertVendorMediaAccess denies unrelated vendor', () => {
  const record = buildRecord({
    ownerType: 'vendor',
    ownerId: new Types.ObjectId('507f1f77bcf86cd799439011'),
    uploadedBy: new Types.ObjectId('507f1f77bcf86cd799439012'),
  });

  assert.throws(
    () =>
      assertVendorMediaAccess(record, {
        userId: '507f1f77bcf86cd799439013',
        vendorId: '507f1f77bcf86cd799439099',
        surface: 'vendor_panel',
      }),
    (error: unknown) =>
      error instanceof AppError &&
      error.errorCode === ERROR_CODES[MEDIA_ERROR_CODES.MEDIA_ACCESS_DENIED],
  );
});
