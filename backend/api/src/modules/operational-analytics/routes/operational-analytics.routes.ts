import { Router } from 'express';

import { validateRequest } from '../../../middlewares/validate-request.middleware';
import { requireAnyPermission } from '../../auth/middlewares/require-any-permission.middleware';
import { OPERATIONAL_ANALYTICS_PERMISSION_GROUPS } from '../constants/operational-analytics-permissions.constants';
import {
  getOperationalAnalyticsDeliveryController,
  getOperationalAnalyticsOrdersController,
  getOperationalAnalyticsOverviewController,
  getOperationalAnalyticsStoresController,
  getOperationalAnalyticsSupportController,
} from '../controllers/operational-analytics.controller';
import { analyticsQueryValidator } from '../validators/operational-analytics.validator';

const router = Router();

router.get(
  '/overview',
  requireAnyPermission(OPERATIONAL_ANALYTICS_PERMISSION_GROUPS.READ),
  validateRequest(analyticsQueryValidator),
  getOperationalAnalyticsOverviewController,
);

router.get(
  '/orders',
  requireAnyPermission(OPERATIONAL_ANALYTICS_PERMISSION_GROUPS.READ),
  validateRequest(analyticsQueryValidator),
  getOperationalAnalyticsOrdersController,
);

router.get(
  '/delivery',
  requireAnyPermission(OPERATIONAL_ANALYTICS_PERMISSION_GROUPS.READ),
  validateRequest(analyticsQueryValidator),
  getOperationalAnalyticsDeliveryController,
);

router.get(
  '/stores',
  requireAnyPermission(OPERATIONAL_ANALYTICS_PERMISSION_GROUPS.READ),
  validateRequest(analyticsQueryValidator),
  getOperationalAnalyticsStoresController,
);

router.get(
  '/support',
  requireAnyPermission(OPERATIONAL_ANALYTICS_PERMISSION_GROUPS.READ),
  validateRequest(analyticsQueryValidator),
  getOperationalAnalyticsSupportController,
);

export default router;
