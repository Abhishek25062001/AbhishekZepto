import { Router } from 'express';
import authTestRoutes from '../../modules/auth/routes/auth-test.routes';
import systemCheckRoutes from '../../modules/system/routes/system-check.routes';
import { sendSuccessResponse } from '../../utils/api-response';

const router = Router();

router.use('/auth', authTestRoutes);
router.use('/system', systemCheckRoutes);

router.get('/', (_req, res) => {
  return sendSuccessResponse({
    res,
    message: 'Internal API route group ready',
    data: {},
  });
});

export default router;
