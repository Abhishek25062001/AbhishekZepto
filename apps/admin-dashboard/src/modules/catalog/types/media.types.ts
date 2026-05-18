import type { MediaFilePurpose } from '../constants/media-purpose.constants';

export type MediaFileResponse = {
  id: string;
  ownerType: string | null;
  ownerId: string | null;
  fileCategory: string;
  filePurpose: MediaFilePurpose;
  originalFileName: string;
  publicUrl: string | null;
  signedUrl: string | null;
  mimeType: string;
  extension: string;
  sizeBytes: number;
  width: number | null;
  height: number | null;
  storageProvider: string;
  status: string;
  isPublic: boolean;
  metadata: Record<string, unknown> | null;
  createdAt: string;
  updatedAt: string;
};

export type MediaUploadPayload = {
  filePurpose: MediaFilePurpose;
  ownerType?: string;
  ownerId?: string;
  isPublic?: boolean;
};

export type MediaUploadResult = {
  mediaFileId: string;
  publicUrl: string | null;
};
