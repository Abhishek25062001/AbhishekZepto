import type { MediaFileRecord } from '../models/media-file.model';

export type MediaFileResponse = {
  id: string;
  ownerType: MediaFileRecord['ownerType'];
  ownerId: string | null;
  fileCategory: MediaFileRecord['fileCategory'];
  filePurpose: MediaFileRecord['filePurpose'];
  originalFileName: string;
  publicUrl: string | null;
  signedUrl: string | null;
  mimeType: string;
  extension: string;
  sizeBytes: number;
  width: number | null;
  height: number | null;
  storageProvider: MediaFileRecord['storageProvider'];
  status: MediaFileRecord['status'];
  isPublic: boolean;
  metadata: Record<string, unknown> | null;
  createdAt: Date;
  updatedAt: Date;
};

export const toMediaFileResponse = (
  record: MediaFileRecord & { _id: { toString(): string } },
): MediaFileResponse => ({
  id: record._id.toString(),
  ownerType: record.ownerType,
  ownerId: record.ownerId?.toString() ?? null,
  fileCategory: record.fileCategory,
  filePurpose: record.filePurpose,
  originalFileName: record.originalFileName,
  publicUrl: record.publicUrl,
  signedUrl: record.signedUrl,
  mimeType: record.mimeType,
  extension: record.extension,
  sizeBytes: record.sizeBytes,
  width: record.width,
  height: record.height,
  storageProvider: record.storageProvider,
  status: record.status,
  isPublic: record.isPublic,
  metadata: record.metadata,
  createdAt: record.createdAt,
  updatedAt: record.updatedAt,
});
