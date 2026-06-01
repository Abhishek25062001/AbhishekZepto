import { Router } from 'express';

import { validateRequest } from '../../../middlewares/validate-request.middleware';
import {
  endAdminControlSessionController,
  heartbeatAdminControlSessionController,
  listActiveAdminControlSessionsController,
  startAdminControlSessionController,
} from '../controllers/admin-control-session.controller';
import {
  getAdminControlLiveOverviewController,
  listAdminControlEscalationsController,
  listAdminControlLiveAgentsController,
  listAdminControlLiveOrdersController,
  listAdminControlLiveStoresController,
} from '../controllers/admin-control-live.controller';
import {
  escalateSlaController,
  forceAgentOfflineController,
  forceAssignAgentController,
  forceCancelOrderController,
  forceCloseStoreController,
  reopenStoreController,
  restoreAgentOnlineController,
  unassignAgentController,
} from '../controllers/admin-control-operation.controller';
import {
  adminActionReasonBodyValidator,
  agentIdParamValidator,
  forceAssignAgentBodyValidator,
  orderIdParamValidator,
  slaEscalationBodyValidator,
  slaIdParamValidator,
  storeIdParamValidator,
} from '../validators/admin-control-operation.validator';
import { adminControlLiveQueryValidator } from '../validators/admin-control-live.validator';
import {
  adminControlSessionBodyValidator,
  createAdminControlSessionBodyValidator,
} from '../validators/admin-control-session.validator';

const router = Router();

router.post(
  '/session/start',
  validateRequest({ body: createAdminControlSessionBodyValidator }),
  startAdminControlSessionController,
);

router.post(
  '/session/end',
  validateRequest({ body: adminControlSessionBodyValidator }),
  endAdminControlSessionController,
);

router.post(
  '/session/heartbeat',
  validateRequest({ body: adminControlSessionBodyValidator }),
  heartbeatAdminControlSessionController,
);

router.get('/sessions/active', listActiveAdminControlSessionsController);

router.get(
  '/live-overview',
  validateRequest({ query: adminControlLiveQueryValidator }),
  getAdminControlLiveOverviewController,
);

router.get(
  '/live-orders',
  validateRequest({ query: adminControlLiveQueryValidator }),
  listAdminControlLiveOrdersController,
);

router.get(
  '/live-agents',
  validateRequest({ query: adminControlLiveQueryValidator }),
  listAdminControlLiveAgentsController,
);

router.get(
  '/live-stores',
  validateRequest({ query: adminControlLiveQueryValidator }),
  listAdminControlLiveStoresController,
);

router.get(
  '/escalations',
  validateRequest({ query: adminControlLiveQueryValidator }),
  listAdminControlEscalationsController,
);

router.post(
  '/order/:orderId/force-cancel',
  validateRequest({ params: orderIdParamValidator, body: adminActionReasonBodyValidator }),
  forceCancelOrderController,
);

router.post(
  '/order/:orderId/force-assign-agent',
  validateRequest({ params: orderIdParamValidator, body: forceAssignAgentBodyValidator }),
  forceAssignAgentController,
);

router.post(
  '/order/:orderId/unassign-agent',
  validateRequest({ params: orderIdParamValidator, body: adminActionReasonBodyValidator }),
  unassignAgentController,
);

router.post(
  '/store/:storeId/force-close',
  validateRequest({ params: storeIdParamValidator, body: adminActionReasonBodyValidator }),
  forceCloseStoreController,
);

router.post(
  '/store/:storeId/reopen',
  validateRequest({ params: storeIdParamValidator, body: adminActionReasonBodyValidator }),
  reopenStoreController,
);

router.post(
  '/agent/:agentId/force-offline',
  validateRequest({ params: agentIdParamValidator, body: adminActionReasonBodyValidator }),
  forceAgentOfflineController,
);

router.post(
  '/agent/:agentId/restore-online',
  validateRequest({ params: agentIdParamValidator, body: adminActionReasonBodyValidator }),
  restoreAgentOnlineController,
);

router.post(
  '/sla/:slaId/escalate',
  validateRequest({ params: slaIdParamValidator, body: slaEscalationBodyValidator }),
  escalateSlaController,
);

export default router;
