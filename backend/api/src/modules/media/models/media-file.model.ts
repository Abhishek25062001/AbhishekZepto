import { model, Schema, Types } from 'mongoose';
import type { SchemaOptions } from 'mongoose';
import { baseSchemaOptions } from '../../../database/base-schema-options';
import { COLLECTION_NAMES } from '../../../database/constants/collection-names.constants';
import { MEDIA_FILE_CATEGORY_VALUES } from '../constants/media-file-category.constant';
import { MEDIA_FILE_PURPOSE_VALUES } from '../constants/media-file-purpose.constant';
import { MEDIA_OWNER_TYPE_VALUES } from '../constants/media-owner-type.constant';
import { MEDIA_STATUS_VALUES } from '../constants/media-status.constant';
import { STORAGE_PROVIDER_VALUES } from '../constants/storage-provider.constant';

export type MediaFileRecord = {
  ownerType: (typeof MEDIA_OWNER_TYPE_VALUES)[number] | null;
  ownerId: Types.ObjectId | null;
  uploadedBy: Types.ObjectId | null;
  uploadedByRole: string | null;
  uploadedFromSurface: string | null;
  fileCategory: (typeof MEDIA_FILE_CATEGORY_VALUES)[number];
  filePurpose: (typeof MEDIA_FILE_PURPOSE_VALUES)[number];
  originalFileName: string;
  storedFileName: string;
  storageKey: string;
  publicUrl: string | null;
  signedUrl: string | null;
  mimeType: string;
  extension: string;
  sizeBytes: number;
  width: number | null;
  height: number | null;
  checksum: string;
  storageProvider: (typeof STORAGE_PROVIDER_VALUES)[number];
  bucketName: string | null;
  folderPath: string | null;
  status: (typeof MEDIA_STATUS_VALUES)[number];
  isPublic: boolean;
  isDeleted: boolean;
  deletedAt: Date | null;
  deletedBy: Types.ObjectId | null;
  metadata: Record<string, unknown> | null;
  createdAt: Date;
  updatedAt: Date;
};

const MediaFileSchema = new Schema<MediaFileRecord>(
  {
    ownerType: { type: String, enum: MEDIA_OWNER_TYPE_VALUES, default: null },
    ownerId: { type: Schema.Types.ObjectId, default: null },
    uploadedBy: { type: Schema.Types.ObjectId, default: null },
    uploadedByRole: { type: String, default: null, trim: true },
    uploadedFromSurface: { type: String, default: null, trim: true },
    fileCategory: { type: String, enum: MEDIA_FILE_CATEGORY_VALUES, required: true },
    filePurpose: { type: String, enum: MEDIA_FILE_PURPOSE_VALUES, required: true },
    originalFileName: { type: String, required: true, trim: true },
    storedFileName: { type: String, required: true, trim: true },
    storageKey: { type: String, required: true, trim: true },
    publicUrl: { type: String, default: null, trim: true },
    signedUrl: { type: String, default: null, trim: true },
    mimeType: { type: String, required: true, trim: true },
    extension: { type: String, required: true, trim: true },
    sizeBytes: { type: Number, required: true, min: 1 },
    width: { type: Number, default: null },
    height: { type: Number, default: null },
    checksum: { type: String, required: true, trim: true },
    storageProvider: { type: String, enum: STORAGE_PROVIDER_VALUES, required: true },
    bucketName: { type: String, default: null, trim: true },
    folderPath: { type: String, default: null, trim: true },
    status: { type: String, enum: MEDIA_STATUS_VALUES, default: 'active' },
    isPublic: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date, default: null },
    deletedBy: { type: Schema.Types.ObjectId, default: null },
    metadata: { type: Schema.Types.Mixed, default: null },
  },
  baseSchemaOptions as SchemaOptions<MediaFileRecord>,
);

MediaFileSchema.index(
  { storageKey: 1 },
  { unique: true, partialFilterExpression: { isDeleted: false } },
);
MediaFileSchema.index({ ownerType: 1 });
MediaFileSchema.index({ ownerId: 1 });
MediaFileSchema.index({ uploadedBy: 1 });
MediaFileSchema.index({ fileCategory: 1 });
MediaFileSchema.index({ filePurpose: 1 });
MediaFileSchema.index({ status: 1 });
MediaFileSchema.index({ isPublic: 1 });
MediaFileSchema.index({ isDeleted: 1 });
MediaFileSchema.index({ createdAt: -1 });
MediaFileSchema.index({ checksum: 1 });

export const MediaFileModel = model<MediaFileRecord>(
  'MediaFile',
  MediaFileSchema,
  COLLECTION_NAMES.MEDIA_FILES,
);
