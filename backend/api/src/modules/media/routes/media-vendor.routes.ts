import { Router } from 'express';
import { validateRequest } from '../../../middlewares/validate-request.middleware';
import {
  AUTH_PERMISSION_ACTION,
  AUTH_PERMISSION_RESOURCE,
} from '../../auth/constants/auth-permission.constants';
import { requirePermission } from '../../auth/middlewares/require-permission.middleware';
import { createPermissionCode } from '../../auth/utils/permission-code.util';
import {
  vendorDeleteMediaFileController,
  vendorGetMediaFileByIdController,
  vendorListMediaFilesController,
  vendorUploadMediaFileController,
} from '../controllers/media-vendor.controller';
import { singleMediaUploadMiddleware } from '../middlewares/upload.middleware';
import {
  listMediaFilesQueryValidator,
  mediaFileIdParamsValidator,
  vendorUploadMediaBodyValidator,
} from '../validators/media-upload.validator';

const router = Router();

const mediaRead = createPermissionCode(AUTH_PERMISSION_RESOURCE.MEDIA, AUTH_PERMISSION_ACTION.READ);
const mediaUpload = createPermissionCode(
  AUTH_PERMISSION_RESOURCE.MEDIA,
  AUTH_PERMISSION_ACTION.UPLOAD,
);
const mediaDelete = createPermissionCode(
  AUTH_PERMISSION_RESOURCE.MEDIA,
  AUTH_PERMISSION_ACTION.DELETE,
);

router.post(
  '/upload',
  requirePermission(mediaUpload),
  singleMediaUploadMiddleware,
  validateRequest({ body: vendorUploadMediaBodyValidator }),
  vendorUploadMediaFileController,
);

router.get(
  '/files',
  requirePermission(mediaRead),
  validateRequest({ query: listMediaFilesQueryValidator }),
  vendorListMediaFilesController,
);

router.get(
  '/files/:mediaFileId',
  requirePermission(mediaRead),
  validateRequest({ params: mediaFileIdParamsValidator }),
  vendorGetMediaFileByIdController,
);

router.delete(
  '/files/:mediaFileId',
  requirePermission(mediaDelete),
  validateRequest({ params: mediaFileIdParamsValidator }),
  vendorDeleteMediaFileController,
);

export default router;
