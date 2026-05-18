export const ALLOWED_IMAGE_MIME_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
] as const;

export const ALLOWED_DOCUMENT_MIME_TYPES = [
  'application/pdf',
  'image/jpeg',
  'image/png',
] as const;

export const BLOCKED_MIME_TYPES = [
  'image/svg+xml',
  'text/html',
  'application/javascript',
  'application/x-msdownload',
  'application/x-sh',
] as const;
