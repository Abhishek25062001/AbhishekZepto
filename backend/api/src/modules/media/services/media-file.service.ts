import { Types } from 'mongoose';
import { AppError } from '../../../errors/AppError';
import { ERROR_CODES, type ErrorCode } from '../../../errors/error-codes';
import { HTTP_STATUS } from '../../../utils/http-status';
import { writeAuditLog, type AuditActorSurface } from '../../audit';
import { MEDIA_AUDIT_EVENTS } from '../constants/media-audit-events.constant';
import { MEDIA_ERROR_CODES } from '../constants/media-error-codes.constant';
import { MEDIA_FILE_PURPOSE } from '../constants/media-file-purpose.constant';
import { MEDIA_STATUS } from '../constants/media-status.constant';
import type { MediaFileRecord } from '../models/media-file.model';
import {
  createMediaFile,
  findMediaFileById,
  listMediaFiles as listMediaFilesRecord,
  softDeleteMediaFileById,
  updateMediaFileById,
} from '../repositories/media-file.repository';
import { getStorageAdapter } from '../storage/storage-adapter.factory';
import type {
  AttachMediaOwnerInput,
  BulkUploadSummary,
  MediaListQuery,
  UpdateMediaInput,
  UploadMediaInput,
  UploadedFilePayload,
} from '../types/media-file.types';
import { generateFileChecksum } from '../utils/media-checksum.util';
import { detectFileCategory } from '../utils/media-category.util';
import {
  extractExtension,
  generateStoredFileName,
  sanitizeOriginalFileName,
} from '../utils/media-file-name.util';
import { toMediaFileResponse } from '../utils/media-response.mapper';
import { buildStorageKey } from '../utils/media-storage-key.util';
import { env } from '../../../config/env';
import { validateUploadedFile } from './media-validation.service';

const mediaError = (code: keyof typeof MEDIA_ERROR_CODES): ErrorCode =>
  ERROR_CODES[MEDIA_ERROR_CODES[code]];

const toObjectIdOrNull = (value?: string): Types.ObjectId | null =>
  value && Types.ObjectId.isValid(value) ? new Types.ObjectId(value) : null;

const publicPurposes = new Set<string>([
  MEDIA_FILE_PURPOSE.CATEGORY_ICON,
  MEDIA_FILE_PURPOSE.CATEGORY_BANNER,
  MEDIA_FILE_PURPOSE.BRAND_LOGO,
  MEDIA_FILE_PURPOSE.BRAND_BANNER,
  MEDIA_FILE_PURPOSE.PRODUCT_MAIN_IMAGE,
  MEDIA_FILE_PURPOSE.PRODUCT_GALLERY_IMAGE,
  MEDIA_FILE_PURPOSE.VARIANT_IMAGE,
  MEDIA_FILE_PURPOSE.STORE_LOGO,
  MEDIA_FILE_PURPOSE.STORE_BANNER,
]);

const defaultIsPublicForPurpose = (filePurpose: UploadMediaInput['filePurpose']): boolean =>
  publicPurposes.has(filePurpose);

type ActorContext = {
  userId: string;
  role?: string | null;
  surface: AuditActorSurface;
  vendorId?: string | null;
  storeId?: string | null;
};

const writeMediaAudit = async (
  eventType: (typeof MEDIA_AUDIT_EVENTS)[keyof typeof MEDIA_AUDIT_EVENTS],
  record: MediaFileRecord & { _id: Types.ObjectId },
  actor: ActorContext,
  metadata: Record<string, unknown> = {},
) => {
  await writeAuditLog({
    eventType,
    actorId: toObjectIdOrNull(actor.userId),
    actorRole: actor.role ?? null,
    actorSurface: actor.surface,
    entityType: 'media_file',
    entityId: record._id,
    vendorId: toObjectIdOrNull(actor.vendorId ?? undefined),
    storeId: toObjectIdOrNull(actor.storeId ?? undefined),
    cityId: null,
    requestId: null,
    traceId: null,
    ipAddress: null,
    userAgent: null,
    metadata: {
      mediaFileId: record._id.toString(),
      filePurpose: record.filePurpose,
      ...metadata,
    },
    status: 'success',
  });
};

