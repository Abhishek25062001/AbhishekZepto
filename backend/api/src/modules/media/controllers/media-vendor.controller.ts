import { sendCreatedResponse, sendPaginatedResponse, sendSuccessResponse } from '../../../utils/api-response';
import { asyncHandler } from '../../../utils/async-handler';
import type { MediaListQuery, UploadMediaInput } from '../types/media-file.types';
import {
  assertVendorMediaAccess,
  deleteMediaFile,
  getMediaFileById,
  listMediaFiles,
  uploadMediaFile,
} from '../services/media-file.service';
import { findMediaFileById } from '../repositories/media-file.repository';

const parseListQuery = (query: Record<string, unknown>): MediaListQuery => ({
  page: typeof query.page === 'number' ? query.page : Number(query.page ?? 1),
  limit: typeof query.limit === 'number' ? query.limit : Number(query.limit ?? 20),
  filePurpose:
    typeof query.filePurpose === 'string'
      ? (query.filePurpose as MediaListQuery['filePurpose'])
      : undefined,
  status:
    typeof query.status === 'string' ? (query.status as MediaListQuery['status']) : undefined,
  search: typeof query.search === 'string' ? query.search : undefined,
  sortBy:
    typeof query.sortBy === 'string' ? (query.sortBy as MediaListQuery['sortBy']) : undefined,
  sortOrder:
    typeof query.sortOrder === 'string'
      ? (query.sortOrder as MediaListQuery['sortOrder'])
      : undefined,
});

const buildActor = (req: {
  user?: { userId?: string; role?: string | null; vendorId?: string | null; storeId?: string | null };
}) => ({
  userId: req.user?.userId ?? 'system',
  role: req.user?.role ?? null,
  surface: 'vendor_panel' as const,
  vendorId: req.user?.vendorId ?? null,
  storeId: req.user?.storeId ?? null,
});

const toUploadedFile = (file: Express.Multer.File) => ({
  originalname: file.originalname,
  mimetype: file.mimetype,
  size: file.size,
  buffer: file.buffer,
});

export const vendorUploadMediaFileController = asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'File is required' });
  }

  const input = req.body as UploadMediaInput;
  const actor = buildActor(req);
  const payload: UploadMediaInput = {
    ...input,
    ownerType: input.ownerType ?? 'vendor',
    ownerId: input.ownerId ?? actor.vendorId ?? undefined,
  };

  const created = await uploadMediaFile(toUploadedFile(req.file), payload, actor);

  return sendCreatedResponse({
    res,
    message: 'Media file uploaded successfully',
    data: created,
  });
});

export const vendorListMediaFilesController = asyncHandler(async (req, res) => {
  const query = parseListQuery(req.query as Record<string, unknown>);
  const actor = buildActor(req);

  const scopedQuery: MediaListQuery = {
    ...query,
    uploadedBy: actor.userId,
  };

  const response = await listMediaFiles(scopedQuery);

  return sendPaginatedResponse({
    res,
    message: 'Media files fetched successfully',
    data: response.items,
    pagination: response.pagination,
  });
});

export const vendorGetMediaFileByIdController = asyncHandler(async (req, res) => {
  const mediaFileId = typeof req.params.mediaFileId === 'string' ? req.params.mediaFileId : '';
  const actor = buildActor(req);
  const record = await findMediaFileById(mediaFileId);

  if (!record) {
    return res.status(404).json({ success: false, message: 'Media file not found' });
  }

  assertVendorMediaAccess(record, actor);

  const response = await getMediaFileById(mediaFileId);

  return sendSuccessResponse({
    res,
    message: 'Media file fetched successfully',
    data: response,
  });
});

export const vendorDeleteMediaFileController = asyncHandler(async (req, res) => {
  const mediaFileId = typeof req.params.mediaFileId === 'string' ? req.params.mediaFileId : '';
  const actor = buildActor(req);
  const record = await findMediaFileById(mediaFileId);

  if (!record) {
    return res.status(404).json({ success: false, message: 'Media file not found' });
  }

  assertVendorMediaAccess(record, actor);

  const deleted = await deleteMediaFile(mediaFileId, actor);

  return sendSuccessResponse({
    res,
    message: 'Media file deleted successfully',
    data: deleted,
  });
});
