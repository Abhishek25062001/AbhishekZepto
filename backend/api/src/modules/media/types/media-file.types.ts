import type { MediaFileCategory } from '../constants/media-file-category.constant';
import type { MediaFilePurpose } from '../constants/media-file-purpose.constant';
import type { MediaOwnerType } from '../constants/media-owner-type.constant';
import type { MediaStatus } from '../constants/media-status.constant';

export type UploadMediaInput = {
  ownerType?: MediaOwnerType;
  ownerId?: string;
  filePurpose: MediaFilePurpose;
  isPublic?: boolean;
  metadata?: Record<string, unknown>;
};

export type UpdateMediaInput = {
  ownerType?: MediaOwnerType;
  ownerId?: string;
  filePurpose?: MediaFilePurpose;
  isPublic?: boolean;
  metadata?: Record<string, unknown>;
  status?: MediaStatus;
};

export type MediaListQuery = {
  page: number;
  limit: number;
  ownerType?: MediaOwnerType;
  ownerId?: string;
  uploadedBy?: string;
  fileCategory?: MediaFileCategory;
  filePurpose?: MediaFilePurpose;
  status?: MediaStatus;
  isPublic?: boolean;
  search?: string;
  sortBy?: 'createdAt';
  sortOrder?: 'asc' | 'desc';
};

export type AttachMediaOwnerInput = {
  mediaFileId: string;
  ownerType: MediaOwnerType;
  ownerId: string;
  filePurpose?: MediaFilePurpose;
};

export type BulkUploadSummary = {
  uploadedCount: number;
  failedCount: number;
  files: unknown[];
  errors: Array<{ fileName: string; message: string }>;
};

export type UploadedFilePayload = {
  originalname: string;
  mimetype: string;
  size: number;
  buffer: Buffer;
};
