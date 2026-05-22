import { Router } from 'express';
import { validateRequest } from '../../../middlewares/validate-request.middleware';
import {
  getAgentByIdController,
  listAgentsController,
} from '../controllers/delivery-agent.controller';
import {
  adminAgentListQuerySchema,
  agentIdParamSchema,
} from '../validators/delivery-agent.validators';

const router = Router();

// ---------------------------------------------------------------------------
// GET /agents — List all delivery agents (admin).
// ---------------------------------------------------------------------------

router.get(
  '/',
  validateRequest({ query: adminAgentListQuerySchema }),
  listAgentsController,
);

// ---------------------------------------------------------------------------
// GET /agents/:agentId — Get a single delivery agent by ID (admin).
// ---------------------------------------------------------------------------

router.get(
  '/:agentId',
  validateRequest({ params: agentIdParamSchema }),
  getAgentByIdController,
);

export default router;
