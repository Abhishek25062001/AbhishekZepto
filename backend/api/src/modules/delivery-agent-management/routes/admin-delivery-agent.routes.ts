import { Router } from 'express';

import { requireAnyPermission } from '../../auth/middlewares/require-any-permission.middleware';
import { validateRequest } from '../../../middlewares/validate-request.middleware';
import { DELIVERY_AGENT_MANAGEMENT_PERMISSION_GROUPS } from '../constants/admin-delivery-agent-permissions.constants';
import {
  getDeliveryAgentController,
  listDeliveryAgentAssignmentsController,
  listDeliveryAgentAuditController,
  listDeliveryAgentsController,
  updateDeliveryAgentStatusController,
  updateDeliveryAgentVerificationController,
} from '../controllers/admin-delivery-agent.controller';
import {
  deliveryAgentIdParamValidator,
  listDeliveryAgentAssignmentsQueryValidator,
  listDeliveryAgentAuditQueryValidator,
  listDeliveryAgentsQueryValidator,
  updateDeliveryAgentStatusValidator,
  updateDeliveryAgentVerificationValidator,
} from '../validators/admin-delivery-agent.validator';

const router = Router();

router.get('/', requireAnyPermission(DELIVERY_AGENT_MANAGEMENT_PERMISSION_GROUPS.READ), validateRequest(listDeliveryAgentsQueryValidator), listDeliveryAgentsController);
router.get('/:deliveryAgentId/assignments', requireAnyPermission(DELIVERY_AGENT_MANAGEMENT_PERMISSION_GROUPS.READ), validateRequest(deliveryAgentIdParamValidator), validateRequest(listDeliveryAgentAssignmentsQueryValidator), listDeliveryAgentAssignmentsController);
router.get('/:deliveryAgentId/audit', requireAnyPermission(DELIVERY_AGENT_MANAGEMENT_PERMISSION_GROUPS.AUDIT), validateRequest(deliveryAgentIdParamValidator), validateRequest(listDeliveryAgentAuditQueryValidator), listDeliveryAgentAuditController);
router.get('/:deliveryAgentId', requireAnyPermission(DELIVERY_AGENT_MANAGEMENT_PERMISSION_GROUPS.READ), validateRequest(deliveryAgentIdParamValidator), getDeliveryAgentController);
router.patch('/:deliveryAgentId/status', requireAnyPermission(DELIVERY_AGENT_MANAGEMENT_PERMISSION_GROUPS.STATUS), validateRequest(deliveryAgentIdParamValidator), validateRequest(updateDeliveryAgentStatusValidator), updateDeliveryAgentStatusController);
router.patch('/:deliveryAgentId/verification', requireAnyPermission(DELIVERY_AGENT_MANAGEMENT_PERMISSION_GROUPS.VERIFICATION), validateRequest(deliveryAgentIdParamValidator), validateRequest(updateDeliveryAgentVerificationValidator), updateDeliveryAgentVerificationController);

export default router;
