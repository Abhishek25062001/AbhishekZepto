import { Router } from 'express';
import { validateRequest } from '../../../middlewares/validate-request.middleware';
import {
  addCartItemController,
  clearCartController,
  getCartController,
  recalculateCartController,
  removeCartItemController,
  updateCartItemController,
} from '../controllers/cart.controller';
import {
  addCartItemBodyValidator,
  cartItemIdParamsValidator,
  clearCartQueryValidator,
  getCartQueryValidator,
  recalculateCartBodyValidator,
  removeCartItemQueryValidator,
  updateCartItemBodyValidator,
  updateCartItemQueryValidator,
} from '../validators/cart.validators';

const router = Router();

router.get('/', validateRequest({ query: getCartQueryValidator }), getCartController);

router.post(
  '/recalculate',
  validateRequest({ body: recalculateCartBodyValidator }),
  recalculateCartController,
);

router.post(
  '/items',
  validateRequest({ body: addCartItemBodyValidator }),
  addCartItemController,
);

router.patch(
  '/items/:itemId',
  validateRequest({
    params: cartItemIdParamsValidator,
    query: updateCartItemQueryValidator,
    body: updateCartItemBodyValidator,
  }),
  updateCartItemController,
);

router.delete(
  '/items/:itemId',
  validateRequest({
    params: cartItemIdParamsValidator,
    query: removeCartItemQueryValidator,
  }),
  removeCartItemController,
);

router.delete('/', validateRequest({ query: clearCartQueryValidator }), clearCartController);

export default router;
