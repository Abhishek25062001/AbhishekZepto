export type PaymentGateway = 'razorpay' | 'cashfree_placeholder' | 'stripe_placeholder' | 'manual_placeholder';

export type PaymentStatus =
  | 'created'
  | 'pending'
  | 'authorized'
  | 'paid'
  | 'failed'
  | 'cancelled'
  | 'refunded'
  | 'partially_refunded'
  | 'expired';

export type PaymentMethod =
  | 'upi'
  | 'card'
  | 'netbanking'
  | 'wallet'
  | 'cod_placeholder'
  | 'unknown';

export type CreatePaymentOrderRequest = {
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

export type VerifyPaymentRequest = {
  gatewayOrderId?: string;
  gatewayPaymentId?: string;
  gatewaySignature?: string;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;
};

export type PaymentRecordResponse = {
  paymentId: string;
  orderId: string | null;
  gateway: PaymentGateway;
  gatewayOrderId: string;
  gatewayPaymentId: string | null;
  amount: number;
  currency: string;
  status: PaymentStatus;
  createdAt: string;
  updatedAt: string;
};

export type AdminPaymentRecordResponse = PaymentRecordResponse & {
  customerId: string;
  storeId: string | null;
  vendorId: string | null;
  cityId: string | null;
  payableAmount: number | null;
  refundedAmount: number;
  paidAt: string | null;
  failedAt: string | null;
};

export type AdminPaymentListQuery = {
  page?: number;
  limit?: number;
  customerId?: string;
  orderId?: string;
  storeId?: string;
  vendorId?: string;
  cityId?: string;
  paymentStatus?: PaymentStatus;
  gateway?: PaymentGateway;
  paymentMethod?: PaymentMethod;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
};

export type AdminPaymentListResponse = {
  items: AdminPaymentRecordResponse[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
};
