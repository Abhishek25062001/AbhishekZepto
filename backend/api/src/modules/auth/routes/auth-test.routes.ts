import { Router } from 'express';
import { authTestController } from '../controllers/auth-test.controller';
import { authenticate } from '../middlewares/authenticate.middleware';
import { requirePermission } from '../middlewares/require-permission.middleware';

const router = Router();

router.get('/test-protected', authenticate(), requirePermission('auth:read'), authTestController);

export default router;
