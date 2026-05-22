export type CreatePaymentOrderInput = {
  checkoutSessionId: string;
  idempotencyKey: string;
};

export type CreatePaymentOrderResponse = {
  paymentId: string;
  razorpayOrderId: string;
  amount: number;
  currency: string;
  keyId: string;
};

export type VerifyPaymentInput = {
  paymentId: string;
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
};

export type VerifyPaymentResponse = {
  paymentId: string;
  status: 'paid';
  orderId: string | null;
};

export type RazorpayCheckoutSuccess = {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
};

export type OpenRazorpayCheckoutInput = {
  keyId: string;
  razorpayOrderId: string;
  amount: number;
  currency: string;
  name?: string;
  description?: string;
};
