import { sendSuccessResponse } from '../../../utils/api-response';
import { asyncHandler } from '../../../utils/async-handler';
import { handleRazorpayWebhookEvent } from '../services/payment-webhook.service';

export const razorpayWebhookController = asyncHandler(async (req, res) => {
  await handleRazorpayWebhookEvent(req.body);

  return sendSuccessResponse({
    res,
    message: 'Webhook received',
    data: { received: true },
    meta: { requestId: req.requestId, traceId: req.traceId },
  });
});
