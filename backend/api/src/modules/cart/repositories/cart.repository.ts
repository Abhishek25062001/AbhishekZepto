import { Types } from 'mongoose';
import { CART_STATUS } from '../constants/cart-status.constant';
import { CartModel } from '../models/cart.model';
import type { CartRecord } from '../types/cart.types';

export const findActiveCartByCustomerAndStore = async (
  customerId: string,
  storeId: string,
): Promise<(CartRecord & { _id: Types.ObjectId }) | null> => {
  if (!Types.ObjectId.isValid(customerId) || !Types.ObjectId.isValid(storeId)) {
    return null;
  }

  return CartModel.findOne({
    customerId: new Types.ObjectId(customerId),
    storeId: new Types.ObjectId(storeId),
    status: CART_STATUS.ACTIVE,
  }).lean();
};

export const createCart = async (
  payload: Partial<CartRecord>,
): Promise<CartRecord & { _id: Types.ObjectId }> => {
  const created = await CartModel.create(payload);
  return created.toObject() as CartRecord & { _id: Types.ObjectId };
};

export const saveCart = async (
  cartId: string,
  customerId: string,
  payload: Partial<CartRecord>,
): Promise<(CartRecord & { _id: Types.ObjectId }) | null> => {
  if (!Types.ObjectId.isValid(cartId) || !Types.ObjectId.isValid(customerId)) {
    return null;
  }

  return CartModel.findOneAndUpdate(
    {
      _id: new Types.ObjectId(cartId),
      customerId: new Types.ObjectId(customerId),
      status: CART_STATUS.ACTIVE,
    },
    { $set: payload },
    { new: true },
  ).lean();
};

export const clearCartItems = async (
  cartId: string,
  customerId: string,
): Promise<(CartRecord & { _id: Types.ObjectId }) | null> => {
  const now = new Date();

  return saveCart(cartId, customerId, {
    items: [],
    subtotal: 0,
    discountAmount: 0,
    taxAmount: 0,
    deliveryFeeAmount: 0,
    grandTotal: 0,
    lastCalculatedAt: now,
  });
};
