export const MEDIA_STATUS = {
  UPLOADED: 'uploaded',
  PROCESSING: 'processing',
  ACTIVE: 'active',
  FAILED: 'failed',
  DELETED: 'deleted',
  ARCHIVED: 'archived',
} as const;

export const MEDIA_STATUS_VALUES = [
  MEDIA_STATUS.UPLOADED,
  MEDIA_STATUS.PROCESSING,
  MEDIA_STATUS.ACTIVE,
  MEDIA_STATUS.FAILED,
  MEDIA_STATUS.DELETED,
  MEDIA_STATUS.ARCHIVED,
] as const;

export type MediaStatus = (typeof MEDIA_STATUS_VALUES)[number];
