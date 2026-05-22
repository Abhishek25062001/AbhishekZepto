import { env } from '../../../config/env';

const DEFAULT_TAX_RATE_PERCENT = 0;
const DEFAULT_DELIVERY_FEE_AMOUNT = 0;

export const getCartTaxRatePercent = (): number =>
  env.CART_TAX_RATE_PERCENT ?? DEFAULT_TAX_RATE_PERCENT;

export const getCartDeliveryFeeAmount = (): number =>
  env.CART_DELIVERY_FEE_AMOUNT ?? DEFAULT_DELIVERY_FEE_AMOUNT;
