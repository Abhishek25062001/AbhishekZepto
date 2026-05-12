import { Router } from 'express';
import adminRoutes from './admin.routes';
import customerRoutes from './customer.routes';
import deliveryRoutes from './delivery.routes';
import internalRoutes from './internal.routes';
import publicRoutes from './public.routes';
import vendorRoutes from './vendor.routes';

const router = Router();

router.use('/public', publicRoutes);
router.use('/customer', customerRoutes);
router.use('/delivery', deliveryRoutes);
router.use('/vendor', vendorRoutes);
router.use('/admin', adminRoutes);
router.use('/internal', internalRoutes);

export default router;
