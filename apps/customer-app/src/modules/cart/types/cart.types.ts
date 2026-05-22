export type CartItem = {
  id: string;
  productId: string;
  variantId: string;
  storeProductId: string;
  quantity: number;
  unitPriceSnapshot: number;
  lineTotal: number;
  productNameSnapshot: string | null;
};

export type Cart = {
  id: string;
  storeId: string;
  status: string;
  currency: string;
  items: CartItem[];
  subtotal: number;
  discountAmount: number;
  taxAmount: number;
  deliveryFeeAmount: number;
  grandTotal: number;
};

export type AddCartItemInput = {
  storeId: string;
  variantId: string;
  quantity: number;
};

export type UpdateCartItemInput = {
  storeId: string;
  itemId: string;
  quantity: number;
};
