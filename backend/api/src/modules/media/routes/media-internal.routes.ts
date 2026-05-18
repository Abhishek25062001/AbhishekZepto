import { Router } from 'express';
import { validateRequest } from '../../../middlewares/validate-request.middleware';
import { authenticate } from '../../auth/middlewares/authenticate.middleware';
import {
  attachMediaOwnerController,
  internalGetMediaFileByIdController,
} from '../controllers/media-internal.controller';
import {
  attachMediaOwnerBodyValidator,
  mediaFileIdParamsValidator,
} from '../validators/media-upload.validator';

const router = Router();

router.post(
  '/attach-owner',
  authenticate(),
  validateRequest({ body: attachMediaOwnerBodyValidator }),
  attachMediaOwnerController,
);

router.get(
  '/files/:mediaFileId',
  authenticate(),
  validateRequest({ params: mediaFileIdParamsValidator }),
  internalGetMediaFileByIdController,
);

export default router;
