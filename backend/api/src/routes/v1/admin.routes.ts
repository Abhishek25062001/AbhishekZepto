import { Router } from 'express';
import { sendSuccessResponse } from '../../utils/api-response';

const router = Router();

router.get('/', (_req, res) => {
  return sendSuccessResponse({
    res,
    message: 'Admin API route group ready',
    data: {},
  });
});

export default router;
