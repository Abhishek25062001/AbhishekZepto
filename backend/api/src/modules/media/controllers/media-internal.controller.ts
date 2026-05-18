import { sendSuccessResponse } from '../../../utils/api-response';
import { asyncHandler } from '../../../utils/async-handler';
import type { AttachMediaOwnerInput } from '../types/media-file.types';
import { attachMediaOwner, getMediaFileById } from '../services/media-file.service';

export const attachMediaOwnerController = asyncHandler(async (req, res) => {
  const attached = await attachMediaOwner(req.body as AttachMediaOwnerInput, {
    userId: req.user?.userId ?? 'system',
    role: req.user?.role ?? null,
    surface: 'backend',
  });

  return sendSuccessResponse({
    res,
    message: 'Media owner attached successfully',
    data: attached,
  });
});

export const internalGetMediaFileByIdController = asyncHandler(async (req, res) => {
  const mediaFileId = typeof req.params.mediaFileId === 'string' ? req.params.mediaFileId : '';
  const record = await getMediaFileById(mediaFileId);

  return sendSuccessResponse({
    res,
    message: 'Media file fetched successfully',
    data: record,
  });
});
