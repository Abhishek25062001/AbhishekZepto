import { z } from 'zod';
import { mongoObjectIdValidator } from '../../../validators/common.validators';
import { getCartMaxQuantityPerLine } from '../constants/cart-limits.constant';

const quantityValidator = z.coerce
  .number()
  .int()
  .min(1)
  .max(getCartMaxQuantityPerLine());

const storeIdQueryValidator = z.object({
  storeId: mongoObjectIdValidator,
});

export const getCartQueryValidator = storeIdQueryValidator
  .extend({
    validatePrices: z
      .enum(['true', 'false'])
      .transform((value) => value === 'true')
      .optional(),
  })
  .strict();

export const clearCartQueryValidator = storeIdQueryValidator.strict();

export const recalculateCartBodyValidator = z
  .object({
    storeId: mongoObjectIdValidator,
  })
  .strict();

export const addCartItemBodyValidator = z
  .object({
    storeId: mongoObjectIdValidator,
    variantId: mongoObjectIdValidator,
    quantity: quantityValidator,
  })
  .strict();

export const updateCartItemBodyValidator = z
  .object({
    quantity: quantityValidator,
  })
  .strict();

export const updateCartItemQueryValidator = storeIdQueryValidator.strict();

export const cartItemIdParamsValidator = z
  .object({
    itemId: mongoObjectIdValidator,
  })
  .strict();

export const removeCartItemQueryValidator = getCartQueryValidator;
