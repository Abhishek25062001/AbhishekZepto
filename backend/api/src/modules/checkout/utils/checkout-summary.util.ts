import type { CartItemRecord, CartRecord } from '../../cart/types/cart.types';
import type {
  CheckoutAddressSnapshot,
  CheckoutSummaryItemSnapshot,
  CheckoutSummarySnapshot,
} from '../types/checkout.types';
import type { CustomerAddressRecord } from '../../customer-addresses/models/customer-address.model';

export const buildAddressSnapshot = (
  address: CustomerAddressRecord,
): CheckoutAddressSnapshot => ({
  label: address.label,
  line1: address.line1,
  line2: address.line2,
  landmark: address.landmark,
  city: address.city,
  state: address.state,
  postalCode: address.postalCode,
  country: address.country,
  latitude: address.latitude,
  longitude: address.longitude,
});

const mapCartItemToSummaryItem = (item: CartItemRecord): CheckoutSummaryItemSnapshot => ({
  itemId: item._id!.toString(),
  productId: item.productId.toString(),
  variantId: item.variantId.toString(),
  storeProductId: item.storeProductId.toString(),
  productName: item.productNameSnapshot,
  quantity: item.quantity,
  unitPrice: item.unitPriceSnapshot,
  lineTotal: item.lineTotal,
});

export const buildCheckoutSummarySnapshot = (cart: CartRecord): CheckoutSummarySnapshot => {
  const items = cart.items.map(mapCartItemToSummaryItem);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return {
    currency: cart.currency,
    itemCount,
    subtotal: cart.subtotal,
    discountAmount: cart.discountAmount,
    taxAmount: cart.taxAmount,
    deliveryFeeAmount: cart.deliveryFeeAmount,
    grandTotal: cart.grandTotal,
    items,
  };
};
