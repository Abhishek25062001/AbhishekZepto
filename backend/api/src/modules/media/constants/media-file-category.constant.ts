export const MEDIA_FILE_CATEGORY = {
  IMAGE: 'image',
  DOCUMENT: 'document',
  VIDEO: 'video',
  AUDIO: 'audio',
  OTHER: 'other',
} as const;

export const MEDIA_FILE_CATEGORY_VALUES = [
  MEDIA_FILE_CATEGORY.IMAGE,
  MEDIA_FILE_CATEGORY.DOCUMENT,
  MEDIA_FILE_CATEGORY.VIDEO,
  MEDIA_FILE_CATEGORY.AUDIO,
  MEDIA_FILE_CATEGORY.OTHER,
] as const;

export type MediaFileCategory = (typeof MEDIA_FILE_CATEGORY_VALUES)[number];
