import {
  sendCreatedResponse,
  sendPaginatedResponse,
  sendSuccessResponse,
} from '../../../utils/api-response';
import { asyncHandler } from '../../../utils/async-handler';
import type { MediaListQuery, UpdateMediaInput, UploadMediaInput } from '../types/media-file.types';
import {
  bulkUploadMediaFiles,
  deleteMediaFile,
  getMediaFileById,
  getSignedMediaUrl,
  listMediaFiles,
  updateMediaFile,
  uploadMediaFile,
} from '../services/media-file.service';

const parseListQuery = (query: Record<string, unknown>): MediaListQuery => ({
  page: typeof query.page === 'number' ? query.page : Number(query.page ?? 1),
  limit: typeof query.limit === 'number' ? query.limit : Number(query.limit ?? 20),
  ownerType:
    typeof query.ownerType === 'string' ? (query.ownerType as MediaListQuery['ownerType']) : undefined,
  ownerId: typeof query.ownerId === 'string' ? query.ownerId : undefined,
  uploadedBy: typeof query.uploadedBy === 'string' ? query.uploadedBy : undefined,
  fileCategory:
    typeof query.fileCategory === 'string'
      ? (query.fileCategory as MediaListQuery['fileCategory'])
      : undefined,
  filePurpose:
    typeof query.filePurpose === 'string'
      ? (query.filePurpose as MediaListQuery['filePurpose'])
      : undefined,
  status:
    typeof query.status === 'string' ? (query.status as MediaListQuery['status']) : undefined,
  isPublic: typeof query.isPublic === 'boolean' ? query.isPublic : undefined,
  search: typeof query.search === 'string' ? query.search : undefined,
  sortBy:
    typeof query.sortBy === 'string' ? (query.sortBy as MediaListQuery['sortBy']) : undefined,
  sortOrder:
    typeof query.sortOrder === 'string'
      ? (query.sortOrder as MediaListQuery['sortOrder'])
      : undefined,
});

const toUploadedFile = (file: Express.Multer.File) => ({
  originalname: file.originalname,
  mimetype: file.mimetype,
  size: file.size,
  buffer: file.buffer,
});

const buildActor = (req: {
  user?: { userId?: string; role?: string | null; vendorId?: string | null; storeId?: string | null };
}) => ({
  userId: req.user?.userId ?? 'system',
  role: req.user?.role ?? null,
  surface: 'admin_dashboard' as const,
  vendorId: req.user?.vendorId ?? null,
  storeId: req.user?.storeId ?? null,
});

export const uploadMediaFileController = asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'File is required' });
  }

  const created = await uploadMediaFile(
    toUploadedFile(req.file),
    req.body as UploadMediaInput,
    buildActor(req),
  );

  return sendCreatedResponse({
    res,
    message: 'Media file uploaded successfully',
    data: created,
  });
});

export const bulkUploadMediaFilesController = asyncHandler(async (req, res) => {
  const files = Array.isArray(req.files) ? req.files : [];

  const summary = await bulkUploadMediaFiles(
    files.map(toUploadedFile),
    req.body as UploadMediaInput,
    buildActor(req),
  );

  return sendSuccessResponse({
    res,
    message: 'Bulk media upload completed',
    data: summary,
  });
});

export const listMediaFilesController = asyncHandler(async (req, res) => {
  const query = parseListQuery(req.query as Record<string, unknown>);
  const response = await listMediaFiles(query);

  return sendPaginatedResponse({
    res,
    message: 'Media files fetched successfully',
    data: response.items,
    pagination: response.pagination,
  });
});

export const getMediaFileByIdController = asyncHandler(async (req, res) => {
  const mediaFileId = typeof req.params.mediaFileId === 'string' ? req.params.mediaFileId : '';
  const record = await getMediaFileById(mediaFileId);

  return sendSuccessResponse({
    res,
    message: 'Media file fetched successfully',
    data: record,
  });
});

export const updateMediaFileController = asyncHandler(async (req, res) => {
  const mediaFileId = typeof req.params.mediaFileId === 'string' ? req.params.mediaFileId : '';
  const updated = await updateMediaFile(
    mediaFileId,
    req.body as UpdateMediaInput,
    buildActor(req),
  );

  return sendSuccessResponse({
    res,
    message: 'Media file updated successfully',
    data: updated,
  });
});

export const deleteMediaFileController = asyncHandler(async (req, res) => {
  const mediaFileId = typeof req.params.mediaFileId === 'string' ? req.params.mediaFileId : '';
  const deleted = await deleteMediaFile(mediaFileId, buildActor(req));

  return sendSuccessResponse({
    res,
    message: 'Media file deleted successfully',
    data: deleted,
  });
});

export const getSignedMediaUrlController = asyncHandler(async (req, res) => {
  const mediaFileId = typeof req.params.mediaFileId === 'string' ? req.params.mediaFileId : '';
  const signed = await getSignedMediaUrl(mediaFileId, buildActor(req));

  return sendSuccessResponse({
    res,
    message: 'Signed media URL generated successfully',
    data: signed,
  });
});
