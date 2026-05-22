export type CheckoutSummaryItem = {
  itemId: string;
  productId: string;
  variantId: string;
  storeProductId: string;
  productName: string | null;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
};

export type CheckoutSummary = {
  currency: string;
  itemCount: number;
  subtotal: number;
  discountAmount: number;
  taxAmount: number;
  deliveryFeeAmount: number;
  grandTotal: number;
  items: CheckoutSummaryItem[];
};

export type InitiateCheckoutInput = {
  addressId: string;
  storeId?: string;
  idempotencyKey?: string;
};

export type InitiateCheckoutResponse = {
  checkoutSessionId: string;
  reservationExpiresAt: string;
  lockTokens: string[];
  summary: CheckoutSummary;
};

export type CancelCheckoutInput = {
  checkoutSessionId: string;
  reason?: string;
};

export type GetCheckoutSummaryQuery = {
  checkoutSessionId?: string;
};

export type CheckoutSessionResponse = {
  checkoutSessionId: string;
  status: string;
  reservationExpiresAt: string;
  storeId: string;
  addressId: string;
  lockTokens: string[];
  summary: CheckoutSummary;
};
