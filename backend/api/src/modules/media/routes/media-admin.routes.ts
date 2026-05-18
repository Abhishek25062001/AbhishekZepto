import { Router } from 'express';
import { validateRequest } from '../../../middlewares/validate-request.middleware';
import {
  AUTH_PERMISSION_ACTION,
  AUTH_PERMISSION_RESOURCE,
} from '../../auth/constants/auth-permission.constants';
import { requirePermission } from '../../auth/middlewares/require-permission.middleware';
import { createPermissionCode } from '../../auth/utils/permission-code.util';
import {
  bulkUploadMediaFilesController,
  deleteMediaFileController,
  getMediaFileByIdController,
  getSignedMediaUrlController,
  listMediaFilesController,
  updateMediaFileController,
  uploadMediaFileController,
} from '../controllers/media-admin.controller';
import {
  bulkMediaUploadMiddleware,
  singleMediaUploadMiddleware,
} from '../middlewares/upload.middleware';
import {
  adminBulkUploadMediaBodyValidator,
  adminUploadMediaBodyValidator,
  listMediaFilesQueryValidator,
  mediaFileIdParamsValidator,
  updateMediaFileBodyValidator,
} from '../validators/media-upload.validator';

const router = Router();

const mediaRead = createPermissionCode(AUTH_PERMISSION_RESOURCE.MEDIA, AUTH_PERMISSION_ACTION.READ);
const mediaUpload = createPermissionCode(
  AUTH_PERMISSION_RESOURCE.MEDIA,
  AUTH_PERMISSION_ACTION.UPLOAD,
);
const mediaUpdate = createPermissionCode(
  AUTH_PERMISSION_RESOURCE.MEDIA,
  AUTH_PERMISSION_ACTION.UPDATE,
);
const mediaDelete = createPermissionCode(
  AUTH_PERMISSION_RESOURCE.MEDIA,
  AUTH_PERMISSION_ACTION.DELETE,
);

router.post(
  '/upload',
  requirePermission(mediaUpload),
  singleMediaUploadMiddleware,
  validateRequest({ body: adminUploadMediaBodyValidator }),
  uploadMediaFileController,
);

router.post(
  '/bulk-upload',
  requirePermission(mediaUpload),
  bulkMediaUploadMiddleware,
  validateRequest({ body: adminBulkUploadMediaBodyValidator }),
  bulkUploadMediaFilesController,
);

router.get(
  '/files',
  requirePermission(mediaRead),
  validateRequest({ query: listMediaFilesQueryValidator }),
  listMediaFilesController,
);

router.get(
  '/files/:mediaFileId/signed-url',
  requirePermission(mediaRead),
  validateRequest({ params: mediaFileIdParamsValidator }),
  getSignedMediaUrlController,
);

router.get(
  '/files/:mediaFileId',
  requirePermission(mediaRead),
  validateRequest({ params: mediaFileIdParamsValidator }),
  getMediaFileByIdController,
);

router.patch(
  '/files/:mediaFileId',
  requirePermission(mediaUpdate),
  validateRequest({ params: mediaFileIdParamsValidator }),
  validateRequest({ body: updateMediaFileBodyValidator }),
  updateMediaFileController,
);

router.delete(
  '/files/:mediaFileId',
  requirePermission(mediaDelete),
  validateRequest({ params: mediaFileIdParamsValidator }),
  deleteMediaFileController,
);

export default router;
