import type { StorageProvider } from '../constants/storage-provider.constant';

export type StorageUploadInput = {
  storageKey: string;
  buffer: Buffer;
  mimeType: string;
};

export type StorageAdapter = {
  readonly provider: StorageProvider;
  uploadFile: (input: StorageUploadInput) => Promise<{ publicUrl: string }>;
  deleteFile: (storageKey: string) => Promise<void>;
  getPublicUrl: (storageKey: string) => string;
  getSignedUrl: (storageKey: string) => Promise<string>;
  fileExists: (storageKey: string) => Promise<boolean>;
};
