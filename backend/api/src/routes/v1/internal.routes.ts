import { Router } from 'express';
import authTestRoutes from '../../modules/auth/routes/auth-test.routes';
import systemCheckRoutes from '../../modules/system/routes/system-check.routes';
import inventoryLockInternalRoutes from '../../modules/inventory/locks/routes/inventory-lock-internal.routes';
import mediaInternalRoutes from '../../modules/media/routes/media-internal.routes';
import tenantAccessTestRoutes from '../../modules/system/routes/tenant-access-test.routes';
import deliverySlaInternalRoutes from '../../modules/delivery/routes/delivery-sla-internal.routes';
import { sendSuccessResponse } from '../../utils/api-response';

const router = Router();

router.use('/auth', authTestRoutes);
router.use('/system', systemCheckRoutes);
router.use('/tenant-access', tenantAccessTestRoutes);
router.use('/inventory/locks', inventoryLockInternalRoutes);
router.use('/media', mediaInternalRoutes);
router.use('/delivery-sla', deliverySlaInternalRoutes);

router.get('/', (_req, res) => {
  return sendSuccessResponse({
    res,
    message: 'Internal API route group ready',
    data: {},
  });
});

export default router;