const persistUploadedFile = async (
  file: UploadedFilePayload,
  input: UploadMediaInput,
  actor: ActorContext,
) => {
  validateUploadedFile(file);

  const adapter = getStorageAdapter();
  const originalFileName = sanitizeOriginalFileName(file.originalname);
  const storedFileName = generateStoredFileName(originalFileName);
  const extension = extractExtension(originalFileName);
  const checksum = generateFileChecksum(file.buffer);
  const fileCategory = detectFileCategory(file.mimetype);
  const storageKey = buildStorageKey(
    input.filePurpose,
    input.ownerType ?? null,
    input.ownerId ?? null,
    storedFileName,
  );

  let publicUrl: string;
  try {
    const uploadResult = await adapter.uploadFile({
      storageKey,
      buffer: file.buffer,
      mimeType: file.mimetype,
    });
    publicUrl = uploadResult.publicUrl;
  } catch {
    throw new AppError({
      message: 'Media upload failed',
      statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR,
      errorCode: mediaError('MEDIA_UPLOAD_FAILED'),
    });
  }

  const created = await createMediaFile({
    ownerType: input.ownerType ?? null,
    ownerId: toObjectIdOrNull(input.ownerId),
    uploadedBy: toObjectIdOrNull(actor.userId),
    uploadedByRole: actor.role ?? null,
    uploadedFromSurface: actor.surface,
    fileCategory,
    filePurpose: input.filePurpose,
    originalFileName,
    storedFileName,
    storageKey,
    publicUrl,
    signedUrl: null,
    mimeType: file.mimetype,
    extension,
    sizeBytes: file.size,
    width: null,
    height: null,
    checksum,
    storageProvider: adapter.provider,
    bucketName: null,
    folderPath: storageKey.split('/').slice(0, -1).join('/'),
    status: MEDIA_STATUS.ACTIVE,
    isPublic: input.isPublic ?? defaultIsPublicForPurpose(input.filePurpose),
    metadata: input.metadata ?? null,
    isDeleted: false,
    deletedAt: null,
    deletedBy: null,
  });

  await writeMediaAudit(MEDIA_AUDIT_EVENTS.MEDIA_FILE_UPLOADED, created, actor);

  return toMediaFileResponse(created);
};

export const uploadMediaFile = async (
  file: UploadedFilePayload,
  input: UploadMediaInput,
  actor: ActorContext,
) => persistUploadedFile(file, input, actor);

export const bulkUploadMediaFiles = async (
  files: UploadedFilePayload[],
  input: UploadMediaInput,
  actor: ActorContext,
): Promise<BulkUploadSummary> => {
  if (files.length > env.MEDIA_MAX_FILES_PER_REQUEST) {
    throw new AppError({
      message: 'Too many files in bulk upload request',
      statusCode: HTTP_STATUS.BAD_REQUEST,
      errorCode: mediaError('MEDIA_FILE_COUNT_EXCEEDED'),
    });
  }

  const summary: BulkUploadSummary = {
    uploadedCount: 0,
    failedCount: 0,
    files: [],
    errors: [],
  };

  for (const file of files) {
    try {
      const uploaded = await persistUploadedFile(file, input, actor);
      summary.uploadedCount += 1;
      summary.files.push(uploaded);
    } catch (error) {
      summary.failedCount += 1;
      summary.errors.push({
        fileName: file.originalname,
        message: error instanceof Error ? error.message : 'Upload failed',
      });
    }
  }

  await writeAuditLog({
    eventType: MEDIA_AUDIT_EVENTS.MEDIA_FILES_BULK_UPLOADED,
    actorId: toObjectIdOrNull(actor.userId),
    actorRole: actor.role ?? null,
    actorSurface: actor.surface,
    entityType: 'media_file',
    entityId: null,
    vendorId: toObjectIdOrNull(actor.vendorId ?? undefined),
    storeId: toObjectIdOrNull(actor.storeId ?? undefined),
    cityId: null,
    requestId: null,
    traceId: null,
    ipAddress: null,
    userAgent: null,
    metadata: {
      uploadedCount: summary.uploadedCount,
      failedCount: summary.failedCount,
    },
    status: 'success',
  });

  return summary;
};

export const getMediaFileById = async (mediaFileId: string) => {
  const record = await findMediaFileById(mediaFileId);

  if (!record) {
    throw new AppError({
      message: 'Media file not found',
      statusCode: HTTP_STATUS.NOT_FOUND,
      errorCode: mediaError('MEDIA_FILE_NOT_FOUND'),
    });
  }

  return toMediaFileResponse(record);
};

export const listMediaFiles = async (query: MediaListQuery) => {
  const response = await listMediaFilesRecord(query);

  return {
    items: response.items.map(toMediaFileResponse),
    pagination: {
      page: query.page,
      limit: query.limit,
      total: response.total,
      totalPages: Math.max(1, Math.ceil(response.total / query.limit)),
      hasNextPage: query.page * query.limit < response.total,
      hasPreviousPage: query.page > 1,
    },
  };
};

export const updateMediaFile = async (
  mediaFileId: string,
  input: UpdateMediaInput,
  actor: ActorContext,
) => {
  const updated = await updateMediaFileById(mediaFileId, {
    ...(input.ownerType !== undefined ? { ownerType: input.ownerType } : {}),
    ...(input.ownerId !== undefined ? { ownerId: toObjectIdOrNull(input.ownerId) } : {}),
    ...(input.filePurpose !== undefined ? { filePurpose: input.filePurpose } : {}),
    ...(input.isPublic !== undefined ? { isPublic: input.isPublic } : {}),
    ...(input.metadata !== undefined ? { metadata: input.metadata } : {}),
    ...(input.status !== undefined ? { status: input.status } : {}),
    updatedAt: new Date(),
  });

  if (!updated) {
    throw new AppError({
      message: 'Media file not found',
      statusCode: HTTP_STATUS.NOT_FOUND,
      errorCode: mediaError('MEDIA_FILE_NOT_FOUND'),
    });
  }

  await writeMediaAudit(MEDIA_AUDIT_EVENTS.MEDIA_FILE_UPDATED, updated, actor);

  return toMediaFileResponse(updated);
};

