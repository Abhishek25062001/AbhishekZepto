export type CartPricingChangedItem = {
  itemId: string;
  variantId: string;
  oldPrice: number;
  newPrice: number;
};

export type CartPriceDriftResult = {
  hasDrift: boolean;
  changedItems: CartPricingChangedItem[];
};

export type ResolvedCartLinePrice = {
  itemId: string;
  variantId: string;
  storeProductId: string;
  unitPrice: number;
  productName: string;
};

export type CartPricingTotals = {
  subtotal: number;
  discountAmount: number;
  taxAmount: number;
  deliveryFeeAmount: number;
  grandTotal: number;
  lastCalculatedAt: Date;
};
