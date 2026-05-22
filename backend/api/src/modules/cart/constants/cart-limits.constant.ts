import { env } from '../../../config/env';

const DEFAULT_CART_MAX_QUANTITY_PER_LINE = 10;

export const getCartMaxQuantityPerLine = (): number =>
  env.CART_MAX_QUANTITY_PER_LINE ?? DEFAULT_CART_MAX_QUANTITY_PER_LINE;
