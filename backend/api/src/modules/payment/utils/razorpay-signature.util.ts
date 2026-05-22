import crypto from 'node:crypto';

export const verifyRazorpayPaymentSignature = (input: {
  orderId: string;
  paymentId: string;
  signature: string;
  secret: string;
}): boolean => {
  const payload = `${input.orderId}|${input.paymentId}`;
  const expected = crypto.createHmac('sha256', input.secret).update(payload).digest('hex');

  return expected === input.signature;
};

export const verifyRazorpayWebhookSignature = (input: {
  rawBody: Buffer | string;
  signature: string;
  webhookSecret: string;
}): boolean => {
  const body = typeof input.rawBody === 'string' ? input.rawBody : input.rawBody.toString('utf8');
  const expected = crypto
    .createHmac('sha256', input.webhookSecret)
    .update(body)
    .digest('hex');

  return expected === input.signature;
};
