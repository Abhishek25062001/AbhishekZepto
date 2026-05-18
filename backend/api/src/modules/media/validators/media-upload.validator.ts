import { z } from 'zod';
import { mongoObjectIdValidator, paginationValidator } from '../../../validators/common.validators';
import { MEDIA_FILE_CATEGORY_VALUES } from '../constants/media-file-category.constant';
import { MEDIA_FILE_PURPOSE_VALUES } from '../constants/media-file-purpose.constant';
import { MEDIA_OWNER_TYPE_VALUES } from '../constants/media-owner-type.constant';
import { MEDIA_STATUS_VALUES } from '../constants/media-status.constant';

export const mediaFileIdParamsValidator = z
  .object({
    mediaFileId: mongoObjectIdValidator,
  })
  .strict();

const uploadBodyBase = z.object({
  ownerType: z.enum(MEDIA_OWNER_TYPE_VALUES).optional(),
  ownerId: mongoObjectIdValidator.optional(),
  filePurpose: z.enum(MEDIA_FILE_PURPOSE_VALUES),
  isPublic: z.coerce.boolean().optional(),
  metadata: z.record(z.unknown()).optional(),
});

export const adminUploadMediaBodyValidator = uploadBodyBase.strict();

export const adminBulkUploadMediaBodyValidator = uploadBodyBase.strict();

export const vendorUploadMediaBodyValidator = uploadBodyBase.strict();

export const listMediaFilesQueryValidator = paginationValidator
  .extend({
    ownerType: z.enum(MEDIA_OWNER_TYPE_VALUES).optional(),
    ownerId: mongoObjectIdValidator.optional(),
    uploadedBy: mongoObjectIdValidator.optional(),
    fileCategory: z.enum(MEDIA_FILE_CATEGORY_VALUES).optional(),
    filePurpose: z.enum(MEDIA_FILE_PURPOSE_VALUES).optional(),
    status: z.enum(MEDIA_STATUS_VALUES).optional(),
    isPublic: z.coerce.boolean().optional(),
    search: z.string().trim().min(1).optional(),
    sortBy: z.enum(['createdAt']).optional(),
    sortOrder: z.enum(['asc', 'desc']).optional(),
  })
  .strict();

export const updateMediaFileBodyValidator = z
  .object({
    ownerType: z.enum(MEDIA_OWNER_TYPE_VALUES).optional(),
    ownerId: mongoObjectIdValidator.optional(),
    filePurpose: z.enum(MEDIA_FILE_PURPOSE_VALUES).optional(),
    isPublic: z.coerce.boolean().optional(),
    metadata: z.record(z.unknown()).optional(),
    status: z.enum(MEDIA_STATUS_VALUES).optional(),
  })
  .strict();

export const attachMediaOwnerBodyValidator = z
  .object({
    mediaFileId: mongoObjectIdValidator,
    ownerType: z.enum(MEDIA_OWNER_TYPE_VALUES),
    ownerId: mongoObjectIdValidator,
    filePurpose: z.enum(MEDIA_FILE_PURPOSE_VALUES).optional(),
  })
  .strict();