export const deleteMediaFile = async (mediaFileId: string, actor: ActorContext) => {
  const record = await findMediaFileById(mediaFileId);

  if (!record) {
    throw new AppError({
      message: 'Media file not found',
      statusCode: HTTP_STATUS.NOT_FOUND,
      errorCode: mediaError('MEDIA_FILE_NOT_FOUND'),
    });
  }

  const adapter = getStorageAdapter();

  try {
    await adapter.deleteFile(record.storageKey);
  } catch {
    throw new AppError({
      message: 'Media delete failed',
      statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR,
      errorCode: mediaError('MEDIA_DELETE_FAILED'),
    });
  }

  const deleted = await softDeleteMediaFileById(mediaFileId, toObjectIdOrNull(actor.userId));

  if (!deleted) {
    throw new AppError({
      message: 'Media file not found',
      statusCode: HTTP_STATUS.NOT_FOUND,
      errorCode: mediaError('MEDIA_FILE_NOT_FOUND'),
    });
  }

  await writeMediaAudit(MEDIA_AUDIT_EVENTS.MEDIA_FILE_DELETED, deleted, actor);

  return toMediaFileResponse(deleted);
};

export const getSignedMediaUrl = async (mediaFileId: string, actor: ActorContext) => {
  const record = await findMediaFileById(mediaFileId);

  if (!record) {
    throw new AppError({
      message: 'Media file not found',
      statusCode: HTTP_STATUS.NOT_FOUND,
      errorCode: mediaError('MEDIA_FILE_NOT_FOUND'),
    });
  }

  const adapter = getStorageAdapter();

  if (record.isPublic && record.publicUrl) {
    await writeMediaAudit(MEDIA_AUDIT_EVENTS.MEDIA_SIGNED_URL_GENERATED, record, actor, {
      isPublic: true,
    });
    return { url: record.publicUrl, isPublic: true };
  }

  try {
    const signedUrl = await adapter.getSignedUrl(record.storageKey);
    await updateMediaFileById(mediaFileId, { signedUrl, updatedAt: new Date() });
    await writeMediaAudit(MEDIA_AUDIT_EVENTS.MEDIA_SIGNED_URL_GENERATED, record, actor, {
      isPublic: false,
    });
    return { url: signedUrl, isPublic: false };
  } catch {
    throw new AppError({
      message: 'Failed to generate signed media URL',
      statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR,
      errorCode: mediaError('MEDIA_SIGNED_URL_FAILED'),
    });
  }
};

export const attachMediaOwner = async (input: AttachMediaOwnerInput, actor: ActorContext) => {
  if (!Types.ObjectId.isValid(input.ownerId)) {
    throw new AppError({
      message: 'Invalid media owner',
      statusCode: HTTP_STATUS.BAD_REQUEST,
      errorCode: mediaError('MEDIA_OWNER_INVALID'),
    });
  }

  const updated = await updateMediaFileById(input.mediaFileId, {
    ownerType: input.ownerType,
    ownerId: new Types.ObjectId(input.ownerId),
    ...(input.filePurpose ? { filePurpose: input.filePurpose } : {}),
    updatedAt: new Date(),
  });

  if (!updated) {
    throw new AppError({
      message: 'Media file not found',
      statusCode: HTTP_STATUS.NOT_FOUND,
      errorCode: mediaError('MEDIA_FILE_NOT_FOUND'),
    });
  }

  await writeMediaAudit(MEDIA_AUDIT_EVENTS.MEDIA_OWNER_ATTACHED, updated, actor, {
    ownerType: input.ownerType,
    ownerId: input.ownerId,
  });

  return toMediaFileResponse(updated);
};

export const assertVendorMediaAccess = (
  record: MediaFileRecord,
  actor: ActorContext,
): void => {
  if (!actor.vendorId) {
    return;
  }

  if (record.ownerType === 'vendor' && record.ownerId?.toString() === actor.vendorId) {
    return;
  }

  if (record.ownerType === 'store' && record.ownerId?.toString() === actor.storeId) {
    return;
  }

  if (record.uploadedBy?.toString() === actor.userId) {
    return;
  }

  throw new AppError({
    message: 'Media access denied',
    statusCode: HTTP_STATUS.FORBIDDEN,
    errorCode: mediaError('MEDIA_ACCESS_DENIED'),
  });
};
