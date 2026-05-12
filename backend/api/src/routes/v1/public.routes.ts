import { Router } from 'express';
import authRoutes from '../../modules/auth/routes/auth.routes';
import publicSystemRoutes from '../../modules/system/routes/public-system.routes';
import docsRoutes, { shouldExposeApiDocs } from './docs.routes';

const router = Router();

if (shouldExposeApiDocs) {
  router.use('/', docsRoutes);
}

router.use('/auth', authRoutes);
router.use('/', publicSystemRoutes);

export default router;
