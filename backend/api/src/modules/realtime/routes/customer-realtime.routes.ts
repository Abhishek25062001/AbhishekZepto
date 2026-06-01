import { Router } from 'express';

import { validateRequest } from '../../../middlewares/validate-request.middleware';
import {
  getCustomerMissedEventsController,
  ackCustomerEventController,
} from '../controllers/customer-realtime.controller';
import { ackEventParamsValidator } from '../validators/realtime.validator';

const router = Router();

router.get('/missed-events', getCustomerMissedEventsController);
router.post('/events/:eventId/ack', validateRequest({ params: ackEventParamsValidator }), ackCustomerEventController);

export default router;
