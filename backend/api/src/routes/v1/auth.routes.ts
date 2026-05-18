import { Router } from 'express';
import { authenticate } from '../../modules/auth/middlewares/authenticate.middleware';
import {
  listMySessionsController,
  logoutOtherSessionsController,
  logoutSessionController,
} from '../../modules/auth/controllers';
import { validateRequest } from '../../middlewares/validate-request.middleware';
import {
  logoutOtherSessionsValidator,
  logoutSessionValidator,
} from '../../modules/auth/validators/auth.validators';

const router = Router();

router.get('/me/sessions', authenticate(), listMySessionsController);
router.post(
  '/logout-session',
  authenticate(),
  validateRequest(logoutSessionValidator),
  logoutSessionController,
);
router.post(
  '/logout-other-sessions',
  authenticate(),
  validateRequest(logoutOtherSessionsValidator),
  logoutOtherSessionsController,
);

export default router;
