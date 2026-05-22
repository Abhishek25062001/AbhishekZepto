import { Router } from 'express';
import authRoutes from './auth.routes';
import adminRoutes from './admin.routes';
import customerRoutes from './customer.routes';
import deliveryRoutes from './delivery.routes';
import internalRoutes from './internal.routes';
import publicRoutes from './public.routes';
import storeRoutes from './store.routes';
import vendorRoutes from './vendor.routes';
import webhooksRoutes from './webhooks.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/public', publicRoutes);
router.use('/customer', customerRoutes);
router.use('/delivery', deliveryRoutes);
router.use('/store', storeRoutes);
router.use('/vendor', vendorRoutes);
router.use('/admin', adminRoutes);
router.use('/internal', internalRoutes);
router.use('/webhooks', webhooksRoutes);

export default router;
