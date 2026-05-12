import { Router } from 'express';
import { authRateLimitMiddleware } from '../../../middlewares/rate-limit.middleware';
import { validateRequest } from '../../../middlewares/validate-request.middleware';
import {
  logoutController,
  refreshTokenController,
  requestOtpController,
  verifyOtpController,
} from '../controllers/auth.controller';
import {
  logoutValidator,
  refreshTokenValidator,
  requestOtpValidator,
  verifyOtpValidator,
} from '../validators/auth.validators';

const router = Router();

router.post(
  '/request-otp',
  authRateLimitMiddleware,
  validateRequest(requestOtpValidator),
  requestOtpController,
);
router.post(
  '/verify-otp',
  authRateLimitMiddleware,
  validateRequest(verifyOtpValidator),
  verifyOtpController,
);
router.post(
  '/refresh-token',
  authRateLimitMiddleware,
  validateRequest(refreshTokenValidator),
  refreshTokenController,
);
router.post(
  '/logout',
  authRateLimitMiddleware,
  validateRequest(logoutValidator),
  logoutController,
);

export default router;
