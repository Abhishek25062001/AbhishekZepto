import { MEDIA_FILE_CATEGORY, type MediaFileCategory } from '../constants/media-file-category.constant';

export const detectFileCategory = (mimeType: string): MediaFileCategory => {
  const normalized = mimeType.toLowerCase();

  if (normalized.startsWith('image/')) {
    return MEDIA_FILE_CATEGORY.IMAGE;
  }
  if (normalized === 'application/pdf') {
    return MEDIA_FILE_CATEGORY.DOCUMENT;
  }
  if (normalized.startsWith('video/')) {
    return MEDIA_FILE_CATEGORY.VIDEO;
  }
  if (normalized.startsWith('audio/')) {
    return MEDIA_FILE_CATEGORY.AUDIO;
  }

  return MEDIA_FILE_CATEGORY.OTHER;
};
