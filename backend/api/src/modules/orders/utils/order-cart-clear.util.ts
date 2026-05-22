import { clearCartItems } from '../../cart/repositories/cart.repository';

export const clearCartAfterOrderPlacement = async (input: {
  cartId: string;
  customerId: string;
}): Promise<void> => {
  await clearCartItems(input.cartId, input.customerId);
};
