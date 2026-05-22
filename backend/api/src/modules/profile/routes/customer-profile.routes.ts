import { Router } from 'express';
import { validateRequest } from '../../../middlewares/validate-request.middleware';
import {
  getProfileController,
  updateProfileController,
} from '../controllers/profile.controller';
import { updateProfileBodyValidator } from '../validators/profile.validators';

const router = Router();

router.get('/', getProfileController);

router.patch('/', validateRequest({ body: updateProfileBodyValidator }), updateProfileController);

export default router;
