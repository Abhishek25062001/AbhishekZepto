import { ApiErrorResponseSchema, ApiSuccessResponseSchema } from './common.schemas';

const mediaPlaceholderResponses = {
  200: {
    content: { 'application/json': { schema: ApiSuccessResponseSchema } },
    description: 'Media success response.',
  },
  201: {
    content: { 'application/json': { schema: ApiSuccessResponseSchema } },
    description: 'Media file created.',
  },
  401: {
    content: { 'application/json': { schema: ApiErrorResponseSchema } },
    description: 'Authentication failure response.',
  },
  403: {
    content: { 'application/json': { schema: ApiErrorResponseSchema } },
    description: 'Authorization failure response.',
  },
  422: {
    content: { 'application/json': { schema: ApiErrorResponseSchema } },
    description: 'Validation failure response.',
  },
};

export const mediaPaths = {
  '/admin/media/upload': {
    post: { responses: mediaPlaceholderResponses, summary: 'Upload media file (admin)' },
  },
  '/admin/media/bulk-upload': {
    post: { responses: mediaPlaceholderResponses, summary: 'Bulk upload media files (admin)' },
  },
  '/admin/media/files': {
    get: { responses: mediaPlaceholderResponses, summary: 'List media files (admin)' },
  },
  '/admin/media/files/{mediaFileId}': {
    get: { responses: mediaPlaceholderResponses, summary: 'Get media file (admin)' },
    patch: { responses: mediaPlaceholderResponses, summary: 'Update media file (admin)' },
    delete: { responses: mediaPlaceholderResponses, summary: 'Delete media file (admin)' },
  },
  '/admin/media/files/{mediaFileId}/signed-url': {
    get: { responses: mediaPlaceholderResponses, summary: 'Get signed media URL (admin)' },
  },
  '/vendor/media/upload': {
    post: { responses: mediaPlaceholderResponses, summary: 'Upload media file (vendor)' },
  },
  '/vendor/media/files': {
    get: { responses: mediaPlaceholderResponses, summary: 'List media files (vendor)' },
  },
  '/vendor/media/files/{mediaFileId}': {
    get: { responses: mediaPlaceholderResponses, summary: 'Get media file (vendor)' },
    delete: { responses: mediaPlaceholderResponses, summary: 'Delete media file (vendor)' },
  },
  '/internal/media/attach-owner': {
    post: { responses: mediaPlaceholderResponses, summary: 'Attach media owner (internal)' },
  },
  '/internal/media/files/{mediaFileId}': {
    get: { responses: mediaPlaceholderResponses, summary: 'Get media file (internal)' },
  },
};
