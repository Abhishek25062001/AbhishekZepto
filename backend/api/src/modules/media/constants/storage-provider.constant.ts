export const STORAGE_PROVIDER = {
  LOCAL: 'local',
  S3: 's3',
  GCS: 'gcs',
  CLOUDINARY: 'cloudinary',
} as const;

export const STORAGE_PROVIDER_VALUES = [
  STORAGE_PROVIDER.LOCAL,
  STORAGE_PROVIDER.S3,
  STORAGE_PROVIDER.GCS,
  STORAGE_PROVIDER.CLOUDINARY,
] as const;

export type StorageProvider = (typeof STORAGE_PROVIDER_VALUES)[number];
