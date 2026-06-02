import { Router } from 'express';

import { validateRequest } from '../../../middlewares/validate-request.middleware';
import { requireAnyPermission } from '../../auth/middlewares/require-any-permission.middleware';
import { SUPPORT_OPERATIONS_PERMISSION_GROUPS } from '../constants/support-operations-permissions.constants';
import {
  createSupportTicketController,
  createSupportTicketNoteController,
  getSupportTicketController,
  listSupportTicketAuditController,
  listSupportTicketNotesController,
  listSupportTicketsController,
  updateSupportTicketAssignmentController,
  updateSupportTicketPriorityController,
  updateSupportTicketStatusController,
} from '../controllers/support-operations.controller';
import {
  createSupportTicketValidator,
  createSupportTicketNoteValidator,
  listSupportTicketsQueryValidator,
  supportTicketIdParamValidator,
  updateSupportTicketAssignmentValidator,
  updateSupportTicketPriorityValidator,
  updateSupportTicketStatusValidator,
} from '../validators/support-ticket.validator';

const router = Router();

router.post('/tickets', requireAnyPermission(SUPPORT_OPERATIONS_PERMISSION_GROUPS.CREATE), validateRequest(createSupportTicketValidator), createSupportTicketController);
router.get('/tickets', requireAnyPermission(SUPPORT_OPERATIONS_PERMISSION_GROUPS.READ), validateRequest(listSupportTicketsQueryValidator), listSupportTicketsController);
router.get('/tickets/:ticketId', requireAnyPermission(SUPPORT_OPERATIONS_PERMISSION_GROUPS.READ), validateRequest(supportTicketIdParamValidator), getSupportTicketController);
router.patch('/tickets/:ticketId/status', requireAnyPermission(SUPPORT_OPERATIONS_PERMISSION_GROUPS.UPDATE), validateRequest(supportTicketIdParamValidator), validateRequest(updateSupportTicketStatusValidator), updateSupportTicketStatusController);
router.patch('/tickets/:ticketId/priority', requireAnyPermission(SUPPORT_OPERATIONS_PERMISSION_GROUPS.UPDATE), validateRequest(supportTicketIdParamValidator), validateRequest(updateSupportTicketPriorityValidator), updateSupportTicketPriorityController);
router.patch('/tickets/:ticketId/assignment', requireAnyPermission(SUPPORT_OPERATIONS_PERMISSION_GROUPS.ASSIGN), validateRequest(supportTicketIdParamValidator), validateRequest(updateSupportTicketAssignmentValidator), updateSupportTicketAssignmentController);
router.get('/tickets/:ticketId/notes', requireAnyPermission(SUPPORT_OPERATIONS_PERMISSION_GROUPS.READ), validateRequest(supportTicketIdParamValidator), listSupportTicketNotesController);
router.post('/tickets/:ticketId/notes', requireAnyPermission(SUPPORT_OPERATIONS_PERMISSION_GROUPS.UPDATE), validateRequest(supportTicketIdParamValidator), validateRequest(createSupportTicketNoteValidator), createSupportTicketNoteController);
router.get('/tickets/:ticketId/audit', requireAnyPermission(SUPPORT_OPERATIONS_PERMISSION_GROUPS.AUDIT), validateRequest(supportTicketIdParamValidator), listSupportTicketAuditController);

export default router;
